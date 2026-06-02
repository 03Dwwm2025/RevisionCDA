## 8. L'architecture en couches en pratique

On concrétise ici la théorie de la Partie I. Le flux complet : le **Controller** reçoit la requête HTTP, délègue au **Service** (logique métier), qui passe par le **Repository** (accès données), qui dialogue avec la **BDD**. Les **DTO/Models** transportent les données entre les couches.

### 8.1 Le Model / DTO

Les **entités** représentent les données telles qu'elles existent en base. Les **DTO** (*Data Transfer Objects*) sont des objets allégés qui transportent uniquement les données nécessaires à un échange précis.

```csharp
// Entité (côté base de données)
public class Demande
{
    public int      Id        { get; set; }
    public DateOnly DateDebut { get; set; }
    public DateOnly DateFin   { get; set; }
    public string   Statut    { get; set; } = "EN_ATTENTE";
    public int      IdSalarie { get; set; }
}

// DTO d'entrée (ce que le client envoie — pas d'Id, pas de Statut)
public class DemandeCreationDto
{
    [Required] public DateOnly DateDebut { get; set; }
    [Required] public DateOnly DateFin   { get; set; }
}

// DTO de sortie (ce que l'API renvoie — enrichi avec le nom du salarié)
public class DemandeReponseDto
{
    public int    Id        { get; set; }
    public string DateDebut { get; set; } = "";
    public string DateFin   { get; set; } = "";
    public string Statut    { get; set; } = "";
    public string NomSalarie { get; set; } = "";
}
```

**Pourquoi des DTO ?** On ne veut jamais exposer directement l'entité : elle peut contenir des champs sensibles (hash du mot de passe, données internes) ou des données non pertinentes pour le client.

---

### 8.2 Le Repository (accès aux données)

Le Repository centralise **toutes les requêtes SQL** d'un domaine. Point crucial : toujours des **requêtes paramétrées**, jamais de concaténation de chaînes (cf. injection SQL).

```csharp
public class DemandeRepository : IDemandeRepository
{
    private readonly string _connString;
    public DemandeRepository(string connString) => _connString = connString;

    public List<Demande> GetParSalarie(int idSalarie)
    {
        var list = new List<Demande>();
        using var conn = new SqlConnection(_connString);
        // ✅ SELECT avec colonnes nommées (jamais SELECT *)
        var sql = @"SELECT idDemande, dateDebut, dateFin, statut
                    FROM Demande
                    WHERE idSalarie = @id
                    ORDER BY dateDebut DESC";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@id", idSalarie); // ✅ paramétré
        conn.Open();
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            list.Add(new Demande
            {
                Id        = reader.GetInt32(0),
                DateDebut = DateOnly.FromDateTime(reader.GetDateTime(1)),
                DateFin   = DateOnly.FromDateTime(reader.GetDateTime(2)),
                Statut    = reader.GetString(3)
            });
        }
        return list;
    }

    public int Inserer(Demande d)
    {
        using var conn = new SqlConnection(_connString);
        // OUTPUT INSERTED pour récupérer l'id généré
        var sql = @"INSERT INTO Demande (dateDebut, dateFin, statut, idSalarie)
                    OUTPUT INSERTED.idDemande
                    VALUES (@debut, @fin, @statut, @idSalarie)";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@debut",     d.DateDebut.ToDateTime(TimeOnly.MinValue));
        cmd.Parameters.AddWithValue("@fin",       d.DateFin.ToDateTime(TimeOnly.MinValue));
        cmd.Parameters.AddWithValue("@statut",    d.Statut);
        cmd.Parameters.AddWithValue("@idSalarie", d.IdSalarie);
        conn.Open();
        return (int)cmd.ExecuteScalar()!;
    }

    public bool UpdateStatut(int idDemande, string nouveauStatut)
    {
        using var conn = new SqlConnection(_connString);
        var sql = "UPDATE Demande SET statut = @statut WHERE idDemande = @id";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@statut", nouveauStatut);
        cmd.Parameters.AddWithValue("@id",     idDemande);
        conn.Open();
        return cmd.ExecuteNonQuery() > 0;
    }
}
```

---

### 8.3 Le Service (couche métier)

Le Service porte les **règles métier** : conditions de validation, calculs, orchestration. Il ne connaît pas HTTP (pas de `HttpContext`), ne fait pas de SQL direct — il délègue au Repository.

```csharp
public class ServiceConges : IServiceConges
{
    private readonly IDemandeRepository _repo;
    private readonly ISalarieRepository _salarieRepo;

    public ServiceConges(IDemandeRepository repo, ISalarieRepository salarieRepo)
    {
        _repo       = repo;
        _salarieRepo = salarieRepo;
    }

    public Resultat Deposer(int idSalarie, DemandeCreationDto dto)
    {
        // Règle 1 : cohérence des dates
        if (dto.DateFin < dto.DateDebut)
            return Resultat.Erreur("La date de fin doit être après la date de début.");

        // Règle 2 : solde suffisant
        int nbJours = (dto.DateFin.DayNumber - dto.DateDebut.DayNumber) + 1;
        var salarie = _salarieRepo.GetParId(idSalarie);
        if (salarie.SoldeConges < nbJours)
            return Resultat.Erreur($"Solde insuffisant : {salarie.SoldeConges} jour(s) disponibles.");

        // Règle 3 : pas de chevauchement
        var existantes = _repo.GetParSalarie(idSalarie);
        bool chevauchement = existantes.Any(d =>
            d.Statut != "REFUSEE" &&
            d.DateDebut <= dto.DateFin && d.DateFin >= dto.DateDebut);
        if (chevauchement)
            return Resultat.Erreur("Une demande existe déjà sur cette période.");

        // Tout est OK → on insère
        var demande = new Demande
        {
            IdSalarie = idSalarie,
            DateDebut = dto.DateDebut,
            DateFin   = dto.DateFin
        };
        int id = _repo.Inserer(demande);
        return Resultat.Ok(id);
    }

    public Resultat Valider(int idDemande, int idManagerConnecte)
    {
        // Vérifier que le manager a bien le droit sur cette demande
        var demande = _repo.GetParId(idDemande);
        if (demande is null) return Resultat.Erreur("Demande introuvable.");
        if (demande.Statut != "EN_ATTENTE") return Resultat.Erreur("Demande déjà traitée.");

        _repo.UpdateStatut(idDemande, "VALIDEE");
        return Resultat.Ok();
    }
}
```

---

### 8.4 Le Controller

Le Controller reçoit les requêtes HTTP, **valide le format** (pas les règles métier) et **délègue** au Service. Il ne contient jamais de SQL ni de logique métier.

```csharp
[ApiController]
[Route("api/demandes")]
public class DemandesController : ControllerBase
{
    private readonly IServiceConges _service;
    public DemandesController(IServiceConges service) => _service = service;

    [HttpGet]
    [Authorize]
    public IActionResult GetMesDemandes()
    {
        int idSalarie = int.Parse(User.FindFirst("sub")!.Value);
        return Ok(_service.GetParSalarie(idSalarie));
    }

    [HttpPost]
    [Authorize]
    public IActionResult Creer([FromBody] DemandeCreationDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState); // validation du format
        int idSalarie = int.Parse(User.FindFirst("sub")!.Value);
        var res = _service.Deposer(idSalarie, dto); // règles métier dans le service
        return res.Succes ? CreatedAtAction(nameof(GetById), new { id = res.Id }, null)
                          : BadRequest(res.Message);
    }

    [HttpPatch("{id:int}/valider")]
    [Authorize(Roles = "Manager")]
    public IActionResult Valider(int id)
    {
        int idManager = int.Parse(User.FindFirst("sub")!.Value);
        var res = _service.Valider(id, idManager);
        return res.Succes ? NoContent() : BadRequest(res.Message);
    }
}
```

---

### 8.5 Enregistrement de l'injection de dépendances (Program.cs)

```csharp
// On enregistre les interfaces avec leurs implémentations
builder.Services.AddScoped<IDemandeRepository, DemandeRepository>();
builder.Services.AddScoped<ISalarieRepository, SalarieRepository>();
builder.Services.AddScoped<IServiceConges,     ServiceConges>();

// En test, on remplace par des faux :
// builder.Services.AddScoped<IDemandeRepository, FakeDemandeRepository>();
```

> **📌 Règle d'or des couches :** les dépendances vont **toujours vers le bas**. Aucune couche ne connaît une couche au-dessus d'elle. La BDD ne sait pas qu'un Controller existe. Le Repository ne sait pas qu'un Service le sollicite.
