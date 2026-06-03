## 16. L'intégration et le déploiement continus (CI/CD)

La CI/CD automatise le chemin du code source jusqu'à la production. L'objectif : détecter les problèmes le plus tôt possible et déployer de façon fiable et répétable.

### 16.1 CI vs CD — les définitions

**CI — Intégration Continue :**
À chaque `push`, le pipeline **construit** le projet et lance les **tests** automatiquement. Si un test échoue, tout le monde est alerté immédiatement — avant que le code ne soit fusionné dans `main`.

**CD — Déploiement Continu :**
Si la CI passe, l'application est **déployée automatiquement** vers un environnement cible (staging, production). Pas de déploiement manuel, pas d'oubli de commande.

```
Push sur main
    │
    ▼
┌─────────────────────────────────┐
│  CI : build + tests             │  ← échoue → notification, pas de déploiement
│  - npm ci / dotnet restore      │
│  - npm test / dotnet test       │
│  - npm run build                │
└─────────────────────────────────┘
    │ (si tout passe)
    ▼
┌─────────────────────────────────┐
│  CD : déploiement               │
│  - docker build + push registry │
│  - deploy sur le serveur        │
└─────────────────────────────────┘
```

---

### 16.2 GitHub Actions — anatomie d'un pipeline

Un pipeline GitHub Actions est un fichier YAML dans `.github/workflows/`.

```yaml
name: CI/CD

on:
  push:
    branches: [main]          # déclenché sur chaque push vers main
  pull_request:
    branches: [main]          # et sur chaque PR vers main (CI seulement)

jobs:
  build-test:
    runs-on: ubuntu-latest    # runner GitHub (VM Ubuntu gratuite)

    steps:
      - uses: actions/checkout@v4
        # ↑ Récupère le code source du dépôt dans le runner.
        #   Sans ça, le runner est une VM vide — il ne sait pas quel code builder.
        #   @v4 = version de l'action (toujours épingler une version, pas @latest)

      - name: Installer les dépendances
        run: npm ci                        # lockfile strict

      - name: Lancer les tests
        run: npm test                      # la CI échoue si un test échoue

      - name: Build de production
        run: npm run build

  deploy:
    needs: build-test          # ne s'exécute QUE si build-test réussit
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'   # uniquement sur main (pas les PRs)

    steps:
      - name: Build et push de l'image Docker
        run: |
          docker build -t ghcr.io/${{ github.repository }}:${{ github.sha }} .
          docker push ghcr.io/${{ github.repository }}:${{ github.sha }}

      - name: Déployer sur le VPS via SSH
        run: |
          ssh deploy@mon-vps 'cd /srv/app && docker compose pull && docker compose up -d'
```

**Concepts clés :**

| Terme | Définition |
| --- | --- |
| **Workflow** | Le fichier YAML complet, déclenché par des événements |
| **Job** | Une unité de travail qui s'exécute sur un runner |
| **Step** | Une étape dans un job (`run` ou `uses`) |
| **Runner** | La machine virtuelle qui exécute le job |
| **needs** | Déclare la dépendance entre jobs |

---

### 16.3 Les secrets dans le pipeline

Les identifiants (clé SSH, token du registry, mot de passe BDD) ne doivent **jamais** apparaître en clair dans le YAML.

```yaml
# ❌ Jamais ça
- run: ssh root:MonMotDePasse@45.155.171.34 '...'

# ✅ Secrets chiffrés GitHub
- run: ssh deploy@${{ secrets.VPS_HOST }} '...'
  # SSH_KEY et VPS_HOST définis dans Settings → Secrets du repo
```

**Ajouter un secret :** GitHub → Repo → Settings → Secrets and variables → Actions → New repository secret.

Les secrets sont masqués dans les logs (`***`), chiffrés au repos, et jamais exposés aux PRs venant de forks.

---

### 16.4 Les tags d'image Docker — éviter `latest`

```yaml
# ❌ latest : non déterministe, rollback impossible
tags: ghcr.io/user/app:latest

# ✅ SHA du commit : traçabilité totale
tags: ghcr.io/user/app:${{ github.sha }}

# ✅ Les deux (pratique courante)
tags: |
  ghcr.io/user/app:latest
  ghcr.io/user/app:${{ github.sha }}
```

Avec le SHA, on sait exactement quel code tourne en prod, et on peut revenir en arrière : `docker run ghcr.io/user/app:abc1234`.

---

### 16.5 DevSecOps — intégrer la sécurité au pipeline

Le **DevSecOps** (*Shift Left Security*) intègre des étapes de sécurité directement dans la CI, pas en fin de projet.

```yaml
- name: Scan des dépendances vulnerables
  run: npm audit --audit-level=high    # échoue si faille critique

- name: Scan de l'image Docker (Trivy)
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: ghcr.io/${{ github.repository }}:latest
    exit-code: '1'                     # échoue si CVE critique

- name: SAST (analyse statique)
  uses: github/codeql-action/analyze@v3
```

| Outil | Type | Ce qu'il détecte |
| --- | --- | --- |
| `npm audit` / Dependabot | Dépendances | CVE dans les librairies |
| Trivy / Snyk | Image Docker | CVE dans l'OS et les libs du conteneur |
| CodeQL / Semgrep | SAST | Failles dans le code source |
| OWASP ZAP | DAST | Failles de l'app en cours d'exécution |

---

### 16.6 Protéger la branche `main`

```
GitHub → Repo → Settings → Branches → Add branch ruleset
```

Règles recommandées :
- ✅ **Require a pull request** before merging
- ✅ **Require status checks to pass** (la CI doit être verte)
- ✅ **Require at least 1 approval** (revue de code)
- ✅ **Do not allow force pushes**

Ces règles correspondent à **OWASP A08** (intégrité de la chaîne de livraison) : un attaquant qui compromet un compte développeur ne peut pas pousser directement du code malveillant en production.

> **🔒 Sécurité**
>
> - **Secrets dans le pipeline** : toujours via GitHub Secrets, jamais en clair dans le YAML.
> - **Principe du moindre privilège** pour les jetons CI : droits limités au strict nécessaire, durée de vie courte.
> - **Intégrer SAST, scan de dépendances et scan d'image** comme étapes bloquantes dès le début — corriger une faille en CI coûte 10× moins cher qu'en production.
