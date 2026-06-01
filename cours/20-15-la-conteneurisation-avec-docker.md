## 15. La conteneurisation avec Docker

**Docker** empaquette une application avec **toutes ses dépendances** dans une unité standardisée : le **conteneur**. Cela élimine le fameux « ça marche sur ma machine » en garantissant un environnement identique du développement à la production.

|  | Machine virtuelle | Conteneur Docker |
| --- | --- | --- |
| Système | Un OS invité complet par VM | Partage le noyau de l'hôte |
| Poids | Lourd (1–2 Go) | Léger (quelques Mo) |
| Démarrage | Lent (minutes) | Rapide (secondes) |

### 15.1 Les concepts clés

| Concept | Définition (analogie POO) |
| --- | --- |
| **Image** | Template en lecture seule décrivant le système de fichiers et la config. C'est l'équivalent d'une **classe** |
| **Conteneur** | Instance en cours d'exécution d'une image — comme un **objet** instancié. Isolé (filesystem, réseau, processus) |
| **Layers** | Les images sont faites de couches empilées (une par instruction du Dockerfile), mises en cache pour accélérer les builds |
| **Registry** | Serveur de stockage d'images (Docker Hub par défaut ; aussi GitLab Registry, GHCR, AWS ECR…) |
| **Volume** | Stockage persistant indépendant du cycle de vie du conteneur (les conteneurs sont éphémères) |

Anatomie d'une référence d'image : `docker.io/library/node:20-alpine` se lit *registry / namespace / nom : tag*.

### 15.2 Le Dockerfile

Le **Dockerfile** décrit la construction d'une image, instruction par instruction (chacune crée une couche). Les instructions essentielles :

| Instruction | Rôle |
| --- | --- |
| FROM | Image de base (toujours en premier) |
| WORKDIR | Répertoire de travail dans le conteneur |
| COPY | Copie des fichiers de l'hôte vers l'image |
| RUN | Exécute une commande pendant le **build** |
| ENV / ARG | Variable d'environnement (runtime) / de build |
| EXPOSE | Documente le port (informatif) |
| CMD / ENTRYPOINT | Commande de démarrage du conteneur |
| USER | Utilisateur qui exécute les commandes (sécurité) |

Le **build multi-stage** sépare l'environnement de compilation de l'image finale, pour une image de production minimale :

```
# Stage 1 : build
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2 : image de prod légère
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
# (ce schéma correspond au déploiement de ton portfolio React/Vite)
```

> **💡 Bon à savoir**
>
> Optimisations clés : copier `package.json` et installer les dépendances **avant** de copier le code source (le cache des layers est invalidé moins souvent) ; toujours un **`.dockerignore`** (exclut `node_modules`, `.git`, `.env`) pour alléger le contexte de build.

### 15.3 Docker Compose

**Compose** définit et orchestre une application **multi-conteneurs** dans un seul fichier `compose.yaml`. Idéal pour une stack API + BDD + reverse proxy.

```
services:
  api:
    build: .
    environment:
      DATABASE_URL: ${DATABASE_URL}   # injecté, pas en dur
    depends_on:
      db: { condition: service_healthy }
    restart: unless-stopped
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data   # persistance
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s
      retries: 5
volumes:
  pgdata:
```

```
docker compose up -d --build   # démarrer (détaché) en rebuildant
docker compose ps              # état des services
docker compose logs -f api     # suivre les logs d'un service
docker compose down            # arrêter et supprimer
```

> **🔒 Sécurité**
>
> Un conteneur mal configuré élargit la surface d'attaque.
> - **Ne pas tourner en root** : ajouter `USER node` (ou un user dédié) avant le `CMD`. Limite l'impact d'une compromission.
> - **Images minimales** (`alpine`, `slim`) : moins de paquets = moins de vulnérabilités. Une image de prod devrait rester sous ~200 Mo.
> - **Secrets hors des images** : jamais de mot de passe dans le Dockerfile (visible dans les layers). Utiliser variables d'env, `.env` exclu du repo, ou **Docker secrets**.
> - **Tags précis** : éviter `:latest` en production, préférer un tag sémantique (`:1.2.3`) ou un SHA de commit pour la reproductibilité.
> - **Scanner les images** (Trivy, `docker scout`) pour détecter les CVE, et **mettre à jour** régulièrement les images de base.
> - Définir un **healthcheck** et **limiter les ressources** (`mem_limit`, `cpus`) pour éviter qu'un conteneur n'affame les autres.
