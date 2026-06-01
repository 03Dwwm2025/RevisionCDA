## 14. Synthèse sécurité : l'OWASP Top 10

L'**OWASP Top 10** recense les risques de sécurité les plus critiques des applications web. C'est la référence à connaître. Voici l'édition 2021 :

| Rang | Risque | Parade principale |
| --- | --- | --- |
| A01 | Broken Access Control | Contrôler les autorisations côté serveur, à chaque accès |
| A02 | Cryptographic Failures | Chiffrer en transit (TLS) et au repos ; hacher les mots de passe |
| A03 | Injection (SQL, etc.) | Requêtes paramétrées / ORM, validation des entrées |
| A04 | Insecure Design | Sécurité dès la conception, modélisation des menaces |
| A05 | Security Misconfiguration | Durcir la config, désactiver le superflu, pas de défauts |
| A06 | Vulnerable Components | Mettre à jour les dépendances, scanner les CVE |
| A07 | Auth. Failures | MFA, anti-brute-force, gestion de session robuste |
| A08 | Software/Data Integrity | Vérifier l'intégrité (signatures), sécuriser la CI/CD |
| A09 | Logging & Monitoring Failures | Journaliser et superviser les événements de sécurité |
| A10 | SSRF | Valider/filtrer les URL appelées par le serveur |

### 14.1 Le cas des mots de passe

Un mot de passe ne se stocke **jamais** en clair, ni même chiffré (réversible). On stocke une **empreinte** (hash) calculée avec un algorithme **lent et salé**, conçu pour ça :

- **Bon** : Argon2 (recommandé), bcrypt, scrypt, PBKDF2 — avec un **sel** unique par utilisateur.
- **À bannir** : MD5, SHA-1 (trop rapides, cassables), ou pire le stockage en clair.

```
// Hachage avec BCrypt (.NET)
string hash = BCrypt.Net.BCrypt.HashPassword(motDePasse);
// ... stocker 'hash' en base ...
bool ok = BCrypt.Net.BCrypt.Verify(saisie, hashStocke);
```

> **📌 À retenir**
>
> Les trois piliers de la sécurité (triade **CIA**) : **Confidentialité** (seuls les autorisés accèdent), **Intégrité** (les données ne sont pas altérées), **Disponibilité** (le service reste accessible). Chaque mesure vise à renforcer l'un de ces trois axes.
