## 17. La mise en production

La production tourne sur un serveur accessible publiquement — typiquement un **VPS** (serveur virtuel privé, ex : ton hébergement Ubuntu chez Pulseheberg). Plusieurs briques l'entourent.

### 17.1 Le reverse proxy (Nginx)

**Nginx** se place devant l'application : il reçoit les requêtes du public et les **redirige** vers le bon conteneur. Il gère aussi le HTTPS, la compression, le cache et le *load balancing*.

```
server {
  listen 443 ssl;
  server_name v-oliver.fr;
  ssl_certificate     /etc/letsencrypt/live/v-oliver.fr/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/v-oliver.fr/privkey.pem;
  location / {
    proxy_pass http://app:3000;          # vers le conteneur
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

### 17.2 Nom de domaine, DNS et HTTPS

**DNS :** fait correspondre un nom de domaine (`v-oliver.fr`) à l'adresse IP du serveur via un enregistrement **A** (IPv4) ou **AAAA** (IPv6).

**HTTPS / TLS :** chiffre les échanges entre le navigateur et le serveur. Indispensable. **Let's Encrypt** fournit des certificats gratuits, renouvelés automatiquement (via Certbot).

```
# Obtenir et installer un certificat (renouvellement auto)
sudo certbot --nginx -d v-oliver.fr -d www.v-oliver.fr
```

### 17.3 Sécuriser le serveur

Un serveur exposé doit être **durci** dès l'installation :

- **Accès SSH par clé** (désactiver l'authentification par mot de passe et le login root direct).
- **Pare-feu** (`ufw`) : ne laisser ouverts que les ports nécessaires (22, 80, 443).
- **fail2ban** : bannit automatiquement les IP qui multiplient les tentatives de connexion.
- **Mises à jour** régulières du système (`apt update && apt upgrade`).
- **Moindre privilège** : un utilisateur dédié au déploiement, pas root pour tout.

```
sudo ufw default deny incoming
sudo ufw allow 22 && sudo ufw allow 80 && sudo ufw allow 443
sudo ufw enable
```

> **🔒 Sécurité**
>
> La mise en production est le moment où l'application devient une cible réelle.
> - **HTTPS partout**, redirection automatique de HTTP vers HTTPS, en-têtes de sécurité (`HSTS`, `X-Content-Type-Options`, `Content-Security-Policy`).
> - **La BDD n'est jamais exposée** sur Internet : elle n'écoute que sur le réseau interne Docker.
> - **Sauvegardes régulières et testées** (une sauvegarde qu'on n'a jamais restaurée n'existe pas) ; chiffrées et stockées hors site.
> - **Variables d'environnement** pour les secrets en prod, fichier `.env` à droits restreints (`chmod 600`), jamais versionné.
> - Désactiver les modes debug et les pages d'erreur détaillées en production.
