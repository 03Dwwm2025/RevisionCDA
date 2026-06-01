## 11. Le développement front-end

Le front-end est la partie qui s'exécute dans le navigateur. Le socle reste **HTML** (structure), **CSS** (style) et **JavaScript** (comportement).

- **HTML sémantique** : utiliser les bonnes balises (`<header>`, `<nav>`, `<main>`, `<article>`) améliore l'accessibilité et le référencement.
- **CSS** : mise en page (Flexbox, Grid), *responsive design* (media queries), souvent via un framework (Tailwind, Bootstrap).
- **JavaScript / TypeScript** : interactivité ; TypeScript ajoute le typage statique, réduisant les bugs.

Les applications modernes sont souvent des **SPA** (*Single Page Application*) construites avec un framework comme **React** (ton portfolio est en React/Vite). Le front consomme l'API via `fetch` :

```
// Appel de l'API depuis React
const res = await fetch("/api/demandes", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify({ dateDebut, dateFin })
});
if (!res.ok) throw new Error(`Erreur ${res.status}`);
const data = await res.json();
```

> **🔒 Sécurité**
>
> - **XSS** (*Cross-Site Scripting*) : du JS malveillant injecté via une saisie utilisateur. React échappe le contenu par défaut ; éviter `dangerouslySetInnerHTML`. Mettre en place une **CSP** (Content-Security-Policy).
> - **La validation côté client n'est PAS de la sécurité** : c'est du confort. Elle peut être contournée. La validation qui protège est celle du serveur.
> - **Stockage des jetons** : préférer un cookie `HttpOnly` + `Secure` au `localStorage`, vulnérable au XSS.
> - **CSRF** (*Cross-Site Request Forgery*) : protéger les actions sensibles par un jeton anti-CSRF et l'attribut cookie `SameSite`.
