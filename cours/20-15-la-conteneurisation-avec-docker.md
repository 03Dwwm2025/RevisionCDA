## 15. La conteneurisation avec Docker

**Docker** empaquette une application avec **toutes ses dépendances** dans une unité standardisée : le **conteneur**. Cela élimine le fameux « ça marche sur ma machine » en garantissant un environnement identique du développement à la production.

|  | Machine virtuelle | Conteneur Docker |
| --- | --- | --- |
| Système | Un OS invité complet par VM | Partage le noyau de l'hôte |
| Poids | Lourd (1–2 Go) | Léger (quelques Mo) |
| Démarrage | Lent (minutes) | Rapide (secondes) |
| Isolation | Totale (OS séparé) | Processus isolés (namespaces Linux) |

---

### 15.1 Les concepts clés

**Image et conteneur :**

| Concept | Analogie POO | Définition |
| --- | --- | --- |
| **Image** | Classe | Template en lecture seule décrivant le système de fichiers et la configuration. Construite à partir d'un Dockerfile. |
| **Conteneur** | Objet (instance) | Instance en cours d'exécution d'une image. Isolé des autres conteneurs et de l'hôte. |
| **Registry** | Dépôt centralisé | Serveur de stockage et distribution d'images (Docker Hub, GHCR, GitLab Registry…) |

**Cycle de vie d'un conteneur :**

```
Image ──► docker run ──► Conteneur (running)
                              │
                         docker stop
                              │
                         Conteneur (stopped)
                              │
                          docker rm
                              │
                           (supprimé)
```

**Layers (couches) :**

Les images sont composées de **couches empilées** — une par instruction du Dockerfile. Les couches sont **mises en cache** : si une couche n'a pas changé, Docker la réutilise plutôt que de la reconstruire. C'est pourquoi l'ordre des instructions dans le Dockerfile a un impact direct sur les performances du build.

```
Layer 5 : COPY . .          ← change souvent (code source)
Layer 4 : RUN npm ci        ← change uniquement si package.json change
Layer 3 : COPY package*.json./← stable
Layer 2 : WORKDIR /app       ← stable
Layer 1 : FROM node:20-alpine ← très stable (image de base)
```

**Volumes :**

Les conteneurs sont **éphémères** : quand on les supprime, leurs données disparaissent. Les **volumes** permettent de persister des données indépendamment du cycle de vie du conteneur.

```
docker run -v pgdata:/var/lib/postgresql/data postgres
#           └── volume nommé, géré par Docker, persiste après suppression du conteneur
```

Types de volumes :
- **Volume nommé** (`pgdata:/chemin`) : géré par Docker, recommandé pour les BDD
- **Bind mount** (`/chemin/hôte:/chemin/conteneur`) : monte un dossier de l'hôte — pratique en développement

**Réseaux Docker :**

| Mode réseau | Comportement |
| --- | --- |
| **bridge** (défaut) | Réseau virtuel privé — les conteneurs peuvent se parler par leur nom |
| **host** | Le conteneur partage le réseau de l'hôte — plus d'isolation réseau |
| **none** | Aucune interface réseau |

Dans Docker Compose, tous les services d'un même fichier partagent automatiquement un réseau bridge et peuvent se joindre par leur **nom de service** (`db`, `api`, `nginx`).

**Port mapping :**

```bash
docker run -p 8080:80 nginx
#            ↑     ↑
#        port hôte  port conteneur
# → http://localhost:8080 redirige vers le port 80 du conteneur
```

**Commandes de debug essentielles :**

```bash
docker ps                      # lister les conteneurs en cours d'exécution
docker ps -a                   # tous les conteneurs (y compris arrêtés)
docker logs -f api             # suivre les logs en temps réel
docker exec -it api sh         # ouvrir un shell dans le conteneur
docker inspect api             # métadonnées détaillées (réseau, volumes, config)
docker stats                   # consommation CPU/RAM en temps réel
docker volume ls               # lister les volumes
```

---

### 15.2 Le Dockerfile

Le **Dockerfile** décrit la construction d'une image, instruction par instruction.

| Instruction | Rôle |
| --- | --- |
| `FROM` | Image de base (toujours en premier) |
| `WORKDIR` | Répertoire de travail dans le conteneur |
| `COPY` | Copie des fichiers locaux vers l'image |
| `ADD` | Comme COPY + télécharge des URLs et décompresse des archives |
| `RUN` | Exécute une commande pendant le **build** (crée une couche) |
| `ENV` | Variable d'environnement disponible au **runtime** |
| `ARG` | Variable disponible uniquement pendant le **build** |
| `EXPOSE` | Documente le port exposé (informatif, ne l'ouvre pas réellement) |
| `CMD` | Commande de démarrage par défaut (peut être surchargée) |
| `ENTRYPOINT` | Commande de démarrage fixe (difficile à surcharger) |
| `USER` | Utilisateur qui exécute les commandes (sécurité : ne pas rester root) |

> **`COPY` vs `ADD` :** préférer `COPY` (comportement prévisible). Utiliser `ADD` uniquement si on a besoin de la décompression automatique d'archives tar.

**Le `.dockerignore` — indispensable :**

Sans lui, `COPY . .` embarque `node_modules`, le dossier `.git`, les fichiers `.env` et tout le reste dans l'image : build plus lent, image plus lourde, et surtout **secrets embarqués**.

```
node_modules
dist
.git
.env
*.log
Dockerfile
.dockerignore
```

Même rôle et même syntaxe que le `.gitignore`, mais pour le contexte de build Docker.

**Le build multi-stage** sépare l'environnement de compilation de l'image finale :

```dockerfile
# Stage 1 : build (image Node complète)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci                    # install avant le code (cache des layers)
COPY . .
RUN npm run build             # génère le dossier dist/

# Stage 2 : image de prod (Nginx léger, sans Node)
FROM nginxinc/nginx-unprivileged:alpine   # variante qui tourne sans root
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

L'image finale ne contient ni Node, ni les dépendances de développement, ni le code source — seulement les fichiers statiques compilés et Nginx. On passe typiquement de plusieurs centaines de méga-octets à quelques dizaines.

> **Le piège du non-root avec Nginx :** ajouter `USER nginx` à l'image officielle `nginx:alpine` ne suffit pas — le processus maître n'a pas le droit d'écrire `/var/run/nginx.pid` ni `/var/cache/nginx`, et le conteneur s'arrête au démarrage. Soit on utilise l'image `nginxinc/nginx-unprivileged` (qui écoute sur 8080), soit on ajoute les `chown` nécessaires à la main. Pour une image applicative classique (Node, .NET), `USER` seul suffit.

---

### 15.3 Docker Compose

**Compose** définit et orchestre une application **multi-conteneurs** dans un fichier `compose.yaml`.

```yaml
services:
  api:
    build: .
    environment:
      DATABASE_URL: ${DATABASE_URL}     # lu depuis un fichier .env
    ports:
      - "8080:80"
    depends_on:
      db: { condition: service_healthy } # attend que la BDD soit prête
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data  # persistance des données
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s
      retries: 5

volumes:
  pgdata:   # volume nommé déclaré ici
```

```bash
docker compose up -d --build   # démarrer en arrière-plan, rebuilder
docker compose ps              # état des services
docker compose logs -f api     # logs en temps réel
docker compose down            # arrêter et supprimer les conteneurs
docker compose down -v         # + supprimer les volumes
```

---

> **🔒 Sécurité**
>
> - **Ne pas tourner en root** : ajouter `USER node` (ou un utilisateur dédié) avant le `CMD`. En cas de compromission du conteneur, l'attaquant n'a pas les droits root.
> - **Images minimales** (`alpine`, `slim`) : moins de paquets = moins de surface d'attaque.
> - **Secrets hors des images** : jamais de mot de passe dans le Dockerfile — il est visible dans les layers (`docker history`). Utiliser des variables d'environnement ou des fichiers `.env` exclus du repo.
> - **Tags précis** : éviter `:latest` en production, préférer un tag de version (`:1.2.3`) ou un SHA de commit pour la reproductibilité.
> - **Scanner les images** avec Trivy ou `docker scout` pour détecter les CVE.
> - **Le port de la BDD ne doit jamais être exposé** sur l'hôte en production (pas de `ports:` pour le service db).
