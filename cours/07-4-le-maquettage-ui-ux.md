## 4. Le maquettage (UI/UX)

Avant de coder l'interface, on la dessine. Modifier un dessin prend 5 minutes ; modifier du code bien avancé peut prendre des jours. Le maquettage permet de **valider le besoin avec le client tôt**, de détecter les incohérences de navigation avant de commencer à développer, et de cadrer le travail front-end.

---

### 4.1 Les niveaux de maquettage

Le maquettage progresse par niveaux de précision croissants. On ne passe pas directement au mockup final — chaque étape a un rôle précis.

| Étape | Niveau de détail | But | Quand |
| --- | --- | --- | --- |
| **Zoning** | Blocs grossiers, sans texte | Définir la structure générale de la page | Très tôt, dès l'analyse |
| **Wireframe** | Filaire N&B, lorem ipsum | Placer les éléments sans être distrait par le style | Après le zoning |
| **Mockup** | Couleurs, typographie, images | Valider le rendu visuel avec le client | Après le wireframe |
| **Prototype** | Cliquable, navigation simulée | Tester les interactions sans coder | Avant le développement |

**Pourquoi ce progressif ?** Montrer un mockup couleurs dès le début focalise la discussion du client sur la couleur du bouton plutôt que sur la logique de navigation. Le zoning et le wireframe évitent ça.

---

#### Le Zoning

Le zoning découpe la page en **grandes zones fonctionnelles** sans aucun détail. On définit où va quoi.

```
┌─────────────────────────────────────────┐
│                 HEADER                  │  ← logo, titre, déconnexion
├──────────┬──────────────────────────────┤
│          │                              │
│ SIDEBAR  │       CONTENU PRINCIPAL      │
│  (nav)   │                              │
│          │                              │
├──────────┴──────────────────────────────┤
│                  FOOTER                 │
└─────────────────────────────────────────┘
```

---

#### Le Wireframe

Le wireframe donne de la **substance aux zones** : on place les vrais éléments (boutons, champs, tableaux, titres) avec du contenu fictif. Pas de couleur, pas d'image — juste la structure et la hiérarchie de l'information.

```
┌─────────────────────────────────────────────────────┐
│  🏠 CongeApp          [Valentin Dumont] [Déconnexion]│
├────────────┬────────────────────────────────────────┤
│ Accueil    │  Mes demandes de congé                  │
│ Demandes   │  ┌──────────────────────────────────┐   │
│ Mon solde  │  │ Du        │ Au        │ Statut    │   │
│            │  ├───────────┼───────────┼───────────┤   │
│            │  │ 01/07/26  │ 15/07/26  │ En attente│   │
│            │  │ 10/08/26  │ 12/08/26  │ Validée   │   │
│            │  └──────────────────────────────────┘   │
│            │                                          │
│            │  [ + Nouvelle demande ]                  │
├────────────┴────────────────────────────────────────┤
│  CongeApp v1.0 — © 2026                             │
└─────────────────────────────────────────────────────┘
```

---

#### Le Mockup

Le mockup ajoute le **style visuel** : couleurs, typographie, icônes, images. C'est ce que le client va valider visuellement avant de donner le feu vert au développement. Il ne doit pas encore être cliquable — c'est une image statique.

---

#### Le Prototype

Le prototype est un **mockup cliquable** : on simule la navigation entre les écrans, les ouvertures de modales, les états de formulaires. L'utilisateur peut « jouer » avec sans qu'une seule ligne de code soit écrite.

Outils comme Figma permettent de relier les écrans entre eux avec des interactions : clic sur "Nouvelle demande" → ouverture du formulaire → clic sur "Valider" → écran de confirmation.

---

### 4.2 Outils courants

| Outil | Type | Points forts |
| --- | --- | --- |
| **Figma** | Web, collaboratif | Standard de l'industrie, prototypage poussé, commentaires client intégrés |
| **Adobe XD** | Desktop/Web | Intégration suite Adobe |
| **Penpot** | Open source, web | Gratuit, auto-hébergeable |
| **Balsamiq** | Wireframe uniquement | Rapide, style « crayonné » volontaire qui évite de se focaliser sur le style |
| **Draw.io** | Diagrammes | Gratuit, bon pour les zonings et les flux |

**Figma** est aujourd'hui la référence du secteur. Son mode collaboratif permet au client de laisser des commentaires directement sur la maquette.

---

### 4.3 UI vs UX — la différence fondamentale

Ces deux termes sont souvent confondus mais désignent des choses distinctes :

- **UI** (*User Interface*) : ce qu'on **voit** — couleurs, typographie, icônes, mise en page, espacement. C'est le travail du designer graphique.
- **UX** (*User eXperience*) : ce qu'on **ressent** — est-ce facile à utiliser ? Trouve-t-on rapidement ce qu'on cherche ? Est-ce frustrant ou satisfaisant ? C'est le travail de l'architecte d'information et du designer d'interaction.

**Exemple de dissociation :** une application peut avoir une très belle UI (graphisme soigné, couleurs harmonieuses) mais une mauvaise UX (on ne trouve pas le bouton pour créer une demande, le formulaire est confus, les messages d'erreur ne disent pas quoi corriger).

Une belle UI avec une mauvaise UX reste une **mauvaise application**.

---

### 4.4 Principes UX essentiels

Ces principes guident la conception d'une interface utilisable et agréable.

**Cohérence**

Les mêmes actions produisent toujours les mêmes effets. Le même style visuel est appliqué partout. Si le bouton "Valider" est violet sur une page, il est violet partout. Si "Supprimer" demande une confirmation dans un contexte, il le fait dans tous les contextes.

```
❌ Mauvais : bouton "Valider" violet sur la page A, vert sur la page B
✅ Bon    : même couleur, même position, même comportement partout
```

**Retour visuel (feedback)**

Chaque action doit avoir une réponse visible. L'utilisateur ne doit jamais se demander "est-ce que ça a marché ?"

```
Clic sur "Déposer" :
→ Le bouton est désactivé pendant l'envoi (évite le double-clic)
→ Un loader apparaît
→ Message de succès vert : "Votre demande a été enregistrée"
  OU message d'erreur rouge : "Solde insuffisant"
```

**Prévention des erreurs**

Mieux vaut empêcher l'erreur que de la corriger après.

```
❌ Mauvais : laisser soumettre le formulaire avec des dates invalides
             puis afficher une erreur serveur
✅ Bon    : désactiver le bouton "Valider" tant que les dates ne sont pas cohérentes
            afficher en temps réel "La date de fin doit être après la date de début"
```

**Affordance**

Un élément doit ressembler à ce qu'il fait. Un bouton doit avoir l'air cliquable (relief, couleur distincte). Un lien doit être souligné ou coloré. Un champ de texte doit avoir l'air éditable (bordure, fond légèrement différent).

**Hiérarchie visuelle**

L'œil doit naturellement aller vers ce qui est le plus important. On l'obtient par la taille (les titres sont plus grands), la couleur (le CTA principal est coloré, les secondaires sont discrets), et l'espacement (les éléments groupés sont liés visuellement).

```
Exemple — page de dépôt de demande :
  [Titre H1 : grande taille, couleur sombre]
  [Champs de formulaire : taille normale]
  [Bouton principal "Déposer" : couleur vive, bien visible]
  [Bouton secondaire "Annuler" : discret, style lien ou bouton gris]
```

**Simplicité**

N'afficher que ce dont l'utilisateur a besoin à cet instant. Trop d'options paralysent. Un tableau de bord qui affiche 20 métriques dès la connexion surcharge cognitivement.

---

### 4.5 Le parcours utilisateur (user journey)

Avant de créer les maquettes écran par écran, on modélise le **parcours utilisateur** : la séquence d'écrans et d'actions qu'un utilisateur traverse pour accomplir son objectif.

Cela permet de s'assurer qu'aucun écran ne manque, que chaque action a une suite logique, et que les cas d'erreur sont traités.

**Exemple — dépôt d'une demande :**

```
[Connexion]
    │ identifiants corrects
    ▼
[Tableau de bord]
    │ clic "Nouvelle demande"
    ▼
[Formulaire de dépôt]
    │ saisie des dates
    ├─ dates invalides ──────────────► [Message d'erreur inline] → retour formulaire
    ├─ solde insuffisant ────────────► [Message d'erreur inline] → retour formulaire
    │ validation réussie
    ▼
[Page de confirmation]
    │ "Votre demande est en attente de validation"
    │ clic "Retour à l'accueil"
    ▼
[Tableau de bord] ← la nouvelle demande apparaît dans la liste
```

Les **cas d'erreur** doivent être maquettés autant que le cas nominal. C'est souvent là que l'UX est la plus déficiente dans les projets réels.

---

### 4.6 Accessibilité (RGAA / WCAG)

L'accessibilité garantit que l'application est utilisable par **tous les utilisateurs**, y compris ceux qui ont des handicaps visuels, moteurs ou cognitifs.

| Critère | Règle | Exemple concret |
| --- | --- | --- |
| **Contraste** | Ratio ≥ 4,5:1 pour le texte normal | Texte gris clair sur fond blanc = insuffisant |
| **Alternatives textuelles** | Toute image porteuse d'information a un `alt` | `<img src="logo.svg" alt="Logo CongeApp">` |
| **Navigation clavier** | Tous les éléments interactifs accessibles avec Tab | Un menu déroulant accessible sans souris |
| **Structure sémantique** | Utiliser les bonnes balises HTML | `<button>` plutôt qu'un `<div>` cliquable |
| **Formulaires** | Chaque champ a un `<label>` associé | `<label for="dateDebut">Date de début</label>` |
| **Pas de couleur seule** | Ne pas véhiculer une info uniquement par la couleur | Un statut "Validée" doit avoir un texte ET une icône, pas juste être vert |

En France, le **RGAA** (*Référentiel Général d'Amélioration de l'Accessibilité*) est **obligatoire** pour les organismes publics et fortement recommandé pour tous les autres. Le RGAA est basé sur les **WCAG** (Web Content Accessibility Guidelines) du W3C.

**Pourquoi ça concerne les développeurs ?** Parce que l'accessibilité se construit dans le code, pas dans la maquette. Utiliser un `<div>` cliquable au lieu d'un `<button>` peut rendre une fonctionnalité inaccessible aux lecteurs d'écran — même si la maquette est parfaite.

---

### 4.7 Les personas

Un **persona** est un profil fictif mais réaliste d'un utilisateur type, construit à partir de l'analyse des besoins (interviews, observations). Il sert de **boussole** pendant toute la conception : quand on hésite entre deux choix d'interface, on se demande « que ferait Marie dans cette situation ? »

**Structure d'un persona :**

```
┌──────────────────────────────────────────────────────────┐
│  👩  Marie Leblanc, 34 ans — Chargée RH                  │
│  « Je gère les absences de 80 personnes, j'ai besoin    │
│    d'une vue globale rapide. »                           │
├──────────────────┬───────────────────────────────────────┤
│ Objectifs        │ Valider les demandes rapidement       │
│                  │ Voir les absences sur le calendrier   │
├──────────────────┼───────────────────────────────────────┤
│ Frustrations     │ Recevoir des demandes par e-mail      │
│                  │ Devoir rappeler les règles à chaque   │
│                  │ salarié (max 25 jours/an, délai 2 sem)│
├──────────────────┼───────────────────────────────────────┤
│ Comportement     │ Travaille surtout sur desktop Chrome  │
│ tech             │ Peu à l'aise avec les nouvelles UI    │
└──────────────────┴───────────────────────────────────────┘
```

**Pourquoi c'est utile ?** Un projet peut avoir 2 ou 3 personas distincts avec des besoins antagonistes (le salarié veut déposer vite depuis son téléphone ; le RH veut une vue d'ensemble sur écran large). Identifier ça tôt évite de concevoir une interface qui satisfait tout le monde à moitié.

**Lien avec le reste de la conception :** les personas alimentent directement le parcours utilisateur (§ 4.5) et les critères d'accessibilité (§ 4.6). Un persona « malvoyant » ou « utilisateur clavier uniquement » force à intégrer l'accessibilité dès le départ.

---

### 4.8 Les heuristiques de Nielsen

Jakob Nielsen a défini **10 principes heuristiques** qui servent de grille d'évaluation d'une interface. On les utilise lors d'une **évaluation heuristique** : un expert parcourt l'interface et note chaque violation.

| # | Heuristique | Ce que ça signifie en pratique |
|---|-------------|-------------------------------|
| 1 | **Visibilité du statut** | L'utilisateur sait toujours où il en est (loader, étape 2/3, badge "non lu") |
| 2 | **Correspondance monde réel** | Utiliser le vocabulaire de l'utilisateur, pas le jargon technique ("Déposer une demande" > "POST /leave") |
| 3 | **Liberté et contrôle** | Toujours pouvoir annuler ou revenir en arrière ("Retour", "Annuler", CTRL+Z) |
| 4 | **Cohérence et standards** | Même mot = même chose. Respecter les conventions de la plateforme (bouton rouge = danger) |
| 5 | **Prévention des erreurs** | Désactiver ce qui ne peut pas être cliqué, confirmer les actions irréversibles |
| 6 | **Reconnaissance > mémorisation** | Montrer les options plutôt que de forcer à les mémoriser (menus déroulants > champs libres) |
| 7 | **Flexibilité et efficacité** | Les experts peuvent utiliser des raccourcis que les novices ignorent |
| 8 | **Esthétique et minimalisme** | Chaque information inutile est une distraction. Supprimer, ne pas cacher |
| 9 | **Aider à diagnostiquer les erreurs** | Message d'erreur : dire ce qui s'est passé + comment corriger, sans code technique |
| 10 | **Aide et documentation** | Si l'aide est nécessaire, elle doit être contextuelle et orientée tâche |

**Exemple d'audit rapide :**

```
Page "Nouvelle demande de congé" — violations identifiées

H1 (Visibilité) : aucun indicateur que le formulaire est en train de s'envoyer
  → Ajouter un loader sur le bouton pendant la requête

H9 (Erreurs) : message "Erreur 422" si chevauchement de dates
  → Remplacer par "Ces dates chevauchent une demande existante (01/07 – 05/07)"

H5 (Prévention) : bouton "Valider" actif même si les champs sont vides
  → Le désactiver tant que les champs obligatoires ne sont pas remplis
```

---

### 4.9 Responsive design et mobile-first

Une interface doit fonctionner sur toutes les tailles d'écran. Le **responsive design** consiste à adapter la mise en page en fonction de la largeur disponible grâce aux **breakpoints**.

**L'approche mobile-first :** on conçoit d'abord pour le petit écran (le plus contraignant), puis on enrichit progressivement pour les grands écrans. C'est l'inverse de l'approche historique "desktop-first".

```
Mobile (< 640px)      Tablette (640–1024px)    Desktop (> 1024px)
┌───────────────┐     ┌──────────────────┐     ┌────────┬──────────────┐
│ ≡ CongeApp    │     │ ≡ CongeApp   [V] │     │ MENU   │  CONTENU     │
│               │     │                  │     │        │              │
│ Mes demandes  │     │ ┌────┐ ┌───────┐ │     │ Accueil│  Tableau     │
│ ┌───────────┐ │     │ │Nav │ │Tableau│ │     │ Demande│  des congés  │
│ │ 01/07/26  │ │     │ │lat │ │       │ │     │ Solde  │              │
│ │ En attente│ │     │ │ér. │ │       │ │     │        │              │
│ └───────────┘ │     │ └────┘ └───────┘ │     │        │  [+ Nouvelle]│
│               │     │                  │     └────────┴──────────────┘
│ [+ Demande]   │     │ [+ Nouvelle dem.]│
└───────────────┘     └──────────────────┘
```

**Breakpoints Tailwind (référence) :**

```
sm  → 640px   (téléphone paysage)
md  → 768px   (tablette portrait)
lg  → 1024px  (tablette paysage / petit desktop)
xl  → 1280px  (desktop standard)
2xl → 1536px  (grand écran)
```

**Patterns de responsive courants :**

```
Navigation
  Mobile  : menu hamburger ≡ (caché par défaut, toggle)
  Desktop : barre latérale ou barre horizontale toujours visible

Grille de contenu
  Mobile  : 1 colonne
  Tablette: 2 colonnes
  Desktop : 3–4 colonnes

Tableau de données
  Mobile  : chaque ligne devient une "carte" empilée verticalement
  Desktop : tableau classique avec toutes les colonnes
```

**Pointer et touch :** sur mobile, la cible tactile minimale est **44 × 44 px** (recommandation Apple/Google). Un lien texte de 12px est cliquable sur desktop, pas sur mobile. Le maquettage mobile doit anticiper ça.

---

### 4.10 Design System

Un **design system** est une bibliothèque de composants UI réutilisables accompagnés de règles d'utilisation. C'est la source de vérité unique qui garantit la cohérence visuelle sur toute l'application — et entre plusieurs applications d'une même organisation.

**Composition d'un design system :**

```
Design System
├── Tokens (variables de base)
│   ├── Couleurs     : primary-500 = #3B82F6, danger = #EF4444…
│   ├── Typographie  : font-heading = Inter 700, font-body = Inter 400…
│   └── Espacement   : spacing-sm = 8px, spacing-md = 16px…
│
├── Composants atomiques
│   ├── Button       : variantes primary / secondary / danger / ghost
│   ├── Input        : états default / focus / error / disabled
│   ├── Badge        : couleurs par statut (vert=validé, orange=attente)
│   └── Icon         : bibliothèque cohérente (Heroicons, Lucide…)
│
└── Composants composés
    ├── Form         : Input + Label + HelperText + ErrorMessage
    ├── Card         : conteneur avec shadow et padding standardisés
    └── DataTable    : tableau + tri + pagination + actions par ligne
```

**Atomic Design (Brad Frost)** est une méthode pour structurer ce design system en niveaux :

| Niveau | Analogie chimique | Exemple |
|--------|-------------------|---------|
| **Atomes** | Éléments irréductibles | Bouton, champ, icône, badge |
| **Molécules** | Combinaison d'atomes | Champ de recherche (input + bouton) |
| **Organismes** | Combinaison de molécules | Header (logo + nav + avatar) |
| **Templates** | Structure de page | Layout avec sidebar + zone contenu |
| **Pages** | Template avec données réelles | La vraie page "Mes demandes" |

**Pourquoi c'est important pour un CDA ?** Le dev front-end implémente souvent le design system sous forme de composants React/Vue. Quand le designer livre la maquette Figma, les tokens de couleur et les variantes de boutons doivent se mapper directement sur les composants code. Une incohérence design system ↔ code produit une application visuellement fragmentée.

```
Figma token       →   CSS variable         →   Tailwind config
primary-500       →   --color-primary-500  →   colors.primary[500]
```

---

> **🔒 Sécurité**
>
> - **Messages d'erreur génériques** : « Identifiants incorrects » plutôt que « Mot de passe erroné » — ce dernier confirme qu'un e-mail existe (*user enumeration*), ce qui aide les attaquants.
> - **Ne jamais afficher de données sensibles** inutilement : un solde de congés ne doit pas s'afficher sur toutes les pages.
> - **Prévoir les écrans de sécurité dès la maquette** : connexion, déconnexion, session expirée, page d'erreur 403 ("vous n'avez pas accès"), gestion du consentement RGPD.
