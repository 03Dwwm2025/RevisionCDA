## 12. La gestion de versions avec Git

Git enregistre l'historique du code et permet le travail collaboratif sans écraser le travail des autres. C'est l'outil incontournable du développement moderne.

### 12.1 Concepts fondamentaux

| Concept | Définition |
| --- | --- |
| **Repository (repo)** | L'espace de stockage du projet et de son historique |
| **Commit** | Un instantané daté de l'état du projet, avec un message |
| **Branche** | Un pointeur léger vers un commit — une ligne de développement parallèle |
| **Remote** | Le dépôt distant partagé (GitHub, GitLab…) |
| **Staging area** | Zone intermédiaire où on prépare les fichiers avant de committer |

```
Working directory  →  git add  →  Staging area  →  git commit  →  Repository local
Repository local   →  git push →  Remote (GitHub)
Remote (GitHub)    →  git pull →  Repository local
```

---

### 12.2 Les commandes essentielles

```bash
# Initialiser / récupérer
git init                          # nouveau repo local
git clone <url>                   # cloner un repo distant

# Travailler
git status                        # voir l'état des fichiers
git diff                          # voir les modifications non indexées
git add fichier.cs                # indexer un fichier précis
git add .                         # indexer tous les changements
git commit -m "feat: ajout dépôt de demande"

# Branches
git branch                        # lister les branches
git checkout -b feature/depot     # créer + basculer sur une branche
git switch -c feature/depot       # équivalent plus récent

# Synchroniser
git push origin feature/depot     # envoyer la branche sur le remote
git pull                          # récupérer et fusionner les changements distants
git fetch                         # récupérer sans fusionner

# Historique
git log --oneline                 # historique condensé
git log --oneline --graph         # avec visualisation des branches
```

---

### 12.3 Les branches et le workflow GitHub Flow

**Pourquoi des branches ?** Elles isolent le travail en cours de `main` (toujours stable). Plusieurs développeurs peuvent travailler en parallèle sans se bloquer.

**GitHub Flow** — le workflow recommandé :

```
main (toujours déployable)
 │
 ├── feature/depot-demande     ← développement en isolation
 │       │
 │       │  git push origin feature/depot-demande
 │       │  → Pull Request ouverte sur GitHub
 │       │  → revue de code + CI (tests automatiques)
 │       │
 └────── merge dans main  →  déploiement automatique
```

```bash
# Cycle complet d'une fonctionnalité
git checkout -b feature/valider-demande
# ... développer ...
git add .
git commit -m "feat: ajout de la validation par le manager"
git push origin feature/valider-demande
# → ouvrir une Pull Request sur GitHub
# → attendre l'approbation + CI verte
# → merger dans main
```

---

### 12.4 Merge vs Rebase

| | `git merge` | `git rebase` |
| --- | --- | --- |
| **Résultat** | Commit de fusion, historique fidèle | Historique linéaire, commits rejoués |
| **Quand** | PRs publiques, branches partagées | Nettoyer sa branche locale avant PR |
| **Risque** | Merge commits peuvent "polluer" le log | Ne jamais rebaser une branche partagée |

```bash
# Merge — crée un commit de fusion
git merge feature/depot-demande

# Rebase — rejoue les commits sur main (historique linéaire)
git rebase main
```

> ⚠️ **Règle d'or :** ne jamais faire `git rebase` sur une branche que d'autres personnes utilisent. Cela réécrit l'historique et crée des conflits pour tout le monde.

---

### 12.5 Résoudre un conflit

Un conflit survient quand deux branches modifient la même zone de code.

```
<<<<<<< HEAD (ta branche)
    public Resultat Deposer(DemandeDto dto) { ... version A ... }
=======
    public Resultat Deposer(DemandeDto dto) { ... version B ... }
>>>>>>> feature/refacto-service
```

**Procédure :**

```bash
# 1. Git signale les conflits dans les fichiers
git merge feature/refacto-service   # → CONFLICT

# 2. Ouvrir les fichiers, choisir la bonne version,
#    supprimer tous les marqueurs <<<<, ====, >>>>

# 3. Indexer la résolution
git add ServiceConges.cs

# 4. Finaliser le merge
git commit
```

Les IDE (VS Code, Rider) proposent une interface "Accept Current / Accept Incoming / Accept Both" qui simplifie la résolution.

---

### 12.6 Les messages de commit — Conventional Commits

Des messages lisibles permettent de comprendre l'historique d'un coup d'œil et de générer des changelogs automatiquement.

**Format :** `type(scope): description courte`

| Type | Usage |
| --- | --- |
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `refactor` | Refactoring sans changement de comportement |
| `test` | Ajout/modification de tests |
| `docs` | Documentation |
| `chore` | Maintenance (deps, config…) |

```bash
git commit -m "feat(conges): ajout du dépôt de demande par le salarié"
git commit -m "fix(auth): correction de la vérification du token JWT expiré"
git commit -m "refactor(repo): extraction de la logique de pagination"
```

---

### 12.7 Le `.gitignore`

Le `.gitignore` liste les fichiers que Git ne doit pas tracker. **Important :** il ne s'applique qu'aux fichiers non encore trackés.

```gitignore
# Dépendances
node_modules/
bin/
obj/

# Fichiers de config locale et secrets
.env
.env.local
*.user

# Build
dist/
publish/

# IDE
.vs/
.idea/
*.suo
```

> ⚠️ Si un fichier a déjà été commité, l'ajouter au `.gitignore` ne suffit pas. Il faut : `git rm --cached <fichier>` puis committer.

> **🔒 Sécurité**
>
> - **Ne JAMAIS committer de secrets** (mots de passe, clés API, fichiers `.env`). Un secret poussé sur GitHub est compromis — même supprimé ensuite, il reste dans l'historique.
> - Activer le **secret scanning** de GitHub (gratuit sur les repos publics).
> - La **protection de branche** (`main` requiert une PR approuvée) empêche les pushs directs en production — c'est une mesure de sécurité de la chaîne de livraison (OWASP A08).
