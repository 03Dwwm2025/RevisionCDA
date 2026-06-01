## 4. Le maquettage (UI/UX)

Avant de coder l'interface, on la dessine. Cela valide le besoin avec le client à moindre coût et cadre le travail front-end. Le maquettage se fait par niveaux de précision croissants :

| Étape | Niveau | But |
| --- | --- | --- |
| **Zoning** | Blocs grossiers | Découper la page en grandes zones (en-tête, menu, contenu, pied) |
| **Wireframe** | Filaire (N&B) | Placer les éléments avec du *lorem ipsum* et des commentaires, sans style |
| **Mockup** | Maquette stylée | Ajouter couleurs, typographie, images : le rendu visuel réaliste |
| **Prototype** | Interactif | Maquette cliquable simulant la navigation et les interactions |

Outils courants : Figma, Adobe XD, Penpot, Balsamiq. Une bonne maquette respecte des principes d'**ergonomie** (cohérence, retour visuel, prévention des erreurs) et d'**accessibilité**.

**Accessibilité (RGAA / WCAG) :** contrastes suffisants, alternatives textuelles aux images (`alt`), navigation au clavier, structure sémantique. En France, le **RGAA** est obligatoire pour le secteur public et fortement recommandé ailleurs.

> **🔒 Sécurité**
>
> - **Messages d'erreur génériques** côté UX : « Identifiants incorrects » plutôt que « Mot de passe erroné » (qui confirmerait qu'un e-mail existe — *user enumeration*).
> - Ne jamais **afficher de données sensibles** inutilement (numéro complet de carte, mot de passe en clair même temporairement).
> - Prévoir dès la maquette les écrans liés à la sécurité : connexion, **double authentification (2FA)**, gestion du consentement (cookies/RGPD), déconnexion.
