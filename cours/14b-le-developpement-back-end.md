## 11bis. Le développement back-end

Le **back-end** est la partie de l'application qui s'exécute côté serveur. Il est invisible pour l'utilisateur mais constitue le cœur de l'application : il reçoit les requêtes du front-end, applique les règles métier, communique avec la base de données et renvoie les réponses.

```
Navigateur (front-end) ──► Serveur back-end ──► Base de données
     (HTML/CSS/JS)          (ASP.NET Core)          (SQL)
```

---

### 11bis.1 Validation des données côté serveur

La validation serveur est **la seule validation qui compte pour la sécurité**. Celle du front-end est du confort UX — elle peut être contournée.

**Data Annotations** — attributs de validation sur les DTO :

```csharp
public class DemandeCreationDto
{
    [Required(ErrorMessage = "La date de début est obligatoire.")]
    public DateOnly DateDebut { get; set; }

    [Required(ErrorMessage = "La date de fin est obligatoire.")]
    public DateOnly DateFin { get; set; }
}

public class InscriptionDto
{
    [Required]
    [MaxLength(50, ErrorMessage = "Le nom ne peut pas dépasser 50 caractères.")]
    public string Nom { get; set; } = "";

    [Required]
    [EmailAddress(ErrorMessage = "L'adresse e-mail est invalide.")]
    public string Email { get; set; } = "";

    [Required]
    [MinLength(8, ErrorMessage = "Le mot de passe doit faire au moins 8 caractères.")]
    [RegularExpression(@"^(?=.*[A-Z])(?=.*\d).+$",
        ErrorMessage = "Le mot de passe doit contenir au moins une majuscule et un chiffre.")]
    public string MotDePasse { get; set; } = "";

    [Range(0, 100, ErrorMessage = "La valeur doit être entre 0 et 100.")]
    public int SoldeConges { get; set; }
}
```

**Vérification dans le Controller :**

```csharp
[HttpPost]
public IActionResult Creer([FromBody] InscriptionDto dto)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState); // 400 avec les messages d'erreur

    // Si on arrive ici, les données respectent toutes les annotations
    var resultat = _service.Inscrire(dto);
    return Ok(resultat);
}
```

**Validation personnalisée (custom) :**

```csharp
// Attribut de validation réutilisable
public class DateFuturAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext ctx)
    {
        if (value is DateOnly date && date <= DateOnly.FromDateTime(DateTime.Today))
            return new ValidationResult("La date doit être dans le futur.");
        return ValidationResult.Success;
    }
}

// Utilisation sur un DTO
public class DemandeCreationDto
{
    [Required]
    [DateFutur]
    public DateOnly DateDebut { get; set; }
}
```

**Tableau des principales Data Annotations :**

| Attribut | Utilisation |
| --- | --- |
| `[Required]` | Champ obligatoire (non null, non vide) |
| `[MaxLength(n)]` | Longueur maximale d'une chaîne |
| `[MinLength(n)]` | Longueur minimale d'une chaîne |
| `[Range(min, max)]` | Valeur numérique dans un intervalle |
| `[EmailAddress]` | Format e-mail valide |
| `[Url]` | Format URL valide |
| `[RegularExpression(pattern)]` | Validation par expression régulière |
| `[Compare("Champ")]` | Deux champs doivent être égaux (ex. confirmation MDP) |

---

### 11bis.2 Gestion des erreurs et exceptions

**Try/Catch dans le Service :**

```csharp
public Resultat Deposer(int idSalarie, DemandeCreationDto dto)
{
    try
    {
        if (dto.DateFin < dto.DateDebut)
            return Resultat.Erreur("Dates incohérentes.");

        _repo.Inserer(/* ... */);
        return Resultat.Ok();
    }
    catch (SqlException ex)
    {
        _logger.LogError(ex, "Erreur SQL lors de l'insertion d'une demande");
        return Resultat.Erreur("Erreur technique. Veuillez réessayer.");
    }
}
```

**Middleware global de gestion des erreurs :**

Plutôt que de catcher les exceptions dans chaque endpoint, on configure un middleware global qui intercepte toutes les exceptions non gérées.

```csharp
// Program.cs
if (app.Environment.IsDevelopment())
    app.UseDeveloperExceptionPage(); // stack trace visible en dev
else
    app.UseExceptionHandler("/error"); // page d'erreur générique en prod
```

```csharp
// Endpoint /error — renvoie un message générique sans détail technique
[ApiController]
public class ErrorController : ControllerBase
{
    [Route("/error")]
    public IActionResult Error()
    {
        return Problem(
            title: "Une erreur est survenue.",
            statusCode: 500
        );
    }
}
```

**Problem Details (RFC 7807) :** format standard pour les erreurs d'API.

```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Bad Request",
  "status": 400,
  "detail": "La date de fin doit être après la date de début.",
  "traceId": "00-abc123..."
}
```

ASP.NET Core renvoie automatiquement ce format avec `return BadRequest(...)` quand `[ApiController]` est présent.

---

### 11bis.3 Le middleware ASP.NET Core

Le **middleware** est un composant qui s'intercale dans le **pipeline de traitement des requêtes HTTP**. Chaque middleware peut :
- Traiter la requête avant de passer au suivant
- Court-circuiter le pipeline (ex. retourner 401 si non authentifié)
- Traiter la réponse au retour

```
Requête HTTP entrante
       │
  ┌────▼──────────────────────────────────────────┐
  │  UseExceptionHandler (gestion globale erreurs) │
  │  ┌────▼──────────────────────────────────────┐ │
  │  │  UseHttpsRedirection (HTTP → HTTPS)        │ │
  │  │  ┌────▼──────────────────────────────────┐│ │
  │  │  │  UseAuthentication (JWT vérifié)       ││ │
  │  │  │  ┌────▼──────────────────────────────┐││ │
  │  │  │  │  UseAuthorization ([Authorize])    │││ │
  │  │  │  │  ┌────▼──────────────────────────┐│││ │
  │  │  │  │  │  MapControllers (endpoint)     ││││ │
  │  │  │  │  └────────────────────────────────┘│││ │
  │  │  │  └───────────────────────────────────┘││ │
  │  │  └────────────────────────────────────────┘│ │
  │  └──────────────────────────────────────────── │
  └───────────────────────────────────────────────┘
       │
  Réponse HTTP sortante
```

**Configuration du pipeline dans `Program.cs` :**

```csharp
var app = builder.Build();

app.UseExceptionHandler("/error"); // 1. Gestion globale des erreurs
app.UseHttpsRedirection();         // 2. Forcer HTTPS
app.UseCors("PolitiqueCorsFront"); // 3. CORS
app.UseAuthentication();           // 4. Identifier l'utilisateur (JWT)
app.UseAuthorization();            // 5. Vérifier ses droits ([Authorize])
app.MapControllers();              // 6. Router vers les controllers

app.Run();
```

> **L'ordre des middlewares est crucial.** `UseAuthentication` doit venir avant `UseAuthorization`. `UseExceptionHandler` doit être en premier pour capturer les erreurs des autres middlewares.

---

### 11bis.4 Configuration et environnements

**`appsettings.json`** — fichier de configuration principal (commité dans Git, sans secrets) :

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning"
    }
  },
  "Jwt": {
    "Issuer": "congeapp.fr",
    "Audience": "congeapp-users",
    "ExpirationMinutes": 60
  },
  "ConnectionStrings": {
    "Default": "Server=db;Database=CongeApp;User=app;..."
  }
}
```

**`appsettings.Development.json`** — surcharges pour le développement local (commité) :

```json
{
  "Logging": { "LogLevel": { "Default": "Debug" } }
}
```

**Variables d'environnement** — pour les secrets en production (jamais committées) :

```bash
# .env sur le serveur (chmod 600, non commité)
Jwt__Secret=une-cle-secrete-longue-et-aleatoire
ConnectionStrings__Default=Server=db;Password=motdepasse;...
```

**Lire la configuration dans le code :**

```csharp
// Dans Program.cs ou n'importe quel service via injection
public class ServiceToken
{
    private readonly IConfiguration _config;
    public ServiceToken(IConfiguration config) => _config = config;

    public string GenererToken(Salarie salarie)
    {
        var secret    = _config["Jwt:Secret"]!;
        var issuer    = _config["Jwt:Issuer"]!;
        var dureeMin  = int.Parse(_config["Jwt:ExpirationMinutes"]!);
        // ...
    }
}
```

ASP.NET Core fusionne automatiquement `appsettings.json`, `appsettings.{Environment}.json` et les variables d'environnement (les variables d'env ont la priorité la plus haute).

---

### 11bis.5 Le logging côté serveur

Les logs permettent de comprendre ce qui se passe dans l'application en production — sans les logs, un bug en prod est invisible.

```csharp
public class ServiceConges
{
    private readonly ILogger<ServiceConges> _logger;

    public ServiceConges(ILogger<ServiceConges> logger) => _logger = logger;

    public Resultat Deposer(int idSalarie, DemandeCreationDto dto)
    {
        _logger.LogInformation(
            "Tentative de dépôt de demande par salarié {Id} du {Debut} au {Fin}",
            idSalarie, dto.DateDebut, dto.DateFin);

        if (dto.DateFin < dto.DateDebut)
        {
            _logger.LogWarning("Dates incohérentes pour salarié {Id}", idSalarie);
            return Resultat.Erreur("Dates incohérentes.");
        }

        try
        {
            _repo.Inserer(/* ... */);
            _logger.LogInformation("Demande créée avec succès pour salarié {Id}", idSalarie);
            return Resultat.Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la création de la demande pour salarié {Id}", idSalarie);
            return Resultat.Erreur("Erreur technique.");
        }
    }
}
```

**Niveaux de log (du moins au plus grave) :**

| Niveau | Quand l'utiliser |
| --- | --- |
| `LogTrace` | Détails très fins (débogage intensif) |
| `LogDebug` | Informations de débogage, uniquement en dev |
| `LogInformation` | Événements normaux du flux applicatif |
| `LogWarning` | Situation anormale mais non bloquante |
| `LogError` | Erreur qui a empêché une opération |
| `LogCritical` | Défaillance système — l'app est inutilisable |

**⚠️ Ne jamais logger :**
- Mots de passe ou hash de mots de passe
- Tokens JWT
- Données personnelles sensibles (numéro de sécurité sociale…)
- Numéros de carte bancaire

Les logs sont souvent accessibles à l'équipe infrastructure — une donnée sensible dans les logs est une fuite de données.

> **🔒 Sécurité**
>
> - **Validation toujours côté serveur** — la validation front-end est du confort, pas de la sécurité.
> - **Ne jamais afficher de détails techniques** dans les erreurs envoyées au client (stack trace, nom de table SQL, version du framework).
> - **Variables d'environnement** pour les secrets — jamais de mot de passe dans `appsettings.json` commité.
> - **Logging sécurisé** : journaliser les événements de sécurité (connexions échouées, accès refusés) sans y inclure les données sensibles (OWASP A09).
