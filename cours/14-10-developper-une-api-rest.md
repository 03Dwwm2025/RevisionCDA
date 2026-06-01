## 10. Développer une API REST

Une **API REST** expose les fonctionnalités du back-end via HTTP, sous forme de **ressources** manipulées avec des verbes standard. Elle est le contrat entre le front-end et le back-end.

### 10.1 Les verbes HTTP et les ressources

```
GET    /api/demandes          → lister toutes les demandes
GET    /api/demandes/7        → lire la demande n°7
POST   /api/demandes          → créer une nouvelle demande
PUT    /api/demandes/7        → remplacer entièrement la demande n°7
PATCH  /api/demandes/7        → modifier partiellement la demande n°7
DELETE /api/demandes/7        → supprimer la demande n°7
```

| Verbe | Action | Idempotent ? |
| --- | --- | --- |
| `GET` | Lire | ✅ (sans effet de bord) |
| `POST` | Créer | ❌ (deux appels = deux créations) |
| `PUT` | Remplacer | ✅ (même résultat si répété) |
| `PATCH` | Modifier partiellement | ⚠️ (dépend de l'implémentation) |
| `DELETE` | Supprimer | ✅ (supprimer deux fois → même état) |

**PUT vs PATCH :** PUT remplace l'intégralité de la ressource (les champs non fournis passent à null). PATCH ne met à jour que les champs envoyés — préférable pour les mises à jour partielles.

---

### 10.2 Les codes de statut HTTP

```
2xx — Succès
  200 OK           → GET ou PUT réussi
  201 Created      → POST réussi (avec header Location vers la ressource créée)
  204 No Content   → DELETE réussi ou PUT sans corps de réponse

4xx — Erreur client
  400 Bad Request  → données invalides (validation échouée)
  401 Unauthorized → non authentifié (token manquant ou invalide)
  403 Forbidden    → authentifié mais non autorisé (mauvais rôle)
  404 Not Found    → ressource inexistante
  409 Conflict     → conflit (ex. email déjà utilisé)

5xx — Erreur serveur
  500 Internal Server Error → bug non géré côté serveur
  503 Service Unavailable   → serveur surchargé ou en maintenance
```

> **401 vs 403 :** 401 = "je ne sais pas qui tu es" (authentification). 403 = "je sais qui tu es, mais tu n'as pas le droit" (autorisation).

---

### 10.3 Contrôleur ASP.NET Core complet

```csharp
[ApiController]
[Route("api/demandes")]
public class DemandesController : ControllerBase
{
    private readonly IServiceConges _service;

    // Injection de dépendance (DIP)
    public DemandesController(IServiceConges service) => _service = service;

    // GET /api/demandes — liste les demandes du salarié connecté
    [HttpGet]
    [Authorize]
    public IActionResult GetAll()
    {
        var idSalarie = int.Parse(User.FindFirst("sub")!.Value);
        var demandes = _service.GetParSalarie(idSalarie);
        return Ok(demandes); // 200
    }

    // GET /api/demandes/7
    [HttpGet("{id:int}")]
    [Authorize]
    public IActionResult Get(int id)
    {
        var d = _service.GetParId(id);
        if (d is null) return NotFound();       // 404

        // Vérifier que le salarié ne lit pas les demandes d'un autre (A01 OWASP)
        var idSalarie = int.Parse(User.FindFirst("sub")!.Value);
        if (d.IdSalarie != idSalarie) return Forbid(); // 403

        return Ok(d); // 200
    }

    // POST /api/demandes — déposer une demande
    [HttpPost]
    [Authorize]
    public IActionResult Creer([FromBody] DemandeDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState); // 400

        var idSalarie = int.Parse(User.FindFirst("sub")!.Value);
        var res = _service.Deposer(idSalarie, dto);

        if (!res.Succes) return BadRequest(res.Message);        // 400 métier

        return CreatedAtAction(nameof(Get), new { id = res.Id }, res.Demande); // 201
    }

    // PATCH /api/demandes/7/valider — le manager valide
    [HttpPatch("{id:int}/valider")]
    [Authorize(Roles = "Manager")]
    public IActionResult Valider(int id)
    {
        var res = _service.Valider(id);
        return res.Succes ? NoContent() : BadRequest(res.Message); // 204 ou 400
    }

    // DELETE /api/demandes/7
    [HttpDelete("{id:int}")]
    [Authorize]
    public IActionResult Supprimer(int id)
    {
        var ok = _service.Supprimer(id);
        return ok ? NoContent() : NotFound(); // 204 ou 404
    }
}
```

---

### 10.4 Les DTO (Data Transfer Objects)

On n'expose jamais directement l'entité de la base — on utilise des DTO pour contrôler ce qui entre et ce qui sort.

```csharp
// DTO d'entrée (ce que le client envoie)
public class DemandeDto
{
    [Required]
    public DateOnly DateDebut { get; set; }

    [Required]
    public DateOnly DateFin   { get; set; }

    // Pas d'IdSalarie — on le récupère depuis le token JWT
    // Pas de Statut — toujours EN_ATTENTE à la création
}

// DTO de sortie (ce que l'API renvoie)
public class DemandeReponseDto
{
    public int    Id       { get; set; }
    public string DateDebut { get; set; } = "";
    public string DateFin   { get; set; } = "";
    public string Statut    { get; set; } = "";
    public string NomSalarie { get; set; } = ""; // enrichi depuis la jointure
    // Pas de HashMotDePasse, pas de données internes
}
```

---

### 10.5 Authentification JWT

```csharp
// Configuration dans Program.cs
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = builder.Configuration["Jwt:Issuer"],
            ValidAudience            = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey         = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!))
        };
    });
```

**Structure d'un JWT :** `header.payload.signature` (3 parties encodées en base64)

```json
// Payload (lisible, mais signé — non modifiable)
{
  "sub": "42",           // id du salarié
  "name": "Valentin",
  "role": "Salarie",
  "exp": 1780000000      // expiration (Unix timestamp)
}
```

Le token est envoyé dans chaque requête : `Authorization: Bearer <token>`

---

### 10.6 Swagger / OpenAPI

En développement, Swagger génère une documentation interactive de l'API :

```csharp
// Program.cs
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // accessible sur /swagger
}
```

> **🔒 Sécurité**
>
> - **Authentification** : vérifier *qui* appelle (JWT). Sans `[Authorize]`, une route est publique.
> - **Autorisation** : vérifier *ce qu'il a le droit de faire*. Un salarié ne valide pas les demandes d'un autre.
> - **A01 OWASP — Broken Access Control** : toujours vérifier côté serveur que l'utilisateur connecté a le droit d'accéder à la ressource demandée (ne pas se fier à l'id dans l'URL).
> - **Validation** : `[Required]`, `[MaxLength]`, `[Range]` sur les DTO. `ModelState.IsValid` dans le contrôleur.
> - **CORS** configuré strictement : `builder.Services.AddCors(o => o.AddPolicy("Front", p => p.WithOrigins("https://mon-front.fr")))`.
> - **Rate limiting** pour se protéger du brute force et du DoS.
> - **Ne jamais exposer de stack trace** en production (`app.UseExceptionHandler("/error")` au lieu de `UseDeveloperExceptionPage`).
