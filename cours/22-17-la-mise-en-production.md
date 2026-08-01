## 17. La mise en production

La production tourne sur un serveur accessible publiquement — typiquement un **VPS** (*Virtual Private Server*). La mise en production demande de configurer l'infrastructure, sécuriser le serveur et brancher le pipeline de déploiement.

### 17.1 Le reverse proxy — Nginx

**Nginx** se place devant l'application : il reçoit les requêtes publiques (port 80/443) et les **redirige** (*proxy_pass*) vers le bon conteneur applicatif en interne. Le conteneur applicatif n'est pas exposé directement sur Internet.

```
Internet ──► Nginx (80/443) ──► Conteneur API (port 3000, réseau interne)
                            └──► Conteneur Front (port 8080, réseau interne)
```

**Configuration Nginx de base :**

```nginx
server {
    listen 80;
    server_name mon-app.fr www.mon-app.fr;
    # Redirection automatique HTTP → HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name mon-app.fr;

    ssl_certificate     /etc/letsencrypt/live/mon-app.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mon-app.fr/privkey.pem;

    # En-têtes de sécurité
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;

    location /api/ {
        proxy_pass         http://api:3000;       # nom du service Docker Compose
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        proxy_pass         http://front:80;
    }
}
```

---

### 17.2 Nom de domaine, DNS et HTTPS

**DNS (*Domain Name System*) :**

Le DNS traduit un nom de domaine en adresse IP. Pour pointer un domaine vers un VPS, on crée un **enregistrement A** chez le registrar (OVH, Gandi, Namecheap…) :

```
mon-app.fr     A     45.155.171.34    (IPv4)
www.mon-app.fr A     45.155.171.34
```

La propagation DNS peut prendre de quelques minutes à 24h.

**Types d'enregistrements DNS :**

| Type | Usage |
| --- | --- |
| `A` | Domaine → adresse IPv4 |
| `AAAA` | Domaine → adresse IPv6 |
| `CNAME` | Alias vers un autre domaine |
| `MX` | Serveur de messagerie |
| `TXT` | Vérification de propriété, SPF, DKIM |

**HTTPS / TLS :**

HTTPS chiffre les communications entre le navigateur et le serveur. **Indispensable en production.** Let's Encrypt fournit des certificats TLS gratuits renouvelables automatiquement :

```bash
# Obtenir un certificat avec Certbot (renouvellement auto configuré)
sudo certbot --nginx -d mon-app.fr -d www.mon-app.fr

# Vérifier le renouvellement automatique
sudo certbot renew --dry-run
```

---

### 17.3 Sécuriser le serveur (VPS)

Un serveur exposé doit être **durci** dès l'installation. Les étapes dans l'ordre :

**1. Créer un utilisateur non-root :**
```bash
adduser deploy
usermod -aG sudo deploy    # droits sudo si besoin
```

**2. Authentification SSH par clé (désactiver les mots de passe) :**
```bash
# Sur votre machine locale : générer la paire de clés
ssh-keygen -t ed25519 -C "deploy-key"

# Copier la clé publique sur le serveur
ssh-copy-id -i ~/.ssh/id_ed25519.pub deploy@45.155.171.34

# Sur le serveur : désactiver l'auth par mot de passe
sudo nano /etc/ssh/sshd_config
# → PasswordAuthentication no
# → PermitRootLogin no
sudo systemctl restart sshd
```

**3. Configurer le pare-feu (UFW) :**
```bash
sudo ufw default deny incoming   # bloquer tout entrant par défaut
sudo ufw default allow outgoing  # autoriser tout sortant
sudo ufw allow 22                # SSH
sudo ufw allow 80                # HTTP
sudo ufw allow 443               # HTTPS
sudo ufw enable
sudo ufw status
```

**4. Installer fail2ban (anti brute-force) :**
```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
# fail2ban bannit automatiquement les IP après N échecs de connexion
```

**5. Maintenir le système à jour :**
```bash
sudo apt update && sudo apt upgrade -y
# Configurer les mises à jour automatiques de sécurité
sudo apt install unattended-upgrades
```

---

### 17.4 Variables d'environnement et secrets en production

```bash
# Fichier .env sur le serveur (jamais commité dans Git)
DATABASE_URL=postgresql://user:motdepasse@db:5432/congeapp
JWT_SECRET=une-cle-tres-longue-et-aleatoire
SMTP_PASSWORD=motdepasse-smtp

# Restreindre l'accès au fichier
chmod 600 .env
chown deploy:deploy .env
```

Le fichier `.env` est lu par Docker Compose et injecté comme variables d'environnement dans les conteneurs.

---

### 17.5 Les environnements

Le code traverse plusieurs environnements avant d'atteindre l'utilisateur. Chacun a un rôle distinct, et la règle est qu'ils soient **aussi proches que possible** les uns des autres — un bug qui n'apparaît qu'en production vient le plus souvent d'un écart d'environnement.

| Environnement | Qui l'utilise | Données | Rôle |
| --- | --- | --- | --- |
| **Développement** (local) | Le développeur | Jeu d'essai local | Coder et déboguer |
| **Intégration / test** | La CI | Jeu d'essai reproductible | Exécuter les tests automatisés à chaque commit |
| **Recette / préproduction** | Le client, le testeur | Copie anonymisée de la production | Dérouler le cahier de recettes, valider avant la prod |
| **Production** | Les utilisateurs réels | Données réelles | Le service rendu |

C'est précisément ce que Docker apporte : la même image traverse les quatre environnements, seule la configuration change (variables d'environnement). On élimine la classe entière des bugs « ça marchait chez moi ».

> **RGPD :** copier la base de production en préproduction pour « tester avec de vraies données » est une faute. Les données personnelles doivent être **anonymisées ou pseudonymisées** avant de quitter la production.

---

### 17.6 Les stratégies de déploiement et le retour arrière

| Stratégie | Principe | Coupure de service | Retour arrière |
| --- | --- | --- | --- |
| **Recreate** | On arrête l'ancienne version, on démarre la nouvelle | Oui, quelques secondes à quelques minutes | Redéployer l'ancienne image |
| **Rolling update** | On remplace les instances une par une | Non | Progressif, instance par instance |
| **Blue-green** | Deux environnements complets ; on bascule le trafic de « bleu » vers « vert » d'un coup | Non | Immédiat — on rebascule le routage |
| **Canary** | La nouvelle version reçoit d'abord 5 % du trafic, puis 25 %, puis tout | Non | On coupe la part canari |

```
Blue-green — la bascule est un changement de routage, pas un redéploiement

              ┌──────────────────┐
   Nginx ────►│  BLUE  v1.4.0    │  ← trafic actuel
      │       └──────────────────┘
      │       ┌──────────────────┐
      └ ─ ─ ─►│  GREEN v1.5.0    │  ← déployée, testée, en attente
              └──────────────────┘
   On modifie l'amont Nginx : le trafic passe sur GREEN.
   Si un problème apparaît, on revient sur BLUE en une commande.
```

Pour un projet CDA sur un seul VPS, le `docker compose up -d` fait un **recreate** : quelques secondes d'indisponibilité, ce qui est acceptable. Ce qui compte, c'est de pouvoir **revenir en arrière** :

```bash
# Le retour arrière suppose une image taguée par version ou par commit
IMAGE_TAG=abc1234 docker compose up -d      # on redéploie le commit précédent
```

C'est la raison concrète pour laquelle on évite le tag `latest` : sans version identifiable, il n'y a pas de retour arrière possible.

**Le retour arrière de la base de données** est le vrai point dur : une migration qui a supprimé une colonne ne se défait pas en redéployant l'ancienne image. Deux réflexes : écrire des migrations **réversibles** (chaque `Up` a son `Down`), et procéder par **étapes compatibles** — ajouter la nouvelle colonne, déployer le code qui sait lire les deux formes, migrer les données, puis seulement supprimer l'ancienne colonne dans une version ultérieure.

---

### 17.7 Documenter le déploiement

Le référentiel demande de **préparer et documenter** le déploiement. La documentation est un livrable du bloc 3, au même titre que le pipeline.

| Document | Destinataire | Contenu |
| --- | --- | --- |
| **Manuel de déploiement** | Celui qui déploie | Prérequis, variables d'environnement attendues, commandes exactes, procédure de retour arrière |
| **Documentation technique** | Le développeur qui reprend le projet | Architecture, schéma de base de données, dépendances, choix techniques et leurs raisons |
| **Documentation d'API** | Le développeur front, l'intégrateur | Endpoints, formats, codes d'erreur — générée par Swagger/OpenAPI |
| **Manuel utilisateur** | L'utilisateur final | Comment se connecter, déposer une demande, la suivre |
| **Notes de version** | Tout le monde | Ce qui change dans cette version, ce qui casse |

**Le versionnement sémantique (SemVer)** donne une version qui porte du sens :

```
        MAJEUR . MINEUR . CORRECTIF
           2   .   4    .    1
           │       │         └── correction de bug, compatible
           │       └──────────── nouvelle fonctionnalité, compatible
           └──────────────────── changement incompatible (rupture d'API)
```

| Passage | Quand | Exemple sur CongeApp |
| --- | --- | --- |
| `1.4.0` → `1.4.1` | Correction sans changement d'usage | Le calcul du solde arrondissait mal |
| `1.4.1` → `1.5.0` | Ajout rétrocompatible | Nouvel endpoint d'export PDF |
| `1.5.0` → `2.0.0` | Rupture | `GET /api/demandes` renvoie désormais un objet paginé au lieu d'un tableau |

Les versions se posent en **tags Git annotés** (`git tag -a v1.5.0 -m "Export PDF"`), et servent de tag d'image Docker. Combinées aux Conventional Commits vus au chapitre Git, elles permettent de générer les notes de version automatiquement.

---

### 17.8 Checklist de mise en production

| Étape | Vérifié ? |
| --- | --- |
| HTTPS configuré, redirection HTTP → HTTPS | ✅ |
| Certificat TLS valide et renouvellement auto | ✅ |
| Pare-feu actif, seuls les ports nécessaires ouverts | ✅ |
| Authentification SSH par clé, root désactivé | ✅ |
| fail2ban installé et actif | ✅ |
| `.env` avec droits 600, non commité dans Git | ✅ |
| Mode debug désactivé, pas de stack trace en prod | ✅ |
| BDD non exposée sur Internet (pas de `ports:` dans compose) | ✅ |
| Sauvegardes automatiques configurées | ✅ |
| Monitoring et alertes en place | ✅ |

---

> **🔒 Sécurité**
>
> - **HTTPS partout** — redirection automatique de HTTP vers HTTPS, en-têtes `HSTS`, `X-Content-Type-Options`, `Content-Security-Policy`.
> - **La BDD n'écoute que sur le réseau interne Docker** — jamais exposée sur Internet.
> - **Sauvegardes régulières et testées** : une sauvegarde qu'on n'a jamais restaurée n'existe pas.
> - **Désactiver les modes debug et les pages d'erreur détaillées** en production (pas de stack trace visible par l'utilisateur).
> - **Principe du moindre privilège** : un utilisateur dédié au déploiement, pas root pour tout.
