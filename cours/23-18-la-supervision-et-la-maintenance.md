## 18. La supervision et la maintenance

Déployer n'est pas la fin : il faut surveiller, maintenir et être capable de restaurer le service après un incident.

### 18.1 Les logs applicatifs

Les logs enregistrent les événements significatifs de l'application : requêtes, erreurs, actions utilisateur.

**Niveaux de log (du moins au plus grave) :**

| Niveau | Usage |
| --- | --- |
| `Debug` | Informations détaillées pour le développement |
| `Information` | Événements normaux (connexion, dépôt de demande) |
| `Warning` | Situation anormale mais non bloquante |
| `Error` | Erreur qui a empêché une opération |
| `Critical` | Défaillance système (app inutilisable) |

```csharp
// ASP.NET Core — injection du logger
public class ServiceConges
{
    private readonly ILogger<ServiceConges> _logger;

    public Resultat Deposer(int idSalarie, DateOnly debut, DateOnly fin)
    {
        _logger.LogInformation("Dépôt demande par salarié {Id} du {Debut} au {Fin}",
            idSalarie, debut, fin);

        if (fin < debut)
        {
            _logger.LogWarning("Dates incohérentes pour salarié {Id}", idSalarie);
            return Resultat.Erreur("Dates incohérentes.");
        }
        // ...
    }
}
```

**Ce qu'il ne faut JAMAIS logger :**
- Mots de passe, tokens JWT, clés API
- Données personnelles sensibles (numéro de sécurité sociale, données de santé)
- Numéros de carte bancaire

---

### 18.2 Le monitoring

Le monitoring surveille l'état de l'application en **temps réel** et déclenche des alertes quand quelque chose se passe mal.

**Métriques à surveiller :**

| Métrique | Ce que ça révèle |
| --- | --- |
| **Disponibilité** (uptime) | L'app répond-elle aux requêtes ? |
| **Temps de réponse** (p95, p99) | Les pages sont-elles lentes ? |
| **Taux d'erreur** (4xx, 5xx) | Y a-t-il des erreurs en production ? |
| **CPU / RAM** | Les ressources sont-elles saturées ? |
| **Espace disque** | Le disque va-t-il se remplir ? |

**Stack de monitoring open-source :**

```
Application → expose /metrics → Prometheus (collecte) → Grafana (visualisation)
                                                      → Alertmanager → e-mail / Slack
```

**Uptime Kuma** : outil léger pour surveiller la disponibilité HTTP (ping toutes les 60s, alerte si down). Parfait pour un VPS personnel.

```yaml
# docker-compose pour Uptime Kuma
services:
  uptime-kuma:
    image: louislam/uptime-kuma:1
    volumes:
      - uptime-kuma-data:/app/data
    ports:
      - "3001:3001"
    restart: unless-stopped
```

---

### 18.3 Les sauvegardes

**Règle 3-2-1 :**
- **3** copies des données
- Sur **2** supports différents
- Dont **1** hors site (cloud, autre datacenter)

```bash
# Sauvegarde automatique d'une base PostgreSQL (cron quotidien)
0 2 * * * pg_dump -U app congeapp | gzip > /backups/congeapp_$(date +%Y%m%d).sql.gz

# Rotation : garder 30 jours
0 3 * * * find /backups -name "*.sql.gz" -mtime +30 -delete
```

**⚠️ Une sauvegarde non testée n'est pas une sauvegarde.** Tester régulièrement la restauration en environnement isolé.

```bash
# Test de restauration (sur un environnement de test, jamais en prod)
gunzip -c /backups/congeapp_20260601.sql.gz | psql -U app congeapp_test
```

---

### 18.4 RTO et RPO — les deux objectifs clés

| Acronyme | Définition | Exemple |
| --- | --- | --- |
| **RTO** (Recovery Time Objective) | Durée maximale d'interruption tolérée | "Le service doit être remis en marche en < 4h" |
| **RPO** (Recovery Point Objective) | Perte de données maximale tolérée | "On accepte de perdre au maximum 1h de données" |

Le RPO définit la fréquence des sauvegardes : si RPO = 1h, une sauvegarde toutes les heures est nécessaire.

---

### 18.5 PRA et PCA

| | **PRA** (Plan de Reprise d'Activité) | **PCA** (Plan de Continuité d'Activité) |
| --- | --- | --- |
| **Objectif** | Reprendre après une interruption | Maintenir une activité minimale sans interruption |
| **Approche** | Restaurer depuis les sauvegardes | Redondance (multi-serveurs, failover automatique) |
| **Coût** | Plus faible | Plus élevé |
| **RTO** | Heures à jours | Secondes à minutes |

Pour un projet personnel ou une PME, le PRA est souvent suffisant. Le PCA est pour les applications critiques (banque, santé, e-commerce à fort volume).

---

### 18.6 Répondre à un incident

```
1. DÉTECTER    → alerte monitoring ou remontée utilisateur
2. ÉVALUER     → sévérité ? combien d'utilisateurs impactés ?
3. MITIGER     → rollback ? coupure partielle ? cache activé ?
4. DIAGNOSTIQUER → logs, métriques, git log depuis le dernier déploiement
5. CORRIGER    → fix + redéploiement
6. POST-MORTEM → documenter cause, chronologie, actions préventives
```

Le **post-mortem sans blâme** (*blameless post-mortem*) : l'objectif est d'apprendre et d'améliorer les processus, pas de punir. Les systèmes complexes tombent — l'important est de réduire la probabilité et l'impact.

---

> **🔒 Sécurité**
>
> - **OWASP A09 — Logging & Monitoring Failures** : l'absence de logs des événements de sécurité (connexions échouées, accès refusés) empêche de détecter une attaque en cours.
> - Alerter sur les **pics d'erreurs 401/403** : ils peuvent signaler une tentative d'intrusion.
> - **Chiffrer les sauvegardes** et les stocker hors site — une sauvegarde volée est une fuite de données.
> - Veille sur les **CVE** : abonner le repo à Dependabot ou consulter régulièrement les bulletins de sécurité des composants utilisés.
