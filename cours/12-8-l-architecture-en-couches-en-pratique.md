## 8. L'architecture en couches en pratique

On concrétise ici la théorie de la Partie I. Le flux complet d'une requête HTTP :

```
Client HTTP
    │  POST /api/demandes
    ▼
Controller  ← reçoit, valide le FORMAT (Data Annotations)
    │  délègue
    ▼
Service     ← applique les RÈGLES MÉTIER (solde, dates, chevauchement)
    │  délègue
    ▼
Repository  ← exécute le SQL paramétré
    │  requête
    ▼
Base de données
```

Chaque couche a une responsabilité unique. Les dépendances vont toujours vers le bas — le Controller connaît le Service, le Service connaît le Repository, jamais l'inverse.

---

### 8.1 La classe Resultat — objet de retour du Service

Le Service ne retourne ni `true/false`, ni n'envoie d'exceptions pour les erreurs métier normales. Il retourne un objet `Resultat` qui porte le succès ou l'échec avec un message.

```csharp
// Classe utilitaire définie une fois, utilisée dans tout le projet
public class Resultat
{
    public bool   Succes  { get; private set; }
    public string Message { get; private set; } = "";
    public int    Id      { get; private set; }

    // Méthodes statiques de création (pattern Factory)
    public static Resultat Ok()           => new() { Succes = true };
    public static Resultat Ok(int id)     => new() { Succes = true, Id = id };
    public static Resultat Erreur(string msg) => new() { Succes = false, Message = msg };
}
```

Utilisation dans le Controller :
```csharp
var res = _service.Deposer(idSalarie, dto);
// res.Succes indique si tout s'est bien passé
// res.Message contient le motif si erreur
// res.Id contient l'identifiant créé si succès
```

---

### 8.2 Le Model / DTO

Les **entités** représentent les données telles qu'elles existent en base. Les **DTO** (*Data Transfer Objects*) sont des objets allégés qui transportent uniquement les données nécessaires à un échange précis.

```csharp
// ← ENTITÉ : reflet exact de la table en base
public class Demande
{
    public int      Id        { get; set; }
    public DateOnly DateDebut { get; set; }
    public DateOnly DateFin   { get; set; }
    public string   Statut    { get; set; } = "EN_ATTENTE";
    public int      IdSalarie { get; set; }
}

// ← DTO D'ENTRÉE : ce que le client envoie au POST
//   Pas d'Id (généré par la BDD), pas de Statut (toujours EN_ATTENTE à la création)
public class DemandeCreationDto
{
    [Required] public DateOnly DateDebut { get; set; }
    [Required] public DateOnly DateFin   { get; set; }
}

// ← DTO DE SORTIE : ce que l'API renvoie au client
//   Enrichi avec le nom du salarié (jointure), sans les données internes
public class DemandeReponseDto
{
    public int    Id         { get; set; }
    public string DateDebut  { get; set; } = "";
    public string DateFin    { get; set; } = "";
    public string Statut     { get; set; } = "";
    public string NomSalarie { get; set; } = ""; // ← vient d'une jointure, pas de l'entité
}
```

**Pourquoi des DTO ?** L'entité `Salarie` contient potentiellement un hash de mot de passe, des données internes, des clés étrangères… On ne veut pas tout exposer dans la réponse API. Le DTO définit précisément ce qui sort.

---

### 8.3 Le Repository — deux approches possibles

Le Repository centralise toutes les requêtes vers la base. Il existe deux grandes façons de l'implémenter :

**Approche 1 — ADO.NET (SQL direct)** : on écrit le SQL à la main, on paramètre manuellement.

```csharp
public class DemandeRepository : IDemandeRepository
{
    private readonly string _connString;
    public DemandeRepository(string connString) => _connString = connString;

    public List<Demande> GetParSalarie(int idSalarie)
    {
        var list = new List<Demande>();
        using var conn = new SqlConnection(_connString);
        var sql = @"SELECT idDemande, dateDebut, dateFin, statut
                    FROM Demande WHERE idSalarie = @id ORDER BY dateDebut DESC";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@id", idSalarie); // ← paramétré, anti-injection SQL
        conn.Open();
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
            list.Add(new Demande {
                Id = reader.GetInt32(0),
                DateDebut = DateOnly.FromDateTime(reader.GetDateTime(1)),
                DateFin   = DateOnly.FromDateTime(reader.GetDateTime(2)),
                Statut    = reader.GetString(3)
            });
        return list;
    }
}
```

**Approche 2 — Entity Framework Core (ORM)** : on écrit en LINQ, EF génère le SQL paramétré automatiquement.

```csharp
public class DemandeRepository : IDemandeRepository
{
    private readonly AppDbContext _db;
    public DemandeRepository(AppDbContext db) => _db = db;

    public List<Demande> GetParSalarie(int idSalarie)
    {
        // EF traduit ce LINQ en : SELECT ... FROM Demande WHERE IdSalarie = @p0 ORDER BY DateDebut DESC
        return _db.Demandes
            .Where(d => d.IdSalarie == idSalarie)
            .OrderByDescending(d => d.DateDebut)
            .ToList();
    }

    public int Inserer(Demande d)
    {
        _db.Demandes.Add(d);
        _db.SaveChanges();
        return d.Id; // EF remplit l'Id après SaveChanges
    }
}
```

**Lequel choisir ?** EF Core est recommandé pour la plupart des projets : moins de code, paramétrage automatique, migrations de schéma. ADO.NET est utile pour des requêtes très complexes ou des performances critiques.

---

### 8.4 Le Service — couche métier

Le Service applique les **règles métier**. Il ne connaît pas HTTP, ne fait pas de SQL — il délègue au Repository via les interfaces.

```csharp
public class ServiceConges : IServiceConges
{
    private readonly IDemandeRepository  _repo;
    private readonly ISalarieRepository  _salarieRepo;

    // ← Les dépendances sont des INTERFACES, jamais des classes concrètes (DIP)
    public ServiceConges(IDemandeRepository repo, ISalarieRepository salarieRepo)
    {
        _repo        = repo;
        _salarieRepo = salarieRepo;
    }

    public Resultat Deposer(int idSalarie, DemandeCreationDto dto)
    {
        // ← Règle 1 : validation métier (pas de format — c'est le rôle des Data Annotations)
        if (dto.DateFin < dto.DateDebut)
            return Resultat.Erreur("La date de fin doit être après la date de début.");

        // ← Règle 2 : vérification du solde disponible
        int nbJours = (dto.DateFin.DayNumber - dto.DateDebut.DayNumber) + 1;
        var salarie  = _salarieRepo.GetParId(idSalarie);
        if (salarie.SoldeConges < nbJours)
            return Resultat.Erreur($"Solde insuffisant ({salarie.SoldeConges} j disponibles).");

        // ← Règle 3 : pas de chevauchement avec une demande existante
        bool chevauchement = _repo.GetParSalarie(idSalarie)
            .Any(d => d.Statut != "REFUSEE"
                   && d.DateDebut <= dto.DateFin
                   && d.DateFin   >= dto.DateDebut);
        if (chevauchement)
            return Resultat.Erreur("Une demande existe déjà sur cette période.");

        int id = _repo.Inserer(new Demande {
            IdSalarie = idSalarie,
            DateDebut = dto.DateDebut,
            DateFin   = dto.DateFin
        });
        return Resultat.Ok(id);
    }
}
```

---

### 8.5 Le Controller

Le Controller reçoit les requêtes HTTP, **valide le format** (via `ModelState`) et **délègue** au Service. Pas de SQL, pas de règles métier.

```csharp
[ApiController]
[Route("api/demandes")]
public class DemandesController : ControllerBase
{
    private readonly IServiceConges _service;

    // ← Injection du Service via le constructeur (DIP)
    public DemandesController(IServiceConges service) => _service = service;

    [HttpPost]
    [Authorize]
    public IActionResult Creer([FromBody] DemandeCreationDto dto)
    {
        // ← Niveau 1 de validation : format (Data Annotations sur le DTO)
        if (!ModelState.IsValid) return BadRequest(ModelState); // 400

        int idSalarie = int.Parse(User.FindFirst("sub")!.Value);

        // ← Délègue au Service pour le niveau 2 : règles métier
        var res = _service.Deposer(idSalarie, dto);

        return res.Succes
            ? CreatedAtAction(nameof(Get), new { id = res.Id }, null) // 201
            : BadRequest(res.Message);                                 // 400 métier
    }
}
```

**Les deux niveaux de validation :**

| Niveau | Où | Quoi | Exemple |
| --- | --- | --- | --- |
| **Niveau 1 — Format** | Controller (Data Annotations) | Types, tailles, formats | DateDebut obligatoire, Email valide |
| **Niveau 2 — Métier** | Service | Règles business | Solde suffisant, pas de chevauchement |

---

### 8.6 Injection de dépendances (Program.cs)

L'injection de dépendances est le mécanisme qui résout automatiquement les interfaces vers leurs implémentations concrètes. On configure tout au démarrage de l'application :

```csharp
// Program.cs — enregistrement des services
builder.Services.AddScoped<IDemandeRepository,  DemandeRepository>();
builder.Services.AddScoped<ISalarieRepository,  SalarieRepository>();
builder.Services.AddScoped<IServiceConges,      ServiceConges>();

// ASP.NET Core injecte automatiquement les dépendances dans les constructeurs
// Quand le Controller demande un IServiceConges, il reçoit un ServiceConges
```

**Durées de vie :**
- `AddScoped` → une instance par requête HTTP (le plus courant)
- `AddSingleton` → une seule instance pour toute la durée de vie de l'app
- `AddTransient` → une nouvelle instance à chaque injection

**En test**, on remplace les implémentations réelles par des fausses :
```csharp
// Dans les tests
services.AddScoped<IDemandeRepository, FakeDemandeRepository>();
// ServiceConges reçoit le fake sans aucune modification de son code
```

> **📌 Règle d'or :** les dépendances vont **toujours vers le bas**. Controller → Service → Repository → BDD. Aucune couche ne connaît celle du dessus.
