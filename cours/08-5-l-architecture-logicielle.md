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
| **Model** | Objets de données transportés entre les couches | Structures simples : entités, objets de transport |
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
```javascript
// ❌ Tout au même endroit — impossible à tester, à maintenir, à faire évoluer
app.post('/api/demandes', async (req, res) => {
  // règle métier mélangée au traitement de la requête
  if (req.body.fin < req.body.debut) return res.status(400).send('Dates invalides');

  // SQL écrit directement ici
  await db.query('INSERT INTO Demande (dateDebut, dateFin, idSalarie) VALUES ($1, $2, $3)',
                 [req.body.debut, req.body.fin, 42]);

  // et envoi d'e-mail par-dessus
  await smtp.envoyer('manager@entreprise.fr', 'Nouvelle demande');

  res.sendStatus(200);
});
```

Cette fonction fait quatre métiers à la fois. Pour tester la règle sur les dates, il faut une base de données et un serveur d'e-mail. Pour changer de moteur de base, il faut rouvrir chaque point d'entrée HTTP.

**Avec séparation :**
```javascript
// ✅ Présentation : valide le format et délègue, rien de plus
app.post('/api/demandes', async (req, res) => {
  const erreurs = valider(req.body);
  if (erreurs) return res.status(400).json({ erreurs });

  const resultat = await serviceConges.deposer(req.utilisateur.id, req.body);

  return resultat.succes
    ? res.status(201).location(`/api/demandes/${resultat.id}`).json(resultat.demande)
    : res.status(400).json({ message: resultat.message });
});

// ✅ Métier : les règles de gestion, et rien d'autre — aucune notion de HTTP
class ServiceConges {
  constructor(depot, notifieur) {
    this.depot = depot;
    this.notifieur = notifieur;
  }

  async deposer(idSalarie, { debut, fin }) {
    if (fin < debut) return Resultat.erreur('Dates invalides');

    const solde = await this.depot.soldeDe(idSalarie);
    if (solde < nbJours(debut, fin)) return Resultat.erreur('Solde insuffisant');

    const demande = await this.depot.inserer(idSalarie, debut, fin);
    await this.notifieur.prevenirManager(idSalarie);
    return Resultat.ok(demande);
  }
}

// ✅ Accès aux données : uniquement des requêtes paramétrées
class DepotDemande {
  async inserer(idSalarie, debut, fin) { /* requête paramétrée */ }
  async soldeDe(idSalarie)             { /* requête paramétrée */ }
}
```

Le service ne connaît ni les codes HTTP ni le SQL : on peut le tester en lui passant de faux collaborateurs, et le réutiliser depuis une tâche planifiée ou un traitement par lots.

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

La réponse est l'**injection de dépendances** (*Dependency Injection*) : plutôt que de créer ses dépendances lui-même, chaque composant les **reçoit à sa construction**. L'assemblage est décidé ailleurs, en un seul endroit.

```javascript
// ← Chaque composant DÉCLARE ce dont il a besoin, il ne le fabrique pas
class ServiceConges {
  constructor(depot, notifieur) {   // ← injection ici
    this.depot = depot;
    this.notifieur = notifieur;
  }
}

// ← L'assemblage se fait à un seul endroit, au démarrage de l'application
const depot     = new DepotDemande(connexionBase);
const notifieur = new NotifieurEmail(configSmtp);
const service   = new ServiceConges(depot, notifieur);

// ← En test, on remplace les collaborateurs sans toucher au service
const serviceDeTest = new ServiceConges(new DepotEnMemoire(), new NotifieurMuet());
```

Sur un projet plus gros, un conteneur d'injection automatise cet assemblage : on lui déclare une fois « quand on demande ce contrat, fournis cette implémentation » et il construit le graphe d'objets tout seul. Le principe reste celui-ci.

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
│ (navigateur) │ ◄────────────────── │  (API HTTP)       │ ◄──────────── │ (SGBD)   │
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

```javascript
// Une configuration, un cache, un pool de connexions : un seul exemplaire suffit.
// En JavaScript, un module exporte naturellement une instance unique.
export const configuration = chargerConfiguration();
```

On l'écrit rarement à la main : un module qui exporte une instance, ou un conteneur d'injection configuré en « instance unique », suffit. À utiliser avec prudence — un singleton porte un état global partagé, donc il doit être conçu pour l'accès concurrent.

**Factory — déléguer la création à une méthode dédiée**

```javascript
class Resultat {
  #constructeurPrive = true;         // on ne construit pas cet objet directement

  constructor(succes, message = '', demande = null) {
    this.succes = succes;
    this.message = message;
    this.demande = demande;
    Object.freeze(this);             // objet figé : personne ne le modifiera après coup
  }

  // Méthodes de fabrique : le nom dit l'intention
  static ok(demande)   { return new Resultat(true, '', demande); }
  static erreur(msg)   { return new Resultat(false, msg); }
}
```

`Resultat.erreur('Solde insuffisant')` se lit mieux que `new Resultat(false, 'Solde insuffisant')`, et surtout il devient impossible de fabriquer un objet incohérent — un échec sans message, par exemple.

`Resultat.Erreur("Solde insuffisant")` se lit mieux que `new Resultat(false, "Solde insuffisant")`, et empêche de construire un objet incohérent.

**Strategy — interchanger un algorithme**

```javascript
// Le contrat : toute stratégie sait calculer un solde à partir d'un salarié
class CalculStandard { calculer(salarie) { /* 25 jours par an */ } }
class CalculCadre    { calculer(salarie) { /* 25 jours + jours de repos */ } }

// Le service reçoit la stratégie : ajouter un mode de calcul n'oblige pas
// à modifier le service (principe ouvert/fermé).
class ServiceConges {
  constructor(calculSolde) { this.calculSolde = calculSolde; }
}

new ServiceConges(new CalculCadre());
```

**Observer — notifier plusieurs abonnés d'un événement**

Quand une demande est validée, plusieurs choses doivent se produire : envoyer un e-mail, écrire un journal, mettre à jour un tableau de bord. Plutôt que d'empiler les appels dans la couche métier, celle-ci publie un événement et les abonnés réagissent chacun de leur côté. C'est le patron derrière les émetteurs d'événements et les files de messages.

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
