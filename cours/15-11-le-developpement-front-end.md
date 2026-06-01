## 11. Le développement front-end

Le front-end est la partie qui s'exécute dans le navigateur de l'utilisateur. Le socle reste **HTML** (structure), **CSS** (style) et **JavaScript** (comportement) — mais les applications modernes s'appuient sur des frameworks comme React.

### 11.1 Les bases : HTML, CSS, JavaScript

**HTML sémantique** : utiliser les bonnes balises améliore l'accessibilité et le référencement.

```html
<!-- ❌ Pas de sémantique -->
<div class="header"><div class="nav">...</div></div>

<!-- ✅ HTML sémantique -->
<header>
  <nav>
    <ul>
      <li><a href="/demandes">Mes demandes</a></li>
      <li><a href="/solde">Mon solde</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>...</article>
</main>
```

**CSS — Flexbox et Grid :**

```css
/* Flexbox : une dimension (ligne ou colonne) */
.barre-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

/* Grid : deux dimensions (lignes ET colonnes) */
.dashboard {
  display: grid;
  grid-template-columns: 250px 1fr;  /* sidebar + contenu */
  gap: 1.5rem;
}

/* Responsive : adapter la mise en page selon la taille d'écran */
@media (max-width: 768px) {
  .dashboard { grid-template-columns: 1fr; }
}
```

**TypeScript** : sur-ensemble de JavaScript qui ajoute le typage statique. Les erreurs de type sont détectées à la compilation, pas au runtime.

```typescript
// JavaScript — erreur découverte à l'exécution
function calculerDuree(debut, fin) {
  return fin - debut; // que se passe-t-il si debut est une string ?
}

// TypeScript — erreur détectée à la compilation
function calculerDuree(debut: Date, fin: Date): number {
  return (fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24);
}
```

---

### 11.2 Les SPA et React

Une **SPA** (*Single Page Application*) charge l'application une fois, puis navigue sans rechargement complet de page. La logique de navigation est gérée côté client.

**Avantages :** navigation fluide, moins de charge serveur.  
**Inconvénients :** temps de chargement initial, SEO à soigner.

**React** repose sur des **composants** — des fonctions qui retournent du JSX :

```tsx
// Composant React + TypeScript (CongeApp — liste des demandes)
interface Demande {
  id: number;
  dateDebut: string;
  dateFin: string;
  statut: 'EN_ATTENTE' | 'VALIDEE' | 'REFUSEE';
}

function CarteDemande({ demande }: { demande: Demande }) {
  const couleur = {
    EN_ATTENTE: 'bg-yellow-100',
    VALIDEE:    'bg-green-100',
    REFUSEE:    'bg-red-100',
  }[demande.statut];

  return (
    <div className={`p-4 rounded-lg ${couleur}`}>
      <p>{demande.dateDebut} → {demande.dateFin}</p>
      <span>{demande.statut}</span>
    </div>
  );
}
```

**Hooks essentiels :**

```tsx
import { useState, useEffect } from 'react';

function ListeDemandes() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading]   = useState(true);

  // useEffect : déclenché après le rendu (ici, au montage du composant)
  useEffect(() => {
    fetch('/api/demandes')
      .then(res => res.json())
      .then(data => { setDemandes(data); setLoading(false); });
  }, []); // [] = exécuté une seule fois

  if (loading) return <p>Chargement…</p>;
  return (
    <ul>
      {demandes.map(d => <CarteDemande key={d.id} demande={d} />)}
    </ul>
  );
}
```

---

### 11.3 Consommer une API REST depuis React

```tsx
async function deposerDemande(dateDebut: string, dateFin: string, token: string) {
  const res = await fetch('/api/demandes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ dateDebut, dateFin }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? `Erreur ${res.status}`);
  }

  return res.json(); // la demande créée (201 Created)
}
```

**Gestion des états dans un formulaire :**

```tsx
function FormulaireDepot() {
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin,   setDateFin]   = useState('');
  const [erreur,    setErreur]    = useState('');
  const [succes,    setSucces]    = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await deposerDemande(dateDebut, dateFin, token);
      setSucces(true);
    } catch (err) {
      setErreur((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)} />
      <input type="date" value={dateFin}   onChange={e => setDateFin(e.target.value)} />
      {erreur  && <p className="text-red-600">{erreur}</p>}
      {succes  && <p className="text-green-600">Demande déposée !</p>}
      <button type="submit">Déposer</button>
    </form>
  );
}
```

---

### 11.4 Routing côté client (React Router)

```tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/demandes">Mes demandes</Link>
        <Link to="/solde">Mon solde</Link>
      </nav>
      <Routes>
        <Route path="/"          element={<Accueil />} />
        <Route path="/demandes"  element={<ListeDemandes />} />
        <Route path="/demandes/:id" element={<DetailDemande />} />
        <Route path="*"          element={<PageIntrouvable />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

### 11.5 Tailwind CSS

Tailwind est un framework CSS *utility-first* : plutôt que d'écrire du CSS, on compose des classes directement dans le HTML/JSX.

```tsx
// Sans Tailwind
<button className="btn-primary">Déposer</button>
// + fichier CSS séparé avec .btn-primary { background: ...; padding: ...; }

// Avec Tailwind — tout inline, pas de fichier CSS séparé
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
  Déposer
</button>
```

---

> **🔒 Sécurité**
>
> - **XSS** : React échappe automatiquement le contenu `{variable}` en HTML. Éviter `dangerouslySetInnerHTML`. Mettre en place une **CSP** (Content-Security-Policy).
> - **La validation côté client n'est PAS de la sécurité** : elle peut être contournée en quelques secondes (DevTools, Postman). La vraie validation est côté serveur.
> - **Stockage du JWT** : préférer un cookie `HttpOnly` + `Secure` au `localStorage` (vulnérable au XSS). Si `localStorage`, accepter le risque et mettre en place une CSP stricte.
> - **CSRF** : protéger les actions sensibles avec l'attribut `SameSite=Strict` sur les cookies et un token anti-CSRF si nécessaire.
