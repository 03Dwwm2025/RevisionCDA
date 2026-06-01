# ANNEXES

## Annexe A — La sécurité à chaque étape (récapitulatif)

Le tableau de synthèse du *Security by Design* : la sécurité n'est pas une étape, c'est une dimension présente partout.

| Étape | Réflexe sécurité essentiel |
| --- | --- |
| Analyse | Identifier données sensibles, RGPD, rôles & habilitations, minimisation |
| Modélisation | Contraintes d'intégrité, pas de mot de passe en clair, chiffrement at rest |
| Maquettage | Messages d'erreur génériques, écrans 2FA/consentement, accessibilité |
| Architecture | Défense en profondeur, validation à chaque couche, moindre privilège |
| Développement | OWASP Top 10, requêtes paramétrées, hash des mots de passe, validation serveur |
| API | AuthN/AuthZ (JWT, rôles), CORS, rate limiting, HTTPS |
| Front-end | Anti-XSS/CSRF, CSP, jamais de confiance au client |
| Git | Aucun secret versionné, .gitignore, scan de secrets, revue de code |
| Tests | Tests de sécurité, SAST/DAST, scan des dépendances |
| Docker | Non-root, images minimales scannées, secrets hors images, tags précis |
| CI/CD | Secrets chiffrés, DevSecOps, intégrité de la chaîne, moindre privilège |
| Production | HTTPS + en-têtes, BDD non exposée, sauvegardes testées, durcissement serveur |
| Supervision | Logs de sécurité, alertes, veille CVE, tests de restauration |
