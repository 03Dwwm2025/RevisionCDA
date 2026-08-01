## 7. Les principes de conception (SOLID & co.)

Écrire du code qui *marche* ne suffit pas : il doit être **maintenable**. SOLID est un ensemble de cinq principes de conception objet formulés par Robert C. Martin. Ils visent à réduire le **couplage** (dépendances entre les composants) et à augmenter la **cohésion** (une classe = une responsabilité claire).

| Lettre | Principe | Idée centrale |
| --- | --- | --- |
| **S** | Single Responsibility | Une classe = une seule responsabilité, une seule raison de changer |
| **O** | Open/Closed | Ouvert à l'extension, fermé à la modification |
| **L** | Liskov Substitution | Un enfant peut remplacer son parent sans rien casser |
| **I** | Interface Segregation | Plusieurs interfaces spécifiques > une interface fourre-tout |
| **D** | Dependency Inversion | Dépendre d'abstractions, pas d'implémentations concrètes |

---

### 7.1 S — Single Responsibility Principle

**Théorie :** Une classe ne doit avoir qu'une seule **raison de changer**. Si une classe peut changer pour deux raisons différentes, elle a deux responsabilités — c'est une violation du SRP.

Une classe qui gère trop de choses est difficile à comprendre, à tester et à faire évoluer : modifier la logique d'envoi d'e-mail ne devrait pas risquer de casser le calcul des congés.

**Violation :**

```javascript
class ServiceConges {
  deposer(demande)     { /* règles métier      */ }
  envoyerEmail(adresse){ /* envoi de courriel  — 2ᵉ responsabilité */ }
  genererPdf(id)       { /* génération de PDF  — 3ᵉ responsabilité */ }
}
```

**Correction :**

```javascript
class ServiceConges      { deposer(demande) { /* ... */ } }
class ServiceNotification { envoyer(adresse, message) { /* ... */ } }
class ServicePdf          { generer(id) { /* ... */ } }
```

---

### 7.2 O — Open/Closed Principle

**Théorie :** Un module doit être **ouvert à l'extension** (on peut ajouter de nouveaux comportements) mais **fermé à la modification** (le code existant et stabilisé ne doit pas être retouché). On étend via l'héritage ou les interfaces plutôt qu'en modifiant ce qui fonctionne.

L'objectif est de pouvoir faire évoluer le logiciel sans risquer de casser ce qui marchait.

**Violation :** chaque nouveau type de prime nécessite de modifier `ServicePaie`.

```javascript
function calculerPrime(employe) {
  if (employe.type === 'manager') return 2000;
  if (employe.type === 'terrain') return 1500;
  // Ajouter un type = modifier cette fonction = risque de régression
  // et obligation de retester tous les cas existants
}
```

**Correction :** on étend sans modifier.

```javascript
// Chaque mode de calcul est une classe autonome, qui respecte le même contrat
class PrimeManager { calculer(employe) { return 2000; } }
class PrimeTerrain { calculer(employe) { return 1500; } }

// Le service reçoit la stratégie : un nouveau type = une nouvelle classe,
// et pas une ligne modifiée dans le service.
class ServicePaie {
  constructor(calculPrime) { this.calculPrime = calculPrime; }
  payer(employe) { return this.calculPrime.calculer(employe); }
}
```

---

### 7.3 L — Liskov Substitution Principle

**Théorie :** Si `B` hérite de `A`, alors partout où on utilise `A`, on doit pouvoir utiliser `B` **sans que le comportement attendu soit brisé**. Un enfant ne doit pas restreindre ou contredire le contrat de son parent.

C'est le principe qui garantit que l'héritage est utilisé de façon cohérente : une classe enfant est vraiment « un type de » son parent.

**Violation classique :**

```javascript
class Rectangle {
  constructor(largeur, hauteur) { this.largeur = largeur; this.hauteur = hauteur; }
  aire() { return this.largeur * this.hauteur; }
}

class Carre extends Rectangle {
  // Forcer largeur === hauteur casse le contrat annoncé par Rectangle
  set largeur(v) { this._largeur = this._hauteur = v; }
  set hauteur(v) { this._largeur = this._hauteur = v; }
}

const r = new Carre(0, 0);
r.largeur = 4;
r.hauteur = 5;
r.aire();   // attendu : 20 — obtenu : 25 → tout code qui manipule un Rectangle est cassé
```

**Règle pratique :** si l'héritage oblige à lancer des exceptions ou à restreindre le comportement parent, c'est souvent le signe d'une mauvaise hiérarchie. Préférer la composition.

---

### 7.4 I — Interface Segregation Principle

**Théorie :** Une classe ne doit pas être forcée d'implémenter des méthodes qu'elle n'utilise pas. Mieux vaut plusieurs interfaces précises qu'une seule interface générale.

Des interfaces trop larges créent des dépendances inutiles et forcent des implémentations vides ou levant des exceptions.

**Violation :**

```javascript
// Un contrat fourre-tout : tout le monde doit tout implémenter
const contratEntite = ['sauvegarder', 'envoyerParEmail', 'imprimer'];

class Demande {
  sauvegarder()     { /* ... */ }
  envoyerParEmail() { /* ... */ }
  imprimer()        { throw new Error('Opération non supportée'); }  // 🚩 signal d'alerte
}
```

**Correction :**

```javascript
// Trois contrats fins : chaque classe ne s'engage que sur ce qu'elle sait faire
const contratSauvegardable = ['sauvegarder'];
const contratEnvoyable     = ['envoyerParEmail'];
const contratImprimable    = ['imprimer'];

class Demande {
  sauvegarder()     { /* ... */ }
  envoyerParEmail() { /* ... */ }
  // pas d'imprimer() : Demande ne prétend pas savoir le faire
}
```

---

### 7.5 D — Dependency Inversion Principle

**Théorie :** Les modules de haut niveau ne doivent pas dépendre des modules de bas niveau — les deux doivent dépendre d'**abstractions** (interfaces). Les détails d'implémentation dépendent des abstractions, pas l'inverse.

C'est le principe au cœur de l'**injection de dépendances**. En injectant une interface plutôt qu'une classe concrète, on rend le code testable (on peut substituer un faux service en test) et évolutif (changer l'implémentation sans toucher au code client).

**Violation :**

```javascript
class ServiceConges {
  constructor() {
    // Couplage fort : le service fabrique lui-même sa dépendance concrète.
    // Impossible de la remplacer, donc impossible de tester sans base de données.
    this.depot = new DepotDemandeSql('postgresql://prod...');
  }
}
```

**Correction :**

```javascript
class ServiceConges {
  // Reçoit ce dont il a besoin : en test, on lui passe un dépôt en mémoire
  constructor(depot) { this.depot = depot; }

  async deposer(demande) { await this.depot.inserer(demande); }
}

new ServiceConges(new DepotDemandeSql(connexion));  // production
new ServiceConges(new DepotEnMemoire());            // test
```

---

### 7.6 DRY, KISS, YAGNI

Ces trois principes complètent SOLID au quotidien :

| Principe | Signification | Anti-pattern à éviter |
| --- | --- | --- |
| **DRY** — *Don't Repeat Yourself* | Une logique a une seule source de vérité | Copier-coller du code → si la règle change, on oublie de corriger partout |
| **KISS** — *Keep It Simple* | La solution la plus simple qui fonctionne | Sur-engineering, abstractions prématurées |
| **YAGNI** — *You Aren't Gonna Need It* | Ne pas coder ce dont on n'a pas encore besoin | Développer des fonctionnalités hypothétiques → dette technique |

### 7.7 SOLID et la testabilité — le lien concret

Respecter SOLID rend le code **naturellement testable**. Les mêmes qualités qui facilitent les tests (isolation, dépendances explicites, responsabilité claire) sont celles que SOLID cherche à atteindre.

**Code qui viole SRP et DIP → impossible à tester sans infrastructure réelle :**

```javascript
// ❌ Pour tester deposer(), il faut une vraie base et un vrai serveur d'e-mail
class ServiceConges {
  async deposer(demande) {
    const depot = new DepotDemandeSql('postgresql://prod...');   // concret, non remplaçable
    await depot.inserer(demande);
    await new ClientSmtp('smtp.exemple.fr').envoyer(/* ... */);  // 2ᵉ responsabilité
    return Resultat.ok();
  }
}
```

**Même code respectant SOLID → testable avec de simples faux :**

```javascript
// ✅ Les dépendances sont reçues, donc remplaçables
class ServiceConges {
  constructor(depot, notifieur) {
    this.depot = depot;
    this.notifieur = notifieur;
  }

  async deposer(demande) {
    await this.depot.inserer(demande);
    await this.notifieur.envoyer('manager@exemple.fr', 'Nouvelle demande');
    return Resultat.ok();
  }
}

// Test : ni base de données, ni serveur d'e-mail
test('enregistre la demande et prévient le manager', async () => {
  const depot     = new DepotEnMemoire();
  const notifieur = new NotifieurFactice();

  await new ServiceConges(depot, notifieur).deposer({ dateDebut: '2026-07-01' });

  expect(depot.inserees).toHaveLength(1);
  expect(notifieur.envoyes).toHaveLength(1);
});
```

**La règle pratique :** si une classe est difficile à tester, c'est presque toujours une violation de DIP (dépendances créées en interne) ou de SRP (trop de responsabilités mélangées).

> **📌 À retenir**
>
> SOLID n'est pas une liste de règles rigides à respecter mécaniquement. C'est un ensemble de guides pour **réduire le couplage** et **augmenter la cohésion**. Un code difficile à tester est le signal le plus fiable qu'un principe est violé.
