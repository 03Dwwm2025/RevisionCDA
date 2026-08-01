# ANNEXES

## Annexe A — La sécurité à chaque étape (récapitulatif)

Le tableau de synthèse du *Security by Design* : la sécurité n'est pas une étape, c'est une dimension présente partout.

| Étape | Réflexe sécurité essentiel |
| --- | --- |
| Environnement | Aucun secret versionné, dépendances vérifiées et verrouillées, mises à jour suivies |
| Analyse | Identifier données sensibles, RGPD, rôles & habilitations, minimisation |
| Modélisation | Contraintes d'intégrité, pas de mot de passe en clair, chiffrement au repos |
| Maquettage | Messages d'erreur génériques, écrans 2FA/consentement, accessibilité |
| Architecture | Défense en profondeur, validation à chaque couche, moindre privilège |
| Développement | OWASP Top 10, requêtes paramétrées, hachage des mots de passe, validation serveur |
| Base de données | Comptes SQL au moindre privilège (DCL), suppression logique plutôt que CASCADE sur les données à valeur légale |
| API | AuthN/AuthZ (JWT, rôles), CORS strict, limitation de débit, pagination bornée, HTTPS |
| Front-end | Anti-XSS (échappement en sortie), anti-CSRF (`SameSite` + jeton), CSP, aucune confiance au client |
| Git | Aucun secret versionné, .gitignore, scan de secrets, revue de code |
| Tests | Jeu d'essai avec données hostiles, tests d'autorisation, SAST/DAST, scan des dépendances |
| Docker | Non-root, images minimales scannées, `.dockerignore`, secrets hors images, tags précis |
| CI/CD | Secrets chiffrés, DevSecOps, protection de `main`, intégrité de la chaîne |
| Production | HTTPS + en-têtes, BDD non exposée, données anonymisées en préproduction, durcissement serveur |
| Supervision | Logs de sécurité sans données sensibles, alertes sur pics 401/403, veille CVE, restaurations testées |
| Maintenance | Correctifs de sécurité appliqués, dette technique tracée, test de non-régression sur chaque correctif |
