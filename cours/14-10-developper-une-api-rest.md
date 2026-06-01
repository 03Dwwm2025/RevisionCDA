## 10. Développer une API REST

Une **API REST** expose les fonctionnalités du back-end via HTTP, sous forme de **ressources** manipulées avec des verbes standard. C'est ce qui permet à un front React (ou une appli mobile) de dialoguer avec le serveur.

| Verbe HTTP | Action | Exemple |
| --- | --- | --- |
| GET | Lire | GET /api/demandes/7 |
| POST | Créer | POST /api/demandes |
| PUT | Remplacer | PUT /api/demandes/7 |
| PATCH | Modifier partiellement | PATCH /api/demandes/7 |
| DELETE | Supprimer | DELETE /api/demandes/7 |

Les réponses utilisent des **codes de statut HTTP** normalisés :

| Code | Signification |
| --- | --- |
| 2xx — Succès | 200 OK · 201 Created · 204 No Content |
| 4xx — Erreur client | 400 Bad Request · 401 Unauthorized · 403 Forbidden · 404 Not Found · 409 Conflict |
| 5xx — Erreur serveur | 500 Internal Server Error · 503 Service Unavailable |

Le format d'échange standard est le **JSON**. Exemple en ASP.NET Core (ton TutoAPI) :

```
[ApiController]
[Route("api/demandes")]
public class DemandesController : ControllerBase
{
    private readonly ServiceConges _service;
    public DemandesController(ServiceConges s) => _service = s; // injection

    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var d = _service.GetParId(id);
        return d is null ? NotFound() : Ok(d); // 404 ou 200
    }

    [HttpPost]
    [Authorize] // accès réservé aux utilisateurs authentifiés
    public IActionResult Creer([FromBody] DemandeDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState); // 400
        var res = _service.Deposer(dto);
        return CreatedAtAction(nameof(Get), new { id = res.Id }, res); // 201
    }
}
```

> **💡 Bon à savoir**
>
> **Swagger / OpenAPI** documente automatiquement l'API et fournit une interface de test dans le navigateur. En .NET, attention au démarrage à bien viser l'URL HTTPS et le bon chemin (`/swagger`).

> **🔒 Sécurité**
>
> Une API est exposée : elle doit se défendre.
> - **Authentification** : vérifier *qui* appelle (souvent un **JWT** — jeton signé envoyé dans l'en-tête `Authorization: Bearer ...`).
> - **Autorisation** : vérifier *ce qu'il a le droit de faire* (`[Authorize(Roles="Manager")]`). Un salarié ne valide pas une demande.
> - **Validation des entrées** côté serveur systématique (taille, type, format), jamais se fier au client.
> - **CORS** configuré strictement (seuls les domaines de confiance peuvent appeler l'API depuis un navigateur).
> - **Rate limiting** (limiter le nombre d'appels) contre le *brute force* et le déni de service ; **HTTPS** obligatoire.
> - Ne **jamais exposer de détails techniques** dans les erreurs (pas de *stack trace* en production).
