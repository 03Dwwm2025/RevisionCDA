## Le cycle de vie d'un logiciel

Avant de coder, il faut comprendre le contexte de production d'un logiciel. Un projet passe toujours par les mêmes grandes phases, même si leur enchaînement varie selon la méthode choisie.

### Les phases du cycle de vie

| Phase | Ce qu'on fait |
| --- | --- |
| **Expression des besoins** | Recueillir et formaliser ce que le client veut |
| **Analyse & Conception** | Modéliser les données, l'architecture, les interfaces |
| **Développement** | Écrire le code |
| **Tests** | Vérifier que le logiciel fait bien ce qui est attendu |
| **Déploiement** | Mettre l'application en production |
| **Maintenance** | Corriger les bugs, faire évoluer, surveiller |

---

### Cycle en cascade (Waterfall)

Les étapes s'enchaînent **linéairement et séquentiellement** : on ne passe à la suivante que quand la précédente est terminée et validée.

```
Besoins → Conception → Développement → Tests → Déploiement → Maintenance
```

**Avantages :** simple à planifier, documentation claire, bon pour les projets aux besoins stables et bien définis.

**Inconvénients :** très rigide. Si une erreur est détectée en phase de test, il faut remonter à la conception. Le client ne voit le produit qu'à la fin.

> **📌 Règle clé :** le coût de correction d'un défaut **augmente exponentiellement** avec le temps. Un bug trouvé en conception coûte 10× moins cher qu'un bug trouvé en production.

---

### Méthodes agiles

Les méthodes agiles découpent le projet en **itérations courtes** (appelées *sprints*) de 1 à 4 semaines. À la fin de chaque sprint, on livre un incrément fonctionnel : une version partielle mais utilisable du produit.

**Valeurs fondamentales de l'Agile :**
- Les individus et leurs interactions avant les processus et les outils
- Un logiciel fonctionnel avant une documentation exhaustive
- La collaboration avec le client avant la négociation contractuelle
- L'adaptation au changement avant le respect d'un plan

**Avantages :** le client voit le produit tôt et régulièrement, on s'adapte aux changements, les problèmes remontent vite.

---

### Scrum — le framework agile le plus répandu

**Les rôles :**

| Rôle | Responsabilité |
| --- | --- |
| **Product Owner (PO)** | Porte la vision du produit, priorise le *backlog*, représente le client |
| **Scrum Master** | Facilite les cérémonies, lève les obstacles, garant de la méthode |
| **Équipe de développement** | Développeurs, designers, testeurs — auto-organisés |

**Le backlog :** liste priorisée de toutes les fonctionnalités à développer (sous forme de *user stories*). Le PO en est responsable.

**Les cérémonies Scrum :**

| Cérémonie | Fréquence | But |
| --- | --- | --- |
| **Sprint Planning** | Début de sprint | Choisir les stories à réaliser, estimer la charge |
| **Daily Scrum** | Chaque jour (15 min) | Synchroniser l'équipe : « Qu'est-ce que j'ai fait ? Que vais-je faire ? Blocages ? » |
| **Sprint Review** | Fin de sprint | Démo au client, recueillir son feedback |
| **Rétrospective** | Fin de sprint | Identifier ce qui a bien/mal fonctionné, s'améliorer continuellement |

---

### Kanban

Kanban est une autre méthode agile, plus souple que Scrum : pas de sprints, pas de rôles figés. Le travail avance en flux continu à travers des colonnes visualisées sur un **tableau Kanban**.

```
┌──────────┬──────────────┬──────────────┬──────────┐
│  Backlog │   À faire    │  En cours    │  Terminé │
├──────────┼──────────────┼──────────────┼──────────┤
│ Story A  │   Story C    │   Story E    │ Story F  │
│ Story B  │   Story D    │              │ Story G  │
└──────────┴──────────────┴──────────────┴──────────┘
```

**Limite du WIP** (*Work In Progress*) : on fixe un nombre maximum de tâches simultanées par colonne pour éviter la surcharge.

---

### Waterfall vs Agile — en résumé

| Critère | Waterfall | Agile |
| --- | --- | --- |
| Planification | Complète en début | Itérative |
| Livraison | En fin de projet | Régulière (chaque sprint) |
| Adaptabilité | Faible | Forte |
| Implication client | En début et fin | Continue |
| Idéal pour | Besoins stables, projets réglementés | Besoins évolutifs, projets innovants |
