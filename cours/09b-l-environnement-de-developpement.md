## L'environnement de développement

La première compétence du bloc 1 est **installer et configurer son environnement de travail en fonction du projet**. Ça paraît évident quand on l'a fait cent fois — c'est exactement pour ça que ça se rate à l'oral : on ne sait plus expliquer ce qu'on fait par réflexe.

---

### 1. De quoi se compose un environnement de travail

| Brique | Rôle | Exemples |
| --- | --- | --- |
| **SDK / moteur d'exécution** | Compiler et exécuter le code | .NET SDK, Node.js, JDK, Python |
| **IDE ou éditeur** | Écrire, naviguer, refactorer, déboguer | Visual Studio, VS Code, Rider |
| **Gestionnaire de paquets** | Installer et figer les dépendances | NuGet, npm, pip |
| **Gestionnaire de versions** | Historiser le code | Git + un hébergeur (GitHub, GitLab) |
| **SGBD local** | Développer contre une vraie base | SQL Server, PostgreSQL, souvent en conteneur |
| **Client d'API** | Appeler l'API sans front | Swagger, Postman, Insomnia |
| **Conteneurs** | Reproduire l'environnement à l'identique | Docker Desktop |
| **Outils qualité** | Contrôler le style et les erreurs en continu | ESLint, analyseurs Roslyn, EditorConfig |

---

### 2. Le gestionnaire de paquets et le fichier de verrouillage

```bash
# .NET
dotnet add package Microsoft.EntityFrameworkCore --version 9.0.0
dotnet restore          # installe ce que le projet déclare

# Node.js
npm install express     # ajoute la dépendance et met à jour package-lock.json
npm ci                  # installe EXACTEMENT le contenu du lock — à utiliser en CI
```

**`npm install` ou `npm ci` ?** `install` peut mettre à jour des dépendances dans les limites autorisées par le fichier `package.json` et modifier le verrou. `ci` installe à l'identique ce que décrit `package-lock.json`, et échoue si les deux fichiers divergent. En intégration continue, c'est `ci` — on veut un build reproductible, pas un build qui change tout seul un mardi matin.

**Les plages de versions** (dans `package.json`) :

| Notation | Autorise | Risque |
| --- | --- | --- |
| `1.4.2` | Exactement cette version | Aucun, mais aucune correction de sécurité automatique |
| `~1.4.2` | Les correctifs : 1.4.x | Faible |
| `^1.4.2` | Les mineures : 1.x.x | Une bibliothèque mal versionnée peut casser |
| `*` | N'importe quoi | À éviter |

Le fichier de verrouillage (`package-lock.json`, `packages.lock.json`) **se commite** : c'est lui qui garantit que la machine du collègue, celle de la CI et le serveur installent le même arbre de dépendances.

---

### 3. Configurer le projet, pas la machine

Le réflexe professionnel est que **tout ce qui est nécessaire au projet vit dans le dépôt**, pour qu'un nouvel arrivant soit opérationnel en une commande.

```
projet/
├── .editorconfig        ← indentation, fins de ligne, encodage : identiques pour tous
├── .gitignore           ← ce qui ne doit pas être versionné
├── .env.example         ← la liste des variables attendues, SANS les valeurs
├── compose.yaml         ← la base de données et les services annexes, en conteneur
├── README.md            ← comment démarrer, en trois commandes
└── .github/workflows/   ← la CI
```

Un `README` qui commence par « Prérequis : .NET 10, Docker » et enchaîne sur trois commandes vaut mieux qu'une journée de configuration à la main. Le test : **un collègue clone le dépôt et fait tourner le projet sans te poser de question.**

---

### 4. Déboguer — l'outil qu'on remplace trop souvent par des affichages

| Terme | Ce que ça fait |
| --- | --- |
| **Point d'arrêt** (*breakpoint*) | Suspend l'exécution à une ligne |
| **Point d'arrêt conditionnel** | Ne suspend que si une condition est vraie (`idSalarie == 42`) |
| **Pas à pas principal** (*step over*) | Exécute la ligne sans entrer dans les appels |
| **Pas à pas détaillé** (*step into*) | Entre dans la méthode appelée |
| **Pile d'appels** | La chaîne des appels qui a mené ici |
| **Espion** (*watch*) | Surveille la valeur d'une expression |

Le débogueur montre l'**état complet** du programme à un instant donné, là où un affichage en console ne montre que ce qu'on a pensé à afficher. Dans le navigateur, les mêmes fonctions existent dans l'onglet Sources des outils de développement, plus l'onglet Réseau pour inspecter les requêtes et l'onglet Éléments pour le DOM calculé.

---

### 5. La veille technologique

Le référentiel attend qu'un concepteur développeur **entretienne ses compétences**. C'est aussi une question fréquente à l'entretien final : « comment vous tenez-vous informé ? »

| Type de veille | Ce qu'on surveille | Où |
| --- | --- | --- |
| **Technologique** | Nouveautés des langages et frameworks | Blogs officiels, notes de version, conférences |
| **Sécurité** | Failles publiées sur les dépendances utilisées | Bulletins CVE, Dependabot, `npm audit` |
| **Métier** | Évolutions du domaine et de la réglementation | Presse spécialisée, CNIL pour le RGPD |
| **Concurrentielle** | Ce que font les produits comparables | Essai des produits, revues |

Une réponse concrète vaut mieux qu'une liste : citer deux ou trois sources qu'on lit vraiment, et un exemple de choix technique qu'une veille a fait changer d'avis.

---

> **🔒 Sécurité**
>
> - **Aucun secret dans le dépôt** : le `.env` est ignoré par Git, seul le `.env.example` est versionné, avec des valeurs vides.
> - **Vérifier ce qu'on installe** : une dépendance ajoute son code et tout son arbre de dépendances à ton application. Regarder le nombre de mainteneurs, la date de la dernière publication, et se méfier des noms proches d'un paquet connu (*typosquatting*).
> - **Mettre à jour régulièrement** : une dépendance figée pendant deux ans accumule les failles connues (OWASP A06).
> - **Verrouiller les versions** : un fichier de verrouillage commité empêche qu'une version compromise entre en production sans que personne ne l'ait décidé.
