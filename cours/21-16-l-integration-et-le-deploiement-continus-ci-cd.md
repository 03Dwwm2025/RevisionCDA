## 16. L'intégration et le déploiement continus (CI/CD)

La CI/CD automatise le chemin du code jusqu'à la production :

**CI (Intégration continue) :** à chaque `push`, on **construit** le projet et on lance les **tests** automatiquement. On détecte les régressions immédiatement, avant la fusion.

**CD (Déploiement continu) :** si la CI passe, l'application est **déployée automatiquement** (construction de l'image Docker, push vers un registry, mise à jour du serveur).

Un **pipeline** est une suite d'étapes (*jobs*) déclenchées par un événement (push, PR, tag). Exemple avec **GitHub Actions** (ta stack de déploiement) :

```
name: CI/CD
on:
  push: { branches: [main] }
jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test           # la CI échoue si un test échoue
      - run: npm run build
  deploy:
    needs: build-test           # ne déploie que si les tests passent
    runs-on: ubuntu-latest
    steps:
      - name: Build & push image
        run: |
          docker build -t ghcr.io/user/app:${{ github.sha }} .
          docker push ghcr.io/user/app:${{ github.sha }}
      - name: Deploy on VPS via SSH
        run: ssh deploy@vps 'cd /srv/app && docker compose pull && docker compose up -d'
```

> **🔒 Sécurité**
>
> - **Secrets dans le pipeline** : les identifiants (clé SSH, token du registry) vont dans les **GitHub Secrets chiffrés** (`${{ secrets.SSH_KEY }}`), jamais en clair dans le YAML.
> - **Intégrer la sécurité au pipeline** (*DevSecOps*) : SAST, scan des dépendances et scan de l'image Docker comme étapes bloquantes.
> - **Principe du moindre privilège** pour les jetons CI (droits limités au strict nécessaire, à durée de vie courte).
> - **Intégrité de la chaîne** (OWASP A08) : signer les images, vérifier les artefacts, protéger la branche `main` (revue obligatoire).
