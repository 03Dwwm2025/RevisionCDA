## 18. La supervision et la maintenance

Déployer n'est pas la fin : il faut surveiller, maintenir et être capable de restaurer le service après un incident. Un système non supervisé, c'est un système dont on découvre les pannes par les plaintes des utilisateurs.

### 18.1 Les logs applicatifs

Les logs enregistrent les événements significatifs de l'application : requêtes, erreurs, actions utilisateur.

**Niveaux de log (du moins au plus grave) :**

| Niveau | Usage | Exemple |
| --- | --- | --- |
| `Debug` | Détails fins — uniquement en développement | "Connexion BDD ouverte sur le port 5432" |
| `Information` | Événements normaux du flux | "Dépôt de demande par salarié 42" |
| `Warning` | Situation anormale mais non bloquante | "Tentative de connexion échouée pour user@mail.fr" |
| `Error` | Erreur qui a empêché une opération | "Timeout SQL sur GetParSalarie() après 30s" |
| `Critical` | Défaillance système — app inutilisable | "Base de données inaccessible, toutes les requêtes échouent" |

```javascript
// Journal structuré : le message reste fixe, les valeurs sont des champs à part.
// C'est ce qui rend les journaux filtrables et agrégeables par un outil.
logger.info('Dépôt de demande',  { idSalarie, debut, fin });
logger.warn('Dates incohérentes', { idSalarie });
logger.error('Échec de l’insertion en base', { idSalarie, erreur: err.message });
```

> **Message fixe, données à part.** Écrire `` logger.info(`Dépôt par ${idSalarie}`) `` produit un message différent à chaque appel : impossible de compter les dépôts ou de filtrer dessus. En séparant le libellé des valeurs, l'outil de supervision peut regrouper, compter et alerter. Toutes les bibliothèques sérieuses fonctionnent ainsi.

**Ce qu'il ne faut JAMAIS logger :**
- Mots de passe ou tokens JWT — même hachés
- Données personnelles sensibles (numéro de sécurité sociale, données de santé)
- Numéros de carte bancaire

---

### 18.2 Le monitoring et les alertes

Le monitoring surveille l'état de l'application en **temps réel** et déclenche des alertes quand quelque chose se passe mal.

**Métriques à surveiller et seuils d'alerte recommandés :**

| Métrique | Seuil d'alerte | Ce que ça révèle |
| --- | --- | --- |
| **Disponibilité** (uptime) | < 99 % | L'application répond-elle ? |
| **Temps de réponse** (p95) | > 500 ms | Les pages sont-elles lentes ? |
| **Taux d'erreur 5xx** | > 1 % des requêtes | Y a-t-il des bugs en production ? |
| **CPU** | > 80 % soutenu | Le serveur est-il saturé ? |
| **RAM** | > 85 % utilisée | Risque de saturation mémoire |
| **Espace disque** | > 80 % rempli | Le disque va-t-il se remplir ? |
| **Erreurs 401/403** | Pic inhabituel | Tentative d'intrusion ? |

> *p95 (95e percentile) = le temps de réponse que 95 % des requêtes ne dépassent pas. Mieux que la moyenne : il capte les lenteurs ressenties par les utilisateurs, que la moyenne dilue.*

**Stack de monitoring open-source :**

```
Application → expose /metrics → Prometheus (collecte) → Grafana (visualisation + alertes)
                                                      → Alertmanager → e-mail / Slack
```

- **Prometheus** collecte les métriques toutes les X secondes (scrape)
- **Grafana** les affiche sur des dashboards et envoie des alertes si un seuil est dépassé
- **Uptime Kuma** : outil léger pour surveiller la disponibilité HTTP (ping toutes les 60s, alerte si down) — parfait pour débuter sur un VPS

```yaml
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
# Sauvegarde automatique d'une base PostgreSQL (cron quotidien à 2h du matin)
# 0 2 * * * = "à 02:00 tous les jours"
0 2 * * * pg_dump -U app congeapp | gzip > /backups/congeapp_$(date +%Y%m%d).sql.gz

# Rotation : garder 30 jours, supprimer les plus anciens
0 3 * * * find /backups -name "*.sql.gz" -mtime +30 -delete
```

**⚠️ Une sauvegarde non testée n'est pas une sauvegarde.**

```bash
# Test de restauration — à faire régulièrement sur un environnement isolé
gunzip -c /backups/congeapp_20260601.sql.gz | psql -U app congeapp_test
# Vérifier que les données sont bien là :
psql -U app congeapp_test -c "SELECT COUNT(*) FROM Demande;"
```

---

### 18.4 RTO et RPO

| Acronyme | Définition | Exemple concret |
| --- | --- | --- |
| **RTO** (Recovery Time Objective) | Durée maximale d'interruption tolérée | "Le service doit être remis en marche en moins de 4 heures" |
| **RPO** (Recovery Point Objective) | Perte de données maximale tolérée | "On accepte de perdre au maximum 1 heure de données" |

Le RPO détermine la fréquence des sauvegardes : RPO = 1h → sauvegarder toutes les heures.

---

### 18.5 PRA et PCA

| | **PRA** (Plan de Reprise d'Activité) | **PCA** (Plan de Continuité d'Activité) |
| --- | --- | --- |
| **Objectif** | Reprendre après une interruption | Maintenir un service minimal sans interruption |
| **Approche** | Restaurer depuis les sauvegardes | Redondance (multi-serveurs, failover automatique) |
| **Coût** | Plus faible | Plus élevé |
| **RTO typique** | Heures à jours | Secondes à minutes |
| **Adapté à** | PME, projets personnels | Applications critiques (banque, santé) |

---

### 18.6 Répondre à un incident

```
1. DÉTECTER     → alerte monitoring, remontée utilisateur, pic d'erreurs
2. ÉVALUER      → quelle sévérité ? combien d'utilisateurs impactés ?
3. MITIGER      → rollback vers la version précédente ? coupure partielle ?
4. DIAGNOSTIQUER → logs, métriques, git log depuis le dernier déploiement
5. CORRIGER     → fix + tests + redéploiement
6. POST-MORTEM  → documenter pour ne pas reproduire
```

**Le post-mortem sans blâme (*blameless post-mortem*) :**

L'objectif est d'apprendre et d'améliorer les processus, pas de punir. Un bon post-mortem contient :

| Section | Contenu |
| --- | --- |
| **Résumé** | En 2-3 phrases : quoi, quand, impact |
| **Chronologie** | Heure par heure : détection → résolution |
| **Cause racine** | Pourquoi c'est arrivé (technique + processus) |
| **Impact** | Durée, nombre d'utilisateurs affectés, données perdues |
| **Actions correctives** | Ce qu'on va faire pour éviter la récidive (avec responsable et date) |

---

### 18.7 Les quatre types de maintenance

Une fois l'application en production, le travail continue. On classe la maintenance en quatre catégories — c'est une question de cours classique.

| Type | Déclencheur | Exemple sur CongeApp | Part typique du budget |
| --- | --- | --- | --- |
| **Corrective** | Un défaut constaté | Le solde s'affiche en négatif après une annulation | ~20 % |
| **Évolutive** | Un nouveau besoin métier | Ajouter l'export du planning en PDF | ~50 % |
| **Adaptative** | Un changement dans l'environnement technique ou légal | Migrer vers une nouvelle version majeure du langage, se mettre en conformité avec une nouvelle règle RGPD | ~20 % |
| **Préventive** | Anticiper une panne avant qu'elle arrive | Ajouter un index avant que la table ne devienne trop lente, purger les journaux avant saturation du disque | ~10 % |

Deux points que le jury aime entendre :

- **La maintenance coûte plus cher que le développement initial.** Sur la durée de vie d'une application, l'écriture de la première version est minoritaire dans le coût total. C'est l'argument économique derrière le code propre, les tests et la documentation : ils ne servent pas à celui qui écrit, ils servent à celui qui maintient — souvent la même personne, six mois plus tard.
- **La dette technique** est le coût différé d'un raccourci pris aujourd'hui. Elle n'est pas honteuse tant qu'elle est **consciente et tracée** : on note ce qu'on a bâclé et pourquoi. Elle devient dangereuse quand personne ne sait plus où elle est.

**La maintenance corrective en pratique — le suivi d'anomalie :**

| Champ | Contenu |
| --- | --- |
| Sévérité | Bloquante / majeure / mineure / cosmétique |
| Environnement | Production, navigateur, version |
| Étapes de reproduction | Numérotées, reproductibles par un tiers |
| Comportement attendu / observé | Les deux, côte à côte |
| Correction | Le commit et la version qui corrigent |

Une anomalie corrigée devrait donner un **test de non-régression** : le bug est d'abord reproduit par un test qui échoue, puis le correctif fait passer ce test. C'est ce qui garantit qu'il ne reviendra pas.

---

> **🔒 Sécurité**
>
> - **OWASP A09** : l'absence de logs des événements de sécurité empêche de détecter une attaque en cours.
> - **Alerter sur les pics 401/403** : plusieurs centaines en quelques minutes = probable tentative d'attaque.
> - **Chiffrer les sauvegardes** : une sauvegarde volée est une fuite de données complète.
> - **Veille CVE** : activer Dependabot sur GitHub pour être alerté des dépendances vulnérables.
