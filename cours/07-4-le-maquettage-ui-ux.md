## 4. Le maquettage (UI/UX)

Avant de coder l'interface, on la dessine. Cela permet de valider le besoin avec le client **à moindre coût** (modifier un dessin coûte infiniment moins qu'un code) et de cadrer le travail front-end.

### 4.1 Les niveaux de maquettage

Le maquettage progresse par niveaux de précision croissants :

| Étape | Niveau de détail | But |
| --- | --- | --- |
| **Zoning** | Blocs grossiers | Découper la page en grandes zones (header, nav, contenu, footer) sans aucun détail |
| **Wireframe** | Filaire noir & blanc | Placer les éléments (boutons, formulaires, textes) avec du *lorem ipsum*, sans couleurs ni images |
| **Mockup** | Maquette stylée | Ajouter couleurs, typographie, icônes — le rendu visuel réaliste |
| **Prototype** | Interactif | Maquette cliquable simulant la navigation et les interactions (sans code) |

**Exemple de zoning pour CongeApp :**

```
┌─────────────────────────────────────────┐
│                 HEADER                  │  ← logo, nom, déconnexion
├──────────┬──────────────────────────────┤
│          │                              │
│ SIDEBAR  │       CONTENU PRINCIPAL      │  ← liste des demandes, formulaire...
│  (nav)   │                              │
│          │                              │
├──────────┴──────────────────────────────┤
│                  FOOTER                 │
└─────────────────────────────────────────┘
```

---

### 4.2 Outils courants

| Outil | Type | Points forts |
| --- | --- | --- |
| **Figma** | Web, collaboratif | Standard de l'industrie, prototypage poussé |
| **Adobe XD** | Desktop/Web | Intégration Adobe, prototypage |
| **Penpot** | Open source, web | Gratuit, auto-hébergeable |
| **Balsamiq** | Wireframe uniquement | Rapide, style « crayonné » volontaire |
| **Draw.io** | Diagrammes | Gratuit, schémas d'architecture et wireframes simples |

---

### 4.3 Principes UX (expérience utilisateur)

L'**UX** (*User eXperience*) désigne la qualité de l'expérience vécue par l'utilisateur lors de l'utilisation de l'application.

**Principes clés :**

| Principe | Signification |
| --- | --- |
| **Cohérence** | Les mêmes actions produisent toujours les mêmes effets, le même style visuel partout |
| **Retour visuel (feedback)** | L'application confirme chaque action (loader, message de succès/erreur) |
| **Prévention des erreurs** | Désactiver les boutons tant que le formulaire n'est pas valide, demander confirmation avant de supprimer |
| **Affordance** | Un élément ressemble à ce qu'il fait (un bouton a l'air cliquable) |
| **Lisibilité** | Hiérarchie visuelle claire, contrastes suffisants, police lisible |
| **Simplicité (KISS)** | Ne pas afficher ce dont l'utilisateur n'a pas besoin |

**UI vs UX :**
- **UI** (*User Interface*) : l'aspect visuel — couleurs, typographie, icônes, mise en page.
- **UX** (*User eXperience*) : l'expérience globale — facilité, efficacité, satisfaction.

Une belle UI avec une mauvaise UX reste une mauvaise application.

---

### 4.4 Accessibilité (RGAA / WCAG)

L'accessibilité garantit que l'application est utilisable par tous, y compris les personnes en situation de handicap.

| Critère | Exemple concret |
| --- | --- |
| **Contraste suffisant** | Texte lisible sur fond coloré (ratio ≥ 4.5:1 pour le texte normal) |
| **Alternatives textuelles** | `<img alt="Logo CongeApp">` pour les lecteurs d'écran |
| **Navigation au clavier** | Tous les éléments interactifs accessibles avec Tab/Entrée |
| **Structure sémantique** | `<h1>`, `<h2>`, `<nav>`, `<main>` — pas que des `<div>` |
| **Formulaires labellisés** | Chaque `<input>` associé à un `<label>` |

En France, le **RGAA** (*Référentiel Général d'Amélioration de l'Accessibilité*) est obligatoire pour les organismes publics et fortement recommandé ailleurs.

---

### 4.5 Le parcours utilisateur (user journey)

Avant de créer les maquettes, on modélise le **parcours utilisateur** : la séquence d'écrans et d'actions qu'un utilisateur va traverser pour accomplir son objectif.

**Exemple — dépôt d'une demande de congé :**

```
Connexion → Tableau de bord → Clic "Nouvelle demande"
         → Formulaire (saisie dates) → Validation
         → Message de confirmation → Retour tableau de bord
```

Identifier le parcours en amont évite de découvrir en développement qu'un écran manque ou qu'une action n'a pas de retour visuel.

> **🔒 Sécurité**
>
> - **Messages d'erreur génériques** : « Identifiants incorrects » plutôt que « Mot de passe erroné » (qui confirmerait l'existence d'un compte — *user enumeration*).
> - Ne jamais **afficher de données sensibles** inutilement.
> - Prévoir dès la maquette les écrans liés à la sécurité : connexion, déconnexion, gestion du consentement (RGPD), et si pertinent la **double authentification (2FA)**.
