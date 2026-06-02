## 11. Le développement front-end

Le front-end est la partie qui s'exécute dans le **navigateur** de l'utilisateur. Le socle est constitué de trois langages complémentaires : **HTML** (structure), **CSS** (style) et **JavaScript** (comportement).

### 11.1 HTML — structure et sémantique

HTML (*HyperText Markup Language*) décrit la **structure** du contenu. Utiliser les bonnes balises améliore l'accessibilité et le référencement.

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>CongeApp</title>
</head>
<body>
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

  <footer>
    <p>CongeApp © 2026</p>
  </footer>
</body>
</html>
```

**Balises sémantiques importantes :** `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<h1>–<h6>`, `<form>`, `<button>`, `<input>`.

---

### 11.2 CSS — mise en page et style

CSS (*Cascading Style Sheets*) contrôle l'**apparence** des éléments HTML.

```css
/* Sélecteurs */
h1          { color: #1a1a2e; }        /* élément */
.card       { border-radius: 8px; }    /* classe */
#header     { background: #fff; }      /* id */
button:hover{ opacity: 0.8; }          /* pseudo-classe */

/* Flexbox — mise en page sur un axe */
.barre-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

/* Grid — mise en page sur deux axes */
.layout {
  display: grid;
  grid-template-columns: 250px 1fr;  /* sidebar fixe + contenu flexible */
  gap: 1.5rem;
}

/* Responsive — adapter selon la taille d'écran */
@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;      /* une seule colonne sur mobile */
  }
}
```

---

### 11.3 JavaScript — comportement et interactivité

JavaScript rend les pages **dynamiques** : réagir aux clics, modifier le DOM, appeler des APIs.

**Les bases du langage :**

```javascript
// Variables
let compteur = 0;           // modifiable
const MAX = 10;             // constante
var ancien = "éviter var";  // ancienne syntaxe, portée function

// Types
let texte   = "Bonjour";
let nombre  = 42;
let decimal = 3.14;
let booleen = true;
let rien    = null;

// Fonctions
function addition(a, b) {
  return a + b;
}

// Fonction fléchée (arrow function)
const multiplier = (a, b) => a * b;

// Conditions
if (compteur >= MAX) {
  console.log("Maximum atteint");
} else if (compteur > 5) {
  console.log("Plus de la moitié");
} else {
  console.log("En dessous de 5");
}

// Boucles
for (let i = 0; i < 5; i++) {
  console.log(i);
}

const demandes = ["Demande 1", "Demande 2"];
demandes.forEach(d => console.log(d));

// Tableaux
const noms = ["Alice", "Bob", "Charlie"];
noms.push("Diana");                         // ajouter
noms.filter(n => n.startsWith("A"));        // filtrer → ["Alice"]
noms.map(n => n.toUpperCase());             // transformer
noms.find(n => n === "Bob");                // trouver

// Objets
const salarie = {
  nom: "Dumont",
  prenom: "Alice",
  solde: 25,
  sePresenter() { return `Je suis ${this.nom}`; }
};
console.log(salarie.nom);           // "Dumont"
console.log(salarie["prenom"]);     // "Alice"
```

**Manipulation du DOM :**

```javascript
// Sélectionner des éléments
const titre = document.getElementById("titre");
const boutons = document.querySelectorAll("button.action");

// Modifier le contenu
titre.textContent = "Mes demandes";
titre.innerHTML = "<strong>Mes demandes</strong>"; // ⚠️ XSS si données non fiables

// Modifier le style
titre.style.color = "blue";
titre.classList.add("actif");
titre.classList.remove("cache");

// Écouter des événements
document.getElementById("btnDeposer").addEventListener("click", function() {
  console.log("Bouton cliqué !");
});

// Créer et insérer un élément
const li = document.createElement("li");
li.textContent = "Nouvelle demande";
document.getElementById("listeDemandes").appendChild(li);
```

**Asynchrone — fetch API :**

```javascript
// Appeler une API REST depuis le navigateur
async function chargerDemandes() {
  const response = await fetch("/api/demandes", {
    headers: { "Authorization": `Bearer ${token}` }
  });

  if (!response.ok) {
    console.error("Erreur", response.status);
    return;
  }

  const demandes = await response.json();
  console.log(demandes);
}
```

---

### 11.4 Validation des données et expressions régulières (Regex)

La validation côté client améliore l'expérience utilisateur, mais **ne remplace pas la validation serveur**.

**Validation HTML5 native :**

```html
<form id="formulaireDemande">
  <input type="date" name="dateDebut" required>
  <input type="date" name="dateFin" required>
  <input type="email" name="email" required>
  <input type="text" name="codePostal" pattern="[0-9]{5}" title="5 chiffres">
  <button type="submit">Déposer</button>
</form>
```

**Validation JavaScript avec RegEx :**

Une **expression régulière** (regex) est un motif qui décrit un format de chaîne de caractères.

```javascript
// Syntaxe : /motif/flags
const emailRegex     = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const codePostalRegex = /^[0-9]{5}$/;
const telephoneRegex  = /^(\+33|0)[1-9](\d{8})$/;
const mdpRegex        = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
// mdp : au moins 1 minuscule, 1 majuscule, 1 chiffre, 8 caractères min

// Tester un format
function validerEmail(email) {
  return emailRegex.test(email); // true ou false
}

// Extraire des informations
const date = "2026-07-01";
const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
if (match) {
  console.log(`Année: ${match[1]}, Mois: ${match[2]}, Jour: ${match[3]}`);
}

// Remplacer
const texte = "Bonjour   monde";
const sansTropEspaces = texte.replace(/\s+/g, " "); // "Bonjour monde"
```

**Caractères spéciaux des regex :**

| Symbole | Signification |
| --- | --- |
| `^` | Début de la chaîne |
| `$` | Fin de la chaîne |
| `.` | N'importe quel caractère |
| `*` | 0 ou plusieurs fois |
| `+` | 1 ou plusieurs fois |
| `?` | 0 ou 1 fois (optionnel) |
| `{n}` | Exactement n fois |
| `{n,m}` | Entre n et m fois |
| `[abc]` | Un parmi a, b ou c |
| `[a-z]` | Une lettre minuscule |
| `\d` | Un chiffre (= `[0-9]`) |
| `\w` | Un caractère de mot (lettres, chiffres, `_`) |
| `\s` | Un espace (espace, tab, retour chariot) |
| `(?=...)` | Lookahead — suivi de... |

**Validation d'un formulaire complet :**

```javascript
document.getElementById("formulaireDemande").addEventListener("submit", function(e) {
  e.preventDefault(); // empêcher l'envoi par défaut

  const debut = new Date(document.getElementById("dateDebut").value);
  const fin   = new Date(document.getElementById("dateFin").value);
  const email = document.getElementById("email").value;

  let erreurs = [];

  if (fin < debut) erreurs.push("La date de fin doit être après la date de début.");
  if (!emailRegex.test(email)) erreurs.push("L'adresse e-mail est invalide.");

  if (erreurs.length > 0) {
    document.getElementById("erreurs").textContent = erreurs.join("\n");
    return;
  }

  // Envoyer à l'API
  chargerDemandes();
});
```

---

> **🔒 Sécurité**
>
> - **XSS** (*Cross-Site Scripting*) : ne jamais injecter des données non fiables dans `innerHTML`. Utiliser `textContent` à la place.
> - **La validation côté client n'est PAS de la sécurité** : elle peut être contournée en quelques secondes (DevTools, Postman, curl). La vraie protection est côté serveur.
> - **Stockage des tokens** : éviter `localStorage` (accessible en JS, donc vulnérable au XSS). Préférer un cookie `HttpOnly` + `Secure`.
> - **CSRF** : protéger les actions sensibles avec l'attribut `SameSite=Strict` sur les cookies.
