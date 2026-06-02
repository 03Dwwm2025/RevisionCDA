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

### 17.5 Checklist de mise en production

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
