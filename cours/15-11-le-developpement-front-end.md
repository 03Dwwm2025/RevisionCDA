## 11. Le développement front-end

Le front-end est la partie qui s'exécute dans le **navigateur** de l'utilisateur. Le socle est constitué de trois langages complémentaires : **HTML** (structure), **CSS** (style) et **JavaScript** (comportement).

### 11.1 HTML — structure et sémantique

HTML (*HyperText Markup Language*) décrit la **structure** du contenu. Utiliser les bonnes balises améliore l'accessibilité et le référencement.

```html
<header>
  <nav>
    <ul>
      <li><a href="/demandes">Mes demandes</a></li>
      <li><a href="/solde">Mon solde</a></li>
    </ul>
  </nav>
</header>

<main>
  <section>
    <h1>Mes demandes de congé</h1>
    <article>
      <h2>Demande #42</h2>
      <p>Du 01/07/2026 au 15/07/2026 — <strong>En attente</strong></p>
    </article>
  </section>
</main>

<footer><p>CongeApp © 2026</p></footer>
```

**Balises sémantiques importantes :** `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<h1>–<h6>`, `<form>`, `<button>`, `<input>`.

---

### 11.2 CSS — mise en page et style

CSS (*Cascading Style Sheets*) contrôle l'**apparence** des éléments HTML.

**Sélecteurs :**
```css
h1          { color: #1a1a2e; }       /* élément */
.card       { border-radius: 8px; }   /* classe */
#header     { background: #fff; }     /* id */
button:hover{ opacity: 0.8; }         /* pseudo-classe : au survol */
```

**Flexbox** — mise en page sur **un seul axe** (ligne ou colonne) :
```css
.barre-actions {
  display: flex;
  gap: 1rem;
  align-items: center;        /* alignement vertical */
  justify-content: space-between; /* répartition horizontale */
}
```

**Grid** — mise en page sur **deux axes** (lignes ET colonnes) :
```css
.layout {
  display: grid;
  grid-template-columns: 250px 1fr;  /* sidebar fixe + contenu flexible */
  gap: 1.5rem;
}
```

**Responsive** — s'adapter à la taille d'écran :
```css
@media (max-width: 768px) {
  .layout { grid-template-columns: 1fr; } /* une seule colonne sur mobile */
}
```

---

### 11.3 JavaScript — les bases

JavaScript rend les pages **dynamiques** : réagir aux clics, modifier le contenu, appeler des APIs.

#### Variables et types

```javascript
let compteur = 0;           // let : variable modifiable
const MAX = 10;             // const : valeur fixe, non réassignable
// var est l'ancienne syntaxe — portée function, source de bugs, à éviter

// Les types de base
let texte    = "Bonjour";   // chaîne de caractères (string)
let nombre   = 42;          // nombre entier
let decimal  = 3.14;        // nombre décimal
let booleen  = true;        // vrai ou faux
let rien     = null;        // absence de valeur (assignée volontairement)
let inconnu;                // undefined : variable déclarée mais pas assignée
```

#### Fonctions

```javascript
// Fonction classique
function addition(a, b) {
  return a + b;
}

// Fonction fléchée (arrow function) — syntaxe courte
const multiplier = (a, b) => a * b;
const direBonjour = nom => `Bonjour ${nom} !`; // un seul paramètre : pas besoin de ()
```

#### Conditions et boucles

```javascript
// Condition if/else
if (compteur >= MAX) {
  console.log("Maximum atteint");
} else if (compteur > 5) {
  console.log("Plus de la moitié");
} else {
  console.log("En dessous de 5");
}

// Boucle for classique
for (let i = 0; i < 5; i++) {
  console.log(i); // affiche 0, 1, 2, 3, 4
}
```

#### Tableaux et objets

```javascript
// Tableaux — liste ordonnée de valeurs
const noms = ["Alice", "Bob", "Charlie"];
noms.push("Diana");                           // ajouter à la fin
noms.filter(n => n.startsWith("A"));         // filtrer → ["Alice"]
noms.map(n => n.toUpperCase());              // transformer → ["ALICE", "BOB"...]
noms.find(n => n === "Bob");                 // trouver → "Bob"
noms.forEach(n => console.log(n));           // parcourir

// Objets — structure clé : valeur
const salarie = {
  nom: "Dumont",
  prenom: "Alice",
  solde: 25,
  sePresenter() { return `Je suis ${this.nom}`; }
};
console.log(salarie.nom);           // "Dumont"
console.log(salarie["prenom"]);     // "Alice" (notation alternative)
console.log(salarie.sePresenter()); // "Je suis Dumont"
```

#### Manipulation du DOM

Le **DOM** (*Document Object Model*) est la représentation de la page HTML sous forme d'objets JavaScript. On peut le lire et le modifier dynamiquement.

```javascript
// Sélectionner des éléments
const titre   = document.getElementById("titre");         // un seul, par id
const premier = document.querySelector(".carte");         // le premier élément .carte
const tous    = document.querySelectorAll(".carte");      // tous les éléments .carte

// Modifier le contenu
titre.textContent = "Mes demandes";                       // ✅ texte brut, sûr
titre.innerHTML   = "<strong>Mes demandes</strong>";      // ⚠️ HTML — risque XSS

// Modifier le style et les classes CSS
titre.style.color = "blue";
titre.classList.add("actif");       // ajouter une classe
titre.classList.remove("cache");    // retirer une classe
titre.classList.toggle("visible");  // ajouter si absente, retirer si présente

// Réagir aux événements
document.getElementById("btnDeposer").addEventListener("click", function() {
  console.log("Bouton cliqué !");
});

// Créer et insérer un nouvel élément
const li = document.createElement("li");
li.textContent = "Nouvelle demande";
document.getElementById("listeDemandes").appendChild(li);
```

---

### 11.4 JavaScript — l'asynchrone et fetch

**Pourquoi l'asynchrone ?**

Certaines opérations prennent du temps : appeler une API, lire un fichier, attendre une réponse du serveur. Si le code était bloquant, la page se figerait pendant ce temps. JavaScript gère ces opérations de façon **asynchrone** : il lance l'opération et continue d'exécuter le reste du code. Quand la réponse arrive, il reprend.

**`async` / `await`** est la syntaxe moderne pour écrire du code asynchrone de façon lisible :

```javascript
// async : marque la fonction comme asynchrone
// await : attend que la promesse soit résolue avant de continuer
async function chargerDemandes() {
  try {
    // ← await : attend la réponse du serveur (ne bloque pas la page)
    const response = await fetch("/api/demandes", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    // ← response.ok est true si le code HTTP est 2xx (200, 201...)
    if (!response.ok) {
      console.error("Erreur HTTP :", response.status);
      return;
    }

    // ← await : attend que le corps soit parsé en JSON
    const demandes = await response.json();
    console.log(demandes); // tableau d'objets
  } catch (erreur) {
    // ← catch : gère les erreurs réseau (serveur injoignable, timeout...)
    console.error("Erreur réseau :", erreur);
  }
}
```

**Appel avec envoi de données (POST) :**

```javascript
async function deposerDemande(dateDebut, dateFin) {
  const response = await fetch("/api/demandes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",       // ← on envoie du JSON
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ dateDebut, dateFin }) // ← objet JS → chaîne JSON
  });

  if (!response.ok) {
    const erreur = await response.json();
    throw new Error(erreur.message);
  }

  return response.json(); // ← la ressource créée (201)
}
```

---

### 11.5 Validation des données et expressions régulières (Regex)

La validation côté client améliore l'expérience utilisateur, mais **ne remplace pas la validation serveur** (voir chapitre back-end).

**Validation HTML5 native — simple et rapide :**

```html
<form>
  <input type="date"  name="dateDebut" required>
  <input type="email" name="email"     required>
  <input type="text"  name="codePostal" pattern="[0-9]{5}" title="5 chiffres">
  <button type="submit">Envoyer</button>
</form>
<!-- Le navigateur bloque la soumission si les règles ne sont pas respectées -->
```

**Les expressions régulières (Regex) :**

Une regex est un **motif** qui décrit un format de texte. On l'utilise pour valider qu'une saisie respecte un format précis.

```javascript
// Syntaxe : /motif/flags  (les / délimitent la regex, comme les " délimitent un string)
const emailRegex     = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const codePostalRegex = /^[0-9]{5}$/;         // exactement 5 chiffres
const telephoneRegex  = /^(\+33|0)[1-9]\d{8}$/;

// .test() retourne true ou false
emailRegex.test("valentin@gmail.com")   // → true
emailRegex.test("pasunemail")           // → false
```

**Décomposer une regex pour la comprendre :**

```javascript
// Exemple : /^[0-9]{5}$/
//  ^        → début de la chaîne (la regex doit matcher depuis le début)
//  [0-9]    → un chiffre (de 0 à 9)
//  {5}      → exactement 5 fois
//  $        → fin de la chaîne (et seulement ça, rien d'autre)
// → valide exactement une chaîne de 5 chiffres : "75001" ✅, "75001A" ❌
```

**Tableau des symboles essentiels :**

| Symbole | Signification | Exemple |
| --- | --- | --- |
| `^` | Début de la chaîne | `/^Bonjour/` → commence par "Bonjour" |
| `$` | Fin de la chaîne | `/fin$/` → se termine par "fin" |
| `[abc]` | Un parmi a, b ou c | `/[aeiou]/` → une voyelle |
| `[a-z]` | Un caractère entre a et z | `/[a-z]+/` → une ou plusieurs minuscules |
| `\d` | Un chiffre (= `[0-9]`) | `/\d{4}/` → 4 chiffres |
| `\w` | Lettre, chiffre ou `_` | `/\w+/` → un mot |
| `\s` | Un espace (espace, tabulation…) | `/\s+/` → un ou plusieurs espaces |
| `.` | N'importe quel caractère sauf `\n` | `/a.b/` → "aXb", "a1b"… |
| `+` | 1 ou plusieurs fois | `/\d+/` → 1, 42, 123… |
| `*` | 0 ou plusieurs fois | `/ab*/` → "a", "ab", "abb"… |
| `?` | 0 ou 1 fois (optionnel) | `/colou?r/` → "color" ou "colour" |
| `{n}` | Exactement n fois | `/\d{4}/` → exactement 4 chiffres |
| `{n,m}` | Entre n et m fois | `/\w{8,20}/` → entre 8 et 20 caractères |

**Les lookaheads `(?=...)` — validations multiples simultanées :**

Un lookahead vérifie qu'une condition est remplie à cet endroit, sans consommer les caractères. C'est utile pour les mots de passe qui doivent respecter plusieurs règles à la fois.

```javascript
// Mot de passe : au moins 8 caractères, 1 majuscule, 1 chiffre
const mdpRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
//  (?=.*[A-Z]) → lookahead : il doit y avoir au moins une majuscule quelque part
//  (?=.*\d)    → lookahead : il doit y avoir au moins un chiffre quelque part
//  .{8,}       → au moins 8 caractères au total
//  ^...$        → sur toute la chaîne

mdpRegex.test("Motdepasse1")  // → true  (majuscule + chiffre + 8 car)
mdpRegex.test("motdepasse1")  // → false (pas de majuscule)
mdpRegex.test("Mdp1")         // → false (trop court)
```

**Validation complète d'un formulaire :**

```javascript
document.getElementById("monForm").addEventListener("submit", function(e) {
  e.preventDefault(); // empêcher l'envoi par défaut

  const email = document.getElementById("email").value;
  const mdp   = document.getElementById("mdp").value;
  let erreurs = [];

  if (!/^[\w.+-]+@[\w-]+\.[a-z]{2,}$/i.test(email))
    erreurs.push("Email invalide.");
  if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(mdp))
    erreurs.push("Mot de passe : 8 caractères min, 1 majuscule, 1 chiffre.");

  if (erreurs.length > 0) {
    document.getElementById("erreurs").textContent = erreurs.join("\n");
    return;
  }

  // tout est ok → soumettre
  deposerDemande(email, mdp);
});
```

---

> **🔒 Sécurité**
>
> - **XSS** : ne jamais utiliser `innerHTML` avec des données utilisateur. Utiliser `textContent` — il échappe automatiquement le HTML.
> - **La validation côté client n'est PAS de la sécurité** : elle peut être contournée en quelques secondes (Postman, curl, désactiver JS). La vraie protection est côté serveur.
> - **Stockage des tokens** : éviter `localStorage` (accessible en JS → vulnérable au XSS). Préférer un cookie `HttpOnly` + `Secure`.
> - **CSRF** : protéger les actions sensibles avec `SameSite=Strict` sur les cookies.
