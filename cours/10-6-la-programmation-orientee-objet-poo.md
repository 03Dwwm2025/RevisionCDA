## 6. La programmation orientée objet (POO)

### 6.0 Qu'est-ce qu'une classe ?

Une **classe** est un plan, un moule, qui décrit la structure et le comportement d'un type d'objet. Elle regroupe des **données** (les attributs) et des **comportements** (les méthodes) qui vont ensemble.

Pourquoi utiliser des classes ?
- **Sécurité** : on contrôle qui peut lire ou modifier les données.
- **Lisibilité** : le code est organisé par concept métier (`Eleve`, `Demande`, `Salarie`…).
- **Réutilisabilité** : une classe définie une fois peut être instanciée autant de fois qu'on veut, partout dans le projet.

```javascript
// Une classe, c'est un moule...
class Eleve {
  constructor(nom, prenom, dateNaissance) {
    this.nom = nom;
    this.prenom = prenom;
    this.dateNaissance = dateNaissance;
  }
}

// ...dont on crée autant d'objets qu'on veut
const eleve1 = new Eleve('Dumont', 'Alice', '2004-03-12');
const eleve2 = new Eleve('Nadir', 'Sofiane', '2003-11-02');
// eleve1 et eleve2 sont deux objets indépendants, issus du même moule
```

---

### 6.1 Le vocabulaire de base

| Terme | Définition |
| --- | --- |
| **Déclaration** | Réserver un emplacement mémoire pour une variable (`Eleve unEleve;`) |
| **Initialisation** | Donner une **première valeur** à une variable existante (`unEleve = new Eleve()`) |
| **Affectation** | Donner une valeur à une variable (pas forcément la première) (`unEleve.Nom = "Martin"`) |
| **Instanciation** | Déclarer **et** initialiser en une seule opération (`Eleve unEleve = new Eleve()`) |
| **Objet** | Une **instance** concrète créée à partir d'une classe |

```javascript
let unEleve;                       // Déclaration    — la variable existe, sans valeur
unEleve = new Eleve('Dumont');     // Initialisation — on lui donne sa première valeur

// Affectation d'un attribut : on change une valeur, pas la « première valeur »
unEleve.nom = 'Nadir';

// Instanciation : déclaration et création en une seule ligne
const autreEleve = new Eleve('Martin');
```

---

### 6.2 Attributs et méthodes

Les **attributs** sont les données propres à chaque objet. Une **méthode** est une fonction définie à l'intérieur de la classe — elle agit sur les attributs ou effectue un calcul.

```javascript
class Eleve {
  constructor(nom, prenom, dateNaissance) {
    // Attributs : ce que l'objet SAIT
    this.nom = nom;
    this.prenom = prenom;
    this.dateNaissance = dateNaissance;
    this.adresse = '';
    this.codePostal = '';
    this.ville = '';
  }

  // Méthode : ce que l'objet SAIT FAIRE
  calculerAge() {
    const naissance = new Date(this.dateNaissance);
    const aujourdHui = new Date();
    let age = aujourdHui.getFullYear() - naissance.getFullYear();

    // Correction si l'anniversaire n'est pas encore passé cette année
    const anniversairePasse =
      aujourdHui.getMonth() > naissance.getMonth() ||
      (aujourdHui.getMonth() === naissance.getMonth() &&
       aujourdHui.getDate() >= naissance.getDate());
    if (!anniversairePasse) age--;

    return age;
  }
}
```

**Utilisation :**

```javascript
const unEleve = new Eleve('Dumont', 'Alice', '2004-03-12');  // instanciation
unEleve.ville = 'Lille';                                     // affectation d'un attribut

const sonAge = unEleve.calculerAge();                        // appel de méthode
```

---

### 6.3 Encapsulation et modificateurs d'accès

L'**encapsulation** consiste à contrôler qui peut accéder aux données d'un objet. On expose ce qui doit l'être, on cache le reste.

| Modificateur | Portée |
| --- | --- |
| `public` | Accessible de partout |
| *interne au module* | Visible uniquement dans le projet (nom variable selon le langage) |
| `protected` | Accessible dans la classe et ses classes enfants uniquement |
| `private` | Visible uniquement dans la classe elle-même |
| `static` | Rend l'élément accessible et utilisable sans avoir besoin d'instancier la classe |

```javascript
class CompteBancaire {
  #solde = 0;              // le # marque un champ privé : inaccessible de l'extérieur

  get solde() {            // on expose la lecture...
    return this.#solde;
  }

  deposer(montant) {       // ...mais l'écriture passe par une méthode qui contrôle
    if (montant > 0) this.#solde += montant;
  }
}

const compte = new CompteBancaire();
compte.deposer(500);
console.log(compte.solde);   // 500 ✅
compte.solde = -9999;        // ❌ sans effet : aucun accesseur en écriture
```

La syntaxe du champ privé change selon le langage — `#champ` en JavaScript, `private` en C#, en Java ou en PHP, convention du préfixe `_` en Python — mais l'intention est la même : **rendre impossible un état incohérent**.

**`static` en pratique :**

```javascript
class OutilsMath {
  // Méthode statique : appartient à la classe, pas aux instances
  static max(a, b) { return a > b ? a : b; }
}

const resultat = OutilsMath.max(10, 42);   // appelée sur la classe, sans new
```

> **💡 Bonne pratique :** les attributs sont `private`, exposés via des propriétés `public`. Cela permet de valider une valeur avant de l'affecter, ou de la rendre en lecture seule.

---

### 6.4 Constructeur et surcharge

Le **constructeur** est une méthode particulière qui porte **le même nom que la classe**. Il est appelé automatiquement lors de l'instanciation et sert à initialiser l'objet dans un état valide.

La **surcharge** (*overload*) permet d'avoir **plusieurs versions d'une méthode avec le même nom** dans une même classe. Pour les distinguer, on change les arguments (nombre ou types). C'est particulièrement utile sur les constructeurs.

```javascript
class Demande {
  constructor(idSalarie, debut, fin = debut) {
    this.idSalarie = idSalarie;
    this.debut = debut;
    this.fin = fin;              // absente → congé d'un seul jour
    this.statut = 'EN_ATTENTE';
  }

  // Méthode de fabrique : le nom dit l'intention mieux qu'un paramètre de plus
  static pourUnJour(idSalarie, jour) {
    return new Demande(idSalarie, jour, jour);
  }

  nbJours() { return joursEntre(this.debut, this.fin) + 1; }
}

const d1 = new Demande(42, '2026-07-01', '2026-07-15');
const d2 = Demande.pourUnJour(42, '2026-08-15');
```

**Surcharge ou paramètres par défaut ?** Les langages à surcharge (C#, Java) déclarent plusieurs constructeurs de signatures différentes. JavaScript et Python obtiennent le même résultat avec des valeurs par défaut ou des méthodes de fabrique nommées. Le besoin est identique : offrir plusieurs façons d'initialiser un objet selon les informations disponibles.

---

### 6.5 Héritage

L'**héritage** permet à une classe **enfant** de récupérer les attributs et méthodes d'une classe **parent**, puis de les enrichir. On évite la duplication de code.

```javascript
// Classe parent
class Personne {
  constructor(nom, email) {
    this.nom = nom;
    this.email = email;
  }

  sePresenter() { return `Je m'appelle ${this.nom}.`; }
}

// Classe enfant : hérite de Personne
class Salarie extends Personne {
  constructor(nom, email, service) {
    super(nom, email);           // ← appel du constructeur parent, obligatoire d'abord
    this.service = service;
    this.soldeConges = 25;
  }
}

const s = new Salarie('Dumont', 'a.dumont@ent.fr', 'RH');
s.nom;              // hérité de Personne
s.service;          // propre à Salarie
s.sePresenter();    // méthode héritée
```

> Dans la plupart des langages objet, une classe n'hérite que d'**un seul parent** — pour éviter l'ambiguïté quand deux parents fournissent la même méthode. En revanche, elle peut respecter autant de **contrats** (interfaces) qu'elle veut, puisqu'un contrat n'apporte pas d'implémentation à choisir.

---

### 6.6 Le polymorphisme

**Définition :** le polymorphisme, c'est le fait qu'**un même appel de méthode produise un résultat différent selon l'objet sur lequel il est appelé**. Même nom, comportement différent.

C'est l'un des piliers de la POO. Sans polymorphisme, on serait obligé d'écrire des `if/else` pour gérer chaque type d'objet, ce qui rend le code fragile et difficile à étendre.

**Exemple concret — sans polymorphisme :**

```javascript
// ❌ Sans polymorphisme : on teste le type à la main
function afficherPrime(typeEmploye) {
  if (typeEmploye === 'manager')          return 'Prime : 2000 €';
  else if (typeEmploye === 'developpeur') return 'Prime : 1000 €';
  else if (typeEmploye === 'stagiaire')   return 'Prime : 0 €';
  // Ajouter un type = modifier cette fonction → fragile, et à retester en entier
}
```

**Exemple — avec polymorphisme :**

```javascript
// Chaque classe porte son propre comportement
class Manager {
  constructor(nom) { this.nom = nom; }
  calculerPrime() { return 2000; }      // comportement propre au manager
}

class Developpeur {
  constructor(nom) { this.nom = nom; }
  calculerPrime() { return 1000; }      // comportement propre au développeur
}

class Stagiaire {
  constructor(nom) { this.nom = nom; }
  calculerPrime() { return 0; }         // comportement propre au stagiaire
}
```

Le **même appel** `.CalculerPrime()` renvoie un résultat différent selon l'objet. C'est ça, le polymorphisme : même nom de méthode, comportement adapté à chaque type.

---

### 6.7 La classe abstraite

En pratique, si plusieurs classes partagent des attributs et des méthodes communs (comme `Nom` et `CalculerPrime()` ci-dessus), on factorise dans une **classe parent**. Quand cette classe parent n'a pas de sens à être instanciée seule, on la déclare `abstract`.

**Qu'est-ce qu'une classe abstraite ?**

Une classe abstraite est un **modèle commun à plusieurs classes enfants**. Elle :
- **Ne peut pas être instanciée** directement (on ne peut pas faire `new Employe()`)
- Définit des méthodes que les enfants **doivent** implémenter (`abstract`)
- Peut aussi définir des méthodes que les enfants **peuvent** redéfinir (`virtual`) ou des méthodes communes à tous (méthodes normales)

**Pourquoi « abstraite » ?** Parce qu'un `Employe` seul n'a pas de sens dans notre métier — il est toujours soit un `Manager`, soit un `Developpeur`, soit un `Stagiaire`. On ne peut jamais créer un employé « générique ».

```javascript
// ← MODÈLE COMMUN : conçu pour être hérité, pas instancié directement
class Employe {
  constructor(nom) {
    if (new.target === Employe) {
      throw new Error('Employe est un modèle : instanciez une classe fille.');
    }
    this.nom = nom;
  }

  // ← Méthode SANS implémentation : chaque enfant DOIT la fournir
  calculerPrime() {
    throw new Error('calculerPrime() doit être implémentée par la classe fille.');
  }

  // ← Méthode AVEC une implémentation par défaut : l'enfant peut la redéfinir
  role() { return 'Employé'; }
}

// ← CLASSE FILLE 1
class Manager extends Employe {
  calculerPrime() { return 2000; }      // implémentation obligatoire
  role()          { return 'Manager'; } // redéfinition du comportement par défaut
}

// ← CLASSE FILLE 2
class Developpeur extends Employe {
  calculerPrime() { return 1000; }
  // role() non redéfini → conserve « Employé »
}

// new Employe('X') → ❌ erreur : le modèle ne s'instancie pas
```

En C#, en Java ou en PHP, le mot-clé `abstract` fait respecter cette règle **dès la compilation** : oublier d'implémenter la méthode devient une erreur de compilation, pas un plantage à l'exécution. JavaScript n'a pas ce garde-fou intégré, d'où la vérification écrite à la main ci-dessus.

**Le polymorphisme avec la classe abstraite :**

Le modèle commun et la redéfinition rendent le polymorphisme pleinement exploitable : on manipule les objets à travers le type parent, et c'est le type réel de chacun qui décide de la version appelée — c'est ce qu'on appelle la liaison tardive.

```javascript
// ← On manipule une liste d'employés, sans savoir de quel type ils sont
const employes = [new Manager('Alice'), new Developpeur('Bob')];

// ← MÊME appel, COMPORTEMENT DIFFÉRENT selon le type réel de l'objet
for (const e of employes) {
  console.log(e.nom, e.calculerPrime(), e.role());
}
// Alice 2000 "Manager"
// Bob   1000 "Employé"   ← role() non redéfini : version du parent

// Ajouter un type d'employé n'oblige à modifier aucune de ces lignes.
```

---

### 6.8 L'interface

**Qu'est-ce qu'une interface ?**

Une interface est un **contrat** : elle liste des méthodes que toute classe qui l'implémente **doit** obligatoirement fournir. Elle ne contient aucun code — seulement des signatures de méthodes.

**Analogie :** une prise électrique est une interface. Peu importe l'appareil (lampe, chargeur, télévision), s'il respecte le format de la prise, il peut s'y brancher. La prise ne sait pas ce que fait l'appareil — elle garantit juste que la connexion est possible.

En programmation : si une classe implémente l'interface `INotifiable`, on sait qu'elle possède une méthode `Notifier()`. On peut l'appeler sans savoir ce qu'elle fait concrètement (envoie un e-mail ? un SMS ? affiche à l'écran ?).

**Différence avec la classe abstraite :**

- La classe abstraite dit : *"tu es un type d'Employe, voici ce qu'un Employe sait faire"*
- L'interface dit : *"peu importe ce que tu es, si tu respectes ce contrat, tu peux faire ça"*

Une classe ne peut hériter que d'**une seule classe abstraite**, mais elle peut implémenter **autant d'interfaces qu'elle veut**.

```javascript
// Un contrat, c'est un ensemble de méthodes qu'une classe s'engage à fournir.
// Ici deux contrats indépendants : « sait notifier » et « sait exporter ».

class ServiceConges {
  // ← Contrat « notifiable »
  notifier(message) {
    console.log(`Notification : ${message}`);
  }

  // ← Contrat « exportable »
  exporter() {
    return Buffer.from('données exportées...');
  }
}
```

En C#, en Java ou en PHP, ces contrats se déclarent explicitement (`interface INotifiable`) et le compilateur vérifie qu'ils sont respectés — une classe peut en cumuler autant qu'elle veut, alors qu'elle n'hérite que d'un seul parent. En JavaScript, le contrat est implicite : il suffit que l'objet expose les bonnes méthodes. C'est plus souple, et moins protégé.

**Utilisation via l'interface :**

```javascript
// On manipule l'objet à travers ce qu'on attend de lui, pas à travers sa classe.
// Cette fonction accepte N'IMPORTE QUEL objet qui sait notifier.
function prevenir(notifiable, message) {
  notifiable.notifier(message);
}

prevenir(new ServiceConges(), 'Votre demande a été validée.');
prevenir(new NotifieurSms(),  'Votre demande a été validée.');
```

C'est ce découplage qui permet de remplacer une implémentation par une autre — et, en test, de passer une doublure qui ne fait qu'enregistrer les appels.

**Récapitulatif :**

| | Classe abstraite | Interface |
| --- | --- | --- |
| Instanciable directement | ❌ | ❌ |
| Contient du code | ✅ | ❌ |
| Contient des attributs | ✅ | ❌ |
| Héritage/implémentation multiple | ❌ (une seule) | ✅ (plusieurs) |
| Représente | Une famille d'objets liés | Un contrat de capacité |

---

### 6.9 Composition ou héritage ?

L'héritage est le premier outil qu'on apprend, et celui dont on abuse le plus. La règle de métier est : **préférer la composition à l'héritage**.

| | **Héritage** — « est un » | **Composition** — « a un » |
| --- | --- | --- |
| Lien | Fort, figé à la compilation | Faible, remplaçable à l'exécution |
| Ce qu'on récupère | Toute l'interface publique du parent, voulue ou non | Uniquement ce qu'on choisit d'exposer |
| Changer de comportement | Créer une nouvelle sous-classe | Injecter un autre composant |
| Risque | Une modification du parent casse tous les enfants | Faible |

```javascript
// ❌ Héritage abusif : un service de congés n'EST PAS un journal
class ServiceConges extends Journal { }

// ✅ Composition : un service de congés A UN journal
class ServiceConges {
  constructor(journal, depot) {
    this.journal = journal;
    this.depot = depot;
  }
}
```

**Le test à appliquer :** la phrase « un X **est un** Y » doit être vraie sans effort. Un `Manager` **est un** `Salarie` : l'héritage se justifie. Un `ServiceConges` **a un** journal : c'est de la composition.

Deux symptômes d'héritage mal placé : une sous-classe qui redéfinit une méthode pour lever une exception (« cette opération ne s'applique pas ici ») — c'est une violation du principe de substitution de Liskov ; et une hiérarchie de plus de trois niveaux, où plus personne ne sait d'où vient un comportement.

---

### 6.10 Types valeur et types référence

Chaque donnée appartient à l'une des deux familles, et cela change ce qui se passe lors d'une affectation ou d'un passage en paramètre. C'est l'un des points qui piègent le plus souvent, dans tous les langages.

| | **Type valeur** | **Type référence** |
| --- | --- | --- |
| Exemples | nombres, booléens, caractères, dates, énumérations | objets, tableaux, listes, dictionnaires |
| Ce que contient la variable | La valeur elle-même | L'adresse d'un objet |
| À l'affectation | La valeur est **copiée** | La **référence** est copiée : deux variables, un seul objet |
| Valeur par défaut | `0`, `false`… | `null` |

```javascript
// Type simple : la copie est indépendante
let a = 5;
let b = a;
b = 10;
console.log(a);              // 5 — a n'a pas bougé

// Objet : les deux variables désignent le MÊME objet
const s1 = { nom: 'Dumont' };
const s2 = s1;
s2.nom = 'Nadir';
console.log(s1.nom);         // "Nadir" — c'est le même objet en mémoire

// Conséquence sur les paramètres de fonction
function renommer(salarie) { salarie.nom = 'Modifié'; }  // ← visible chez l'appelant
function incrementer(n)    { n++; }                      // ← sans effet à l'extérieur

// Piège : réaffecter le paramètre ne change rien à l'extérieur
function remplacer(salarie) { salarie = { nom: 'Autre' }; }  // ← sans effet
```

**Le cas de `string`** est le piège classique : c'est un type **référence**, mais il est **immuable**. Toute « modification » crée en réalité une nouvelle chaîne, ce qui lui donne l'apparence d'un type valeur. C'est aussi pourquoi concaténer dans une boucle est coûteux — on préfère `StringBuilder`.

**Deux mots-clés utiles :**

```javascript
// Ensemble fermé de valeurs nommées : plus de faute de frappe possible
const StatutDemande = Object.freeze({
  EnAttente: 'EN_ATTENTE',
  Validee:   'VALIDEE',
  Refusee:   'REFUSEE',
  Annulee:   'ANNULEE',
});

// Objet valeur : figé après création, comparé sur son contenu
function creerDemandeDto(dateDebut, dateFin) {
  return Object.freeze({ dateDebut, dateFin });
}

const d1 = creerDemandeDto('2026-07-01', '2026-07-15');
const d2 = creerDemandeDto('2026-07-01', '2026-07-15');

console.log(d1 === d2);                                  // false — deux objets distincts
console.log(JSON.stringify(d1) === JSON.stringify(d2));  // true  — même contenu
```

**Par défaut, comparer deux objets revient à demander « est-ce le même exemplaire ? »**, pas « ont-ils le même contenu ». Certains langages fournissent un type dédié qui compare par valeur — `record` en C# et en Java, `dataclass` en Python. En JavaScript, on l'obtient en comparant explicitement les champs, ou via une bibliothèque.

Remplacer `string Statut` par `StatutDemande Statut` supprime d'un coup toute une famille de bugs : plus de faute de frappe, plus de valeur inattendue, et le compilateur vérifie l'exhaustivité des `switch`.

---

### 6.11 Documenter le code

Un commentaire de documentation structuré, placé juste au-dessus d'une fonction, est exploité par l'éditeur pour l'aide contextuelle et par les outils de génération de documentation.

```javascript
/**
 * Calcule l'âge de l'élève à partir de sa date de naissance.
 *
 * @param {string} dateNaissance - Date au format ISO (AAAA-MM-JJ).
 * @returns {number} L'âge en années révolues.
 */
calculerAge(dateNaissance) {
  // ...
}
```

Ce format de commentaire structuré existe partout : JSDoc en JavaScript, commentaires XML en C#, Javadoc en Java, docstrings en Python. L'éditeur l'exploite pour l'aide contextuelle, et un outil peut en générer une documentation complète.

> **📌 Les quatre piliers de la POO**
>
> | Pilier | En une phrase |
> | --- | --- |
> | **Encapsulation** | Protéger les données, n'exposer que ce qui est nécessaire |
> | **Héritage** | Réutiliser et spécialiser sans dupliquer |
> | **Polymorphisme** | Même appel, comportement adapté au type réel de l'objet |
> | **Abstraction** | Masquer la complexité derrière un contrat clair |
