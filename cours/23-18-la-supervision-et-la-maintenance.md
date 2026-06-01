## 18. La supervision et la maintenance

Le déploiement n'est pas la fin : il faut surveiller et maintenir l'application en condition opérationnelle.

- **Logs** : centraliser et conserver les journaux applicatifs et système (sans y écrire de données sensibles).
- **Monitoring** : suivre la disponibilité, le CPU/RAM, les temps de réponse, les erreurs (Prometheus/Grafana, Uptime Kuma…) avec des **alertes**.
- **Sauvegardes** automatisées de la base et des volumes ; définir une politique de rétention.
- **Plan de reprise** : savoir restaurer le service après incident (PRA/PCA), avec un objectif de temps (RTO) et de perte de données (RPO).

> **🔒 Sécurité**
>
> - **Journalisation et supervision** des événements de sécurité (OWASP A09) : connexions échouées, accès refusés, erreurs anormales — pour détecter une attaque en cours.
> - Veille sur les **vulnérabilités** (CVE) des composants utilisés et application rapide des correctifs.
> - **Tests de restauration** réguliers : vérifier que les sauvegardes sont exploitables.
