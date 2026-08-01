import type { Question } from '../../types/quiz';

export const questionsDocker: Question[] = [
  // --- Concepts clés (15.1) ---
  {
    id: 'docker-001',
    theme: 'docker',
    type: 'qcm',
    difficulte: 1,
    enonce:
      'Dans l\'analogie Docker ↔ POO, à quoi correspond un *conteneur* en cours d\'exécution ?',
    options: [
      'À une classe (modèle réutilisable)',
      'À un objet instancié à partir d\'une image',
      'À un attribut de l\'image',
      'Au registre Docker Hub',
    ],
    bonneReponse: 1,
    explication:
      'Image = classe (template en lecture seule). Conteneur = objet (instance en cours d\'exécution, isolée). Plusieurs conteneurs peuvent être lancés depuis la même image, comme plusieurs objets d\'une même classe.',
  },
  {
    id: 'docker-005',
    theme: 'docker',
    type: 'vrai_faux',
    difficulte: 2,
    enonce:
      'Un volume Docker nommé est automatiquement supprimé lorsque le conteneur qui l\'utilise s\'arrête.',
    bonneReponse: false,
    explication:
      'Les volumes nommés persistent après l\'arrêt ou la suppression du conteneur — c\'est leur intérêt pour la BDD. Pour les supprimer : `docker volume rm <nom>` ou `docker compose down -v`.',
  },

  // --- Dockerfile (15.2) ---
  {
    id: 'docker-006',
    theme: 'docker',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque instruction Dockerfile à son rôle.',
    paires: [
      { gauche: 'FROM', droite: 'Définit l\'image de base (toujours en premier)' },
      { gauche: 'RUN', droite: 'Exécute une commande pendant le build (crée une couche)' },
      { gauche: 'CMD', droite: 'Définit la commande de démarrage du conteneur' },
      { gauche: 'USER', droite: 'Définit l\'utilisateur qui exécute les processus (éviter root)' },
    ],
    explication:
      '`FROM` est le point de départ obligatoire. `RUN` s\'exécute au build et génère une couche. `CMD` s\'exécute au démarrage du conteneur. `USER` est essentiel pour la sécurité : ne pas tourner en root.',
  },
  {
    id: 'docker-003',
    theme: 'docker',
    type: 'qcm',
    difficulte: 1,
    enonce:
      'Quel fichier permet d\'exclure des dossiers/fichiers du contexte envoyé au démon lors d\'un `docker build` ?',
    options: ['.dockerignore', '.gitignore', '.buildignore', 'Dockerfile.ignore'],
    bonneReponse: 0,
    explication:
      '`.dockerignore` fonctionne comme `.gitignore` pour le contexte de build. Exclure `node_modules`, `.git`, `.env` réduit la taille du contexte et évite de copier des secrets dans l\'image.',
  },
  {
    id: 'docker-010',
    theme: 'docker',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'Pourquoi copie-t-on `package.json` et installe-t-on les dépendances AVANT de copier tout le code source dans un Dockerfile ?',
    options: [
      'Pour que les dépendances soient disponibles plus tôt dans le build',
      'Pour exploiter le cache des layers : si `package.json` n\'a pas changé, Docker réutilise la couche des dépendances',
      'C\'est une obligation syntaxique de Docker',
      'Pour réduire la taille de l\'image finale',
    ],
    bonneReponse: 1,
    explication:
      'Chaque instruction crée une couche mise en cache. Si on copie tout avec `COPY . .` d\'abord, le moindre changement de code invalide aussi la couche `npm ci`. En isolant `package.json`, la réinstallation des dépendances n\'arrive que si elles changent vraiment.',
  },
  {
    id: 'docker-011',
    theme: 'docker',
    type: 'vrai_faux',
    difficulte: 2,
    enonce:
      'En Dockerfile, `ARG` définit une variable disponible uniquement pendant le build, tandis que `ENV` persiste dans le conteneur au runtime.',
    bonneReponse: true,
    explication:
      '`ARG` : variable de build uniquement (ex. numéro de version). `ENV` : variable d\'environnement accessible au runtime par l\'application. Ne pas mettre de secrets dans `ARG` non plus : ils apparaissent dans l\'historique de l\'image (`docker history`).',
  },

  // --- Multi-stage (15.2 suite) ---
  {
    id: 'docker-002',
    theme: 'docker',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'Dans un build multi-stage, quelle instruction copie un artefact du stage `builder` vers le stage final ?',
    options: [
      'COPY --from=builder /app/dist ./dist',
      'MOVE builder:/app/dist ./dist',
      'IMPORT builder /app/dist',
      'COPY /app/dist ./dist --stage=builder',
    ],
    bonneReponse: 0,
    explication:
      '`COPY --from=<stage>` est la syntaxe officielle. Elle permet de récupérer uniquement les artefacts compilés, sans embarquer Node, npm ou les `devDependencies` dans l\'image de production.',
  },
  {
    id: 'docker-007',
    theme: 'docker',
    type: 'completer_code',
    difficulte: 2,
    enonce:
      'Complétez ce Dockerfile multi-stage (app React/Vite → Nginx).',
    codeAvecTrous: `# Stage 1 : build
FROM node:20-alpine ___1___ builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run ___2___

# Stage 2 : production
FROM nginx:alpine
COPY ___3___ /app/dist /usr/share/nginx/html
EXPOSE 80`,
    choix: ['AS', 'IS', 'NAMED', 'build', 'start', 'test', '--from=builder', '--copy=builder', '--from=./dist'],
    bonnesReponses: ['AS', 'build', '--from=builder'],
    explication:
      '`AS builder` nomme le stage pour pouvoir le référencer. `npm run build` génère le dossier `dist`. `--from=builder` dans le second stage récupère uniquement les artefacts compilés, sans Node ni dépendances de dev.',
  },
  {
    id: 'docker-008',
    theme: 'docker',
    type: 'remettre_ordre',
    difficulte: 1,
    enonce: 'Remettez dans l\'ordre les instructions d\'un Dockerfile multi-stage type.',
    elements: [
      'FROM node:20 AS builder',
      'RUN npm ci',
      'RUN npm run build',
      'FROM nginx:alpine',
      'COPY --from=builder /app/dist /usr/share/nginx/html',
    ],
    explication:
      'Le stage builder : image Node → install deps → build. Le stage final : image Nginx légère → copier uniquement le dist. Résultat : image de prod sans Node, sans node_modules.',
  },

  // --- Sécurité (15.2 / 15.3) ---
  {
    id: 'docker-012',
    theme: 'docker',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Parmi ces pratiques, laquelle est recommandée pour sécuriser un conteneur Docker de production ?',
    options: [
      'Utiliser `FROM ubuntu:latest` pour toujours avoir les derniers patchs',
      'Ajouter `USER node` (ou un user dédié) avant le `CMD` pour ne pas tourner en root',
      'Copier le fichier `.env` dans l\'image pour que l\'app puisse le lire',
      'Utiliser `RUN npm install` plutôt que `npm ci` pour plus de flexibilité',
    ],
    bonneReponse: 1,
    explication:
      'Tourner en root dans un conteneur est risqué : en cas de compromission, l\'attaquant a les pleins pouvoirs. `USER node` avant `CMD` est une bonne pratique de base. `:latest` est non déterministe, `.env` ne doit jamais être dans l\'image, `npm ci` est plus sûr que `npm install` (lockfile strict).',
  },

  // --- COPY vs ADD, réseaux, debug ---
  {
    id: 'docker-014',
    theme: 'docker',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quelle différence principale entre `COPY` et `ADD` dans un Dockerfile ?',
    options: [
      '`ADD` peut télécharger une URL distante et décompresser les archives tar automatiquement ; `COPY` ne fait que copier des fichiers locaux',
      '`COPY` est plus récent et remplace totalement `ADD`',
      '`ADD` est réservé aux fichiers de configuration ; `COPY` pour le code source',
      '`COPY` supporte les wildcards ; `ADD` non',
    ],
    bonneReponse: 0,
    explication:
      '`COPY` est simple et prévisible : il copie des fichiers locaux dans l\'image. `ADD` a des comportements implicites (décompression tar, URL distante) qui peuvent surprendre. La bonne pratique recommande `COPY` par défaut et `ADD` uniquement quand la décompression automatique est vraiment souhaitée.',
  },
  {
    id: 'docker-015',
    theme: 'docker',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quelle commande permet d\'afficher les logs en temps réel d\'un conteneur nommé `api` ?',
    options: [
      '`docker inspect api`',
      '`docker logs -f api`',
      '`docker exec api logs`',
      '`docker stats api`',
    ],
    bonneReponse: 1,
    explication:
      '`docker logs -f api` suit les logs en temps réel (`-f` = follow). `docker inspect` donne les métadonnées du conteneur (réseau, volumes, config). `docker exec -it api sh` ouvre un shell dans le conteneur. `docker stats` affiche la consommation CPU/RAM en temps réel.',
  },
  {
    id: 'docker-016',
    theme: 'docker',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Dans Docker Compose, deux services définis dans le même fichier `compose.yaml` peuvent se joindre par leur **nom de service** (ex. `db:5432`) sans configuration réseau supplémentaire.',
    bonneReponse: true,
    explication:
      'Docker Compose crée automatiquement un réseau bridge partagé pour tous les services du fichier. Chaque service est résolvable par son nom (`db`, `api`, `nginx`). C\'est pourquoi on peut écrire `DATABASE_URL: postgres://db:5432/app` sans connaître l\'IP réelle du conteneur.',
  },
  {
    id: 'docker-017',
    theme: 'docker',
    type: 'completer_code',
    difficulte: 3,
    enonce: 'Complétez ce Dockerfile Node.js sécurisé : dépendances en cache, non-root, port documenté.',
    codeAvecTrous: `FROM node:20-alpine
WORKDIR /app

# Installer les dépendances AVANT le code source (cache layer)
COPY package*.json ./
RUN ___1___

# Copier le code source
COPY . .
RUN npm run build

# Exécuter en non-root
___2___ node

EXPOSE 3000
___3___ ["node", "dist/index.js"]`,
    choix: ['npm ci', 'npm install', 'npm update', 'USER', 'RUN useradd', 'GROUP', 'CMD', 'ENTRYPOINT', 'RUN'],
    bonnesReponses: ['npm ci', 'USER', 'CMD'],
    explication:
      '`npm ci` installe exactement ce qui est dans `package-lock.json` (déterministe, plus sûr que `npm install`). `USER node` bascule vers l\'utilisateur non-root intégré à l\'image `node:alpine`. `CMD` définit la commande de démarrage (peut être surchargée, contrairement à `ENTRYPOINT`).',
  },

  // --- Docker Compose (15.3) ---
  {
    id: 'docker-004',
    theme: 'docker',
    type: 'vrai_faux',
    difficulte: 1,
    enonce: '`docker compose up -d` démarre les services définis dans `compose.yaml` en arrière-plan.',
    bonneReponse: true,
    explication:
      'Le flag `-d` (detach) rend la main au terminal. Sans `-d`, les logs de tous les services s\'affichent en temps réel. `--build` peut s\'ajouter pour rebuilder les images avant de démarrer.',
  },
  {
    id: 'docker-013',
    theme: 'docker',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque directive `compose.yaml` à son rôle.',
    paires: [
      { gauche: 'build: .', droite: 'Construit l\'image depuis le Dockerfile du dossier courant' },
      { gauche: 'depends_on', droite: 'Définit l\'ordre de démarrage des services' },
      { gauche: 'restart: unless-stopped', droite: 'Redémarre le conteneur automatiquement sauf arrêt manuel' },
      { gauche: 'healthcheck', droite: 'Vérifie périodiquement que le service est opérationnel' },
    ],
    explication:
      '`build` remplace `image` quand on veut builder soi-même. `depends_on` gère les dépendances de démarrage. `unless-stopped` est la politique de restart la plus courante en prod. `healthcheck` permet à `depends_on: condition: service_healthy` de fonctionner.',
  },
  {
    id: 'docker-009',
    theme: 'docker',
    type: 'completer_code',
    difficulte: 2,
    enonce:
      'Complétez ce `compose.yaml` minimaliste API + base de données.',
    codeAvecTrous: `services:
  api:
    ___1___: .
    environment:
      DATABASE_URL: \${DATABASE_URL}
    depends_on:
      db: { condition: ___2___ }
    restart: unless-stopped
  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
___3___:
  pgdata:`,
    choix: ['build', 'image', 'run', 'service_healthy', 'service_started', 'service_ready', 'volumes', 'networks', 'configs'],
    bonnesReponses: ['build', 'service_healthy', 'volumes'],
    explication:
      '`build: .` compile l\'image depuis le Dockerfile local. `service_healthy` attend que le healthcheck de la BDD passe avant de démarrer l\'API (évite les erreurs de connexion au démarrage). `volumes:` déclare le volume nommé `pgdata` pour la persistance.',
  },

  // --- Volumes, réseaux, cycle de vie ---
  {
    id: 'docker-018',
    theme: 'docker',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque type de stockage Docker à sa caractéristique.',
    paires: [
      { gauche: 'Volume nommé', droite: 'Géré par Docker, persiste après suppression du conteneur — recommandé pour les BDD' },
      { gauche: 'Bind mount', droite: 'Monte un dossier de la machine hôte dans le conteneur — pratique en développement' },
      { gauche: 'tmpfs mount', droite: 'Stockage en mémoire RAM, non persistant — pour les données temporaires sensibles' },
      { gauche: 'Conteneur (sans volume)', droite: 'Données éphémères : tout est perdu à la suppression du conteneur' },
    ],
    explication:
      'En production, toujours utiliser des **volumes nommés** pour les bases de données : `pgdata:/var/lib/postgresql/data`. Les bind mounts (`./src:/app/src`) sont parfaits en dev pour le hot-reload, mais risqués en prod car dépendent du chemin de l\'hôte.',
  },
  {
    id: 'docker-019',
    theme: 'docker',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Dans Docker Compose, pourquoi deux services peuvent-ils se joindre par leur nom (ex. `db:5432`) sans configuration réseau supplémentaire ?',
    options: [
      'Docker expose automatiquement tous les ports sur l\'hôte',
      'Compose crée automatiquement un réseau bridge partagé entre tous les services du fichier',
      'Les services partagent le même réseau `host` que la machine hôte',
      'Il faut obligatoirement configurer `links:` pour permettre la communication',
    ],
    bonneReponse: 1,
    explication:
      'Docker Compose crée un réseau bridge virtuel nommé `<projet>_default` et y connecte tous les services. Chaque service est résolvable par son nom de service (`db`, `api`). Le port de la BDD (`5432`) n\'a pas besoin d\'être mappé sur l\'hôte — il est accessible uniquement en interne.',
  },
  {
    id: 'docker-020',
    theme: 'docker',
    type: 'remettre_ordre',
    difficulte: 2,
    enonce: 'Remettez dans l\'ordre le cycle de vie d\'un conteneur Docker.',
    elements: [
      'L\'image est construite (`docker build`) ou téléchargée (`docker pull`)',
      'Le conteneur est créé à partir de l\'image (`docker run` ou `docker create`)',
      'Le conteneur est en cours d\'exécution (état `running`)',
      'Le conteneur est arrêté (`docker stop`) — état `stopped`',
      'Le conteneur est supprimé (`docker rm`) — libération des ressources',
    ],
    explication:
      'L\'image est immuable (lecture seule). Le conteneur est l\'instance en cours d\'exécution. Un conteneur arrêté peut être redémarré (`docker start`). La suppression est définitive mais les volumes nommés persistent. `docker run` = create + start en une commande.',
  },
  {
    id: 'docker-021',
    theme: 'docker',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quelle commande ouvre un **shell interactif** dans un conteneur en cours d\'exécution nommé `api` ?',
    options: [
      '`docker logs -f api`',
      '`docker exec -it api sh`',
      '`docker inspect api`',
      '`docker attach api`',
    ],
    bonneReponse: 1,
    explication:
      '`docker exec -it api sh` : `-i` = mode interactif, `-t` = pseudo-terminal (TTY), `sh` = shell à lancer. Indispensable pour déboguer un conteneur en cours d\'exécution. `docker logs -f` suit les logs. `docker inspect` affiche les métadonnées JSON. `docker attach` se connecte au processus principal (dangereux : `Ctrl+C` arrête le conteneur).',
  },
  {
    id: 'docker-022',
    theme: 'docker',
    type: 'qcm',
    difficulte: 2,
    enonce: 'À quoi sert un fichier `.dockerignore` ?',
    options: [
      'À exclure des fichiers du contexte de build : `node_modules`, `.git`, `.env`',
      'À indiquer les conteneurs à ne pas démarrer',
      'À ignorer les erreurs pendant la construction de l’image',
      'À exclure des couches du cache Docker',
    ],
    bonneReponse: 0,
    explication:
      'Sans lui, un `COPY . .` embarque tout : build plus lent, image plus lourde, et surtout des secrets copiés dans une couche de l’image, récupérables avec `docker history`. Même rôle et même syntaxe que le `.gitignore`, mais pour le contexte de build.',
  },
  {
    id: 'docker-023',
    theme: 'docker',
    type: 'vrai_faux',
    difficulte: 3,
    enonce: 'Ajouter `USER nginx` à l’image officielle `nginx:alpine` suffit à la faire tourner sans root.',
    bonneReponse: false,
    explication:
      'Le processus maître n’a alors plus le droit d’écrire `/var/run/nginx.pid` ni `/var/cache/nginx`, et le conteneur s’arrête au démarrage. Il faut soit l’image `nginxinc/nginx-unprivileged` (qui écoute sur 8080), soit ajouter les `chown` nécessaires. Pour une image applicative classique, `USER` seul suffit.',
  },
  {
    id: 'docker-024',
    theme: 'docker',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Pourquoi copier `package*.json` puis lancer `npm ci` AVANT de copier le reste du code dans un Dockerfile ?',
    options: [
      'Pour profiter du cache de couches : l’installation n’est refaite que si les dépendances changent',
      'Parce que npm refuse de s’exécuter si le code source est présent',
      'Pour réduire la taille finale de l’image',
      'Parce que l’ordre des instructions est imposé par Docker',
    ],
    bonneReponse: 0,
    explication:
      'Chaque instruction crée une couche mise en cache. Le code source change à chaque commit, les dépendances rarement : en les installant d’abord, on évite de retélécharger tout l’arbre npm à chaque build. C’est le gain le plus rentable sur un Dockerfile.',
  },
];
