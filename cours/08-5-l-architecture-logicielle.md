## 5. L'architecture logicielle

L'architecture définit comment le code est **organisé en responsabilités séparées**. Une bonne architecture rend le code testable, maintenable et évolutif.

### 5.1 L'architecture en couches

Chaque couche a une **responsabilité unique** et ne communique qu'avec ses voisines immédiates. On va du plus proche de l'utilisateur au plus proche des données :

| Couche | Rôle | Ce qu'elle contient |
| --- | --- | --- |
| **View (Vue)** | Afficher les données, recueillir les actions de l'utilisateur | Pages HTML, composants UI |
| **Controller** | Recevoir les requêtes, valider les données, déléguer au service | Endpoints API, validation du format |
| **Business / Métier (Service)** | Contenir les règles métier de l'application | Vérification solde, règles de validation |
| **Repository** | Centraliser les requêtes vers la base de données | Requêtes SQL paramétrées, ORM |
| **BDD** | Stocker et persister les données | Tables SQL |
| **Model** | Objets de données transportés entre les couches | Classes C# simples (entités, DTO) |
| **Outils / Utils** | Fonctions utilitaires réutilisables partout | Helpers, formateurs de date, loggers |

**Règle d'or : les dépendances vont vers le bas.**
- Le Controller connaît le Service — jamais l'inverse.
- Le Service connaît le Repository — jamais l'inverse.
- La BDD ne « remonte » jamais directement jusqu'à la Vue.

```
View  ──►  Controller  ──►  Service  ──►  Repository  ──►  BDD
                                                    ▲
                              Model (transverse, utilisable partout)
                              Utils  (transverse, utilisable partout)
```

---

### 5.2 Pourquoi séparer en couches ?

**Sans séparation :**
```csharp
// ❌ Tout dans le Controller — impossible à tester, à maintenir, à faire évoluer
[HttpPost]
public IActionResult Creer(DemandeDto dto)
{
    // Validation métier dans le controller
    if (dto.Fin < dto.Debut) return BadRequest("Dates invalides");

    // SQL directement dans le controller
    using var conn = new SqlConnection(connectionString);
    conn.Execute("INSERT INTO Demande VALUES (@debut, @fin, 42)", dto);

    // Envoi d'e-mail dans le controller
    SmtpClient.Send("manager@entreprise.fr", "Nouvelle demande");

    return Ok();
}
```

**Avec séparation :**
```csharp
// ✅ Controller : valide et délègue uniquement
[HttpPost]
public IActionResult Creer([FromBody] DemandeDto dto)
{
    if (!ModelState.IsValid) return BadRequest(ModelState);
    var res = _serviceConges.Deposer(dto);
    return res.Succes ? CreatedAtAction(...) : BadRequest(res.Message);
}

// ✅ Service : règles métier uniquement
public Resultat Deposer(DemandeDto dto)
{
    if (dto.Fin < dto.Debut) return Resultat.Erreur("Dates invalides");
    if (_repo.GetSolde(dto.IdSalarie) < dto.NbJours()) return Resultat.Erreur("Solde insuffisant");
    _repo.Inserer(dto);
    _notif.Envoyer(dto.IdSalarie);
    return Resultat.Ok();
}

// ✅ Repository : accès données uniquement
public void Inserer(DemandeDto dto)
{
    // requête SQL paramétrée
}
```

---

### 5.3 Le patron MVC

**MVC** (*Model-View-Controller*) est une déclinaison très répandue de l'architecture en couches :

| Composant | Rôle |
| --- | --- |
| **Model** | Les données et la logique métier |
| **View** | La présentation (ce que voit l'utilisateur) |
| **Controller** | Reçoit les actions, sollicite le Model, choisit la View |

**Flux dans MVC :**
```
Utilisateur → action → Controller
                           │
                     sollicite Model
                           │
                     choisit View → affiche à l'utilisateur
```

L'intérêt : on peut changer la Vue (passer d'un site web à une appli mobile) **sans toucher au Model**. On peut tester le Model **sans interface**.

---

### 5.4 L'injection de dépendances — comment les couches se connectent

On a vu que le Controller connaît le Service, et le Service connaît le Repository. Mais concrètement, **comment le Controller reçoit-il le Service** ? Et comment peut-on changer l'implémentation sans tout modifier ?

La réponse est l'**injection de dépendances** (*Dependency Injection*) : plutôt que de créer les dépendances lui-même (`new ServiceConges()`), chaque composant les **reçoit dans son constructeur**. Le framework (ASP.NET Core) s'occupe de les fournir automatiquement.

```csharp
// ← Le Controller ne crée pas le Service — il le reçoit
public class DemandesController : ControllerBase
{
    private readonly IServiceConges _service;

    public DemandesController(IServiceConges service) // ← injection ici
    {
        _service = service;
    }
}

// ← Le Service reçoit le Repository de la même façon
public class ServiceConges
{
    private readonly IDemandeRepository _repo;

    public ServiceConges(IDemandeRepository repo) // ← injection ici
    {
        _repo = repo;
    }
}

// ← On configure une seule fois : "quand quelqu'un demande IServiceConges, donne-lui ServiceConges"
builder.Services.AddScoped<IServiceConges, ServiceConges>();
builder.Services.AddScoped<IDemandeRepository, DemandeRepository>();
```

**Avantages :**
- En test, on peut injecter un faux service (`FakeDemandeRepository`) sans toucher au code
- Si on change d'implémentation (autre BDD, autre service), on ne modifie qu'une ligne dans la configuration
- Le code est plus lisible : chaque classe déclare explicitement ce dont elle a besoin

---

### 5.5 Architecture n-tiers et client-serveur

Sur le plan déploiement, on parle d'architecture **3-tiers** :

```
┌──────────────┐      HTTP/HTTPS      ┌──────────────────┐      SQL      ┌──────────┐
│   Client     │ ──────────────────► │   Serveur API     │ ────────────► │   BDD    │
│ (navigateur) │ ◄────────────────── │  (ASP.NET Core)   │ ◄──────────── │ (SQL Srv)│
└──────────────┘     JSON            └──────────────────┘               └──────────┘
     Tier 1               Tier 2 (applicatif)                 Tier 3 (données)
```

- **Tier 1** : le client (navigateur, appli mobile) — affiche et interagit
- **Tier 2** : le serveur applicatif (l'API) — logique métier
- **Tier 3** : le serveur de données (BDD) — stockage

La BDD n'est **jamais exposée directement sur Internet** : elle n'est accessible que par le serveur applicatif, sur le réseau interne.

---

### 5.6 Les patrons de conception (design patterns)

Un **patron de conception** est une solution éprouvée à un problème de conception qui revient souvent. Ce n'est pas du code à copier : c'est un schéma d'organisation, et surtout un **vocabulaire commun** — dire « ici j'utilise un Repository » remplace un paragraphe d'explication.

On les classe en trois familles.

| Famille | Ce qu'elle résout | Exemples |
| --- | --- | --- |
| **Création** | Comment instancier les objets | Singleton, Factory, Builder |
| **Structure** | Comment assembler les objets | Adapter, Decorator, Facade, **Repository** |
| **Comportement** | Comment les objets collaborent | Strategy, Observer, Template Method |

**Singleton — une seule instance pour toute l'application**

```csharp
// Une configuration, un cache, un pool de connexions : un seul exemplaire suffit.
builder.Services.AddSingleton<IConfigurationCache, ConfigurationCache>();
```

En ASP.NET Core, on n'écrit plus le patron à la main : le conteneur d'injection de dépendances le fournit avec `AddSingleton`. À utiliser avec prudence — un singleton porte un état global partagé, donc il doit être conçu pour l'accès concurrent.

**Factory — déléguer la création à une méthode dédiée**

```csharp
public class Resultat
{
    public bool   Succes  { get; private set; }
    public string Message { get; private set; } = "";

    private Resultat() { }   // ← constructeur fermé

    // Méthodes de fabrique : le nom dit l'intention
    public static Resultat Ok()                  => new() { Succes = true };
    public static Resultat Erreur(string msg)    => new() { Succes = false, Message = msg };
}
```

`Resultat.Erreur("Solde insuffisant")` se lit mieux que `new Resultat(false, "Solde insuffisant")`, et empêche de construire un objet incohérent.

**Strategy — interchanger un algorithme**

```csharp
public interface ICalculSolde { decimal Calculer(Salarie s); }

public class CalculStandard : ICalculSolde { /* 25 jours par an */ }
public class CalculCadre    : ICalculSolde { /* 25 jours + RTT   */ }

// Le Service reçoit la stratégie : ajouter un nouveau mode de calcul
// n'oblige pas à modifier le Service (principe Open/Closed).
public class ServiceConges(ICalculSolde calcul) { /* ... */ }
```

**Observer — notifier plusieurs abonnés d'un événement**

Quand une demande est validée, plusieurs choses doivent se produire : envoyer un e-mail, écrire un journal, mettre à jour un tableau de bord. Plutôt que d'empiler les appels dans le Service, celui-ci publie un événement et les abonnés réagissent chacun de leur côté. C'est le patron derrière les `event` C# et les systèmes de messages.

**Repository — isoler l'accès aux données**

C'est le patron que tu utilises déjà dans ce cours sans le nommer : le Service parle d'une **collection d'objets métier**, le Repository traduit en SQL. Bénéfice concret : changer de SGBD, ou remplacer le vrai dépôt par un faux en test, sans toucher au métier.

> **Le piège des patrons :** les appliquer partout est un défaut, pas une qualité. Un patron ajoute une indirection — donc de la complexité. On l'introduit quand le problème qu'il résout se présente vraiment (rasoir d'Ockham). Une factory pour une classe instanciée à un seul endroit, c'est du bruit.

---

### 5.7 Monolithe, modulaire, microservices

| Style | Description | Quand le choisir |
| --- | --- | --- |
| **Monolithe** | Une seule application déployée d'un bloc, organisée en couches | La grande majorité des projets, dont un projet CDA : simple à développer, à déboguer et à déployer |
| **Monolithe modulaire** | Un seul déploiement, mais des modules métier étanches | Quand l'application grossit et qu'on veut préparer une découpe éventuelle |
| **Microservices** | Plusieurs services déployés indépendamment, qui communiquent par le réseau | Grosses équipes, besoins de montée en charge très différents d'un service à l'autre |

Les microservices résolvent un problème **d'organisation** (permettre à dix équipes de livrer sans se bloquer) au prix d'un coût technique important : réseau entre les services, cohérence des données distribuée, supervision multipliée, déploiement plus complexe. Pour un projet mené par une personne ou une petite équipe, le monolithe en couches est le bon choix — et savoir **expliquer pourquoi** vaut mieux que d'empiler des services.

---

> **🔒 Sécurité**
>
> L'architecture en couches est en elle-même un dispositif de sécurité (**défense en profondeur**) :
> - **Valider à chaque couche** : la validation côté View est du confort UX, la validation côté Controller/Service est la vraie sécurité.
> - Le **Repository** isole l'accès aux données et centralise les requêtes paramétrées — c'est là qu'on empêche les injections SQL.
> - **Cloisonnement** : une faille dans une couche ne doit pas compromettre tout le système.
> - Le serveur de données n'est **jamais exposé directement à Internet**.
