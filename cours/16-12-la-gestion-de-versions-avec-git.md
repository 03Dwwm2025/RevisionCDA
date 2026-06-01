## 12. La gestion de versions avec Git

**Git** enregistre l'historique du code et permet le travail collaboratif. Concepts essentiels :

- **Commit** : un instantané daté et nommé d'un ensemble de modifications.
- **Branche** : une ligne de développement parallèle (`main`, `develop`, `feature/...`).
- **Merge / Pull Request** : fusionner une branche dans une autre, après revue de code.
- **Remote** : le dépôt distant partagé (GitHub, GitLab).

```
git clone <url>            # récupérer un dépôt
git checkout -b feature/x  # créer + basculer sur une branche
git add .                  # indexer les changements
git commit -m "feat: ajout dépôt de demande"
git push origin feature/x  # envoyer la branche
# -> ouvrir une Pull Request, revue, puis merge dans main
git pull                   # récupérer les changements distants
```

Un **workflow** courant est *GitHub Flow* : `main` toujours déployable, une branche par fonctionnalité, fusion via PR après validation de la CI (tests). Les messages de commit gagnent à suivre la convention *Conventional Commits* (`feat:`, `fix:`, `docs:`…).

> **🔒 Sécurité**
>
> - **Ne JAMAIS committer de secrets** (mots de passe, clés API, fichiers `.env`, certificats). Une fois poussé, un secret est compromis — même supprimé ensuite, il reste dans l'historique.
> - Tenir un **`.gitignore`** rigoureux (`.env`, `node_modules`, `bin/`, `obj/`, fichiers de config locaux).
> - Activer le **scan de secrets** (GitHub secret scanning) et faire des **revues de code** (la PR est aussi une revue de sécurité).
