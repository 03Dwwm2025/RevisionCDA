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

### Estimer et suivre l'avancement

**Pourquoi on n'estime pas en heures.** Un développeur expérimenté et un débutant ne mettent pas le même temps sur la même tâche, mais ils s'accordent en général sur le fait qu'elle est *deux fois plus grosse* que la précédente. On estime donc une **taille relative**, pas une durée.

**Les points de complexité (*story points*)** mesurent l'effort en tenant compte de trois choses à la fois : le volume de travail, la complexité technique et l'incertitude. On utilise souvent une suite de Fibonacci (1, 2, 3, 5, 8, 13) — l'écart qui grandit traduit le fait qu'une grosse story est aussi une story mal connue.

| Story | Points | Pourquoi |
| --- | --- | --- |
| Ajouter un champ « motif » au formulaire | 1 | Connu, isolé, sans règle métier |
| Déposer une demande avec contrôle du solde | 5 | Plusieurs couches, règles métier, cas d'erreur |
| Export PDF du planning d'équipe | 8 | Nouvelle bibliothèque, mise en page, incertitude |

**Le planning poker** est la technique d'estimation collective : chacun choisit sa carte en secret, on révèle en même temps. Les écarts sont le vrai produit de l'exercice — quand l'un dit 2 et l'autre 13, c'est qu'ils n'ont pas compris la même chose, et la discussion vaut plus que le chiffre final.

**La vélocité** est le nombre de points réellement terminés par sprint. Après trois ou quatre sprints, elle devient un outil de prévision : une équipe à 30 points par sprint et un reste-à-faire de 120 points a encore quatre sprints devant elle. La vélocité sert à **prévoir**, pas à comparer des équipes entre elles ni à évaluer les personnes — dès qu'elle devient un objectif, elle est gonflée et perd sa valeur.

**Le graphe d'avancement (*burndown chart*)** montre le reste-à-faire jour après jour :

```
points
restants
  40 │●
     │  ╲ ● ← courbe réelle : au-dessus de l'idéale = on est en retard
  30 │    ╲  ●
     │ ╲    ╲
  20 │   ╲    ●●
     │     ╲     ╲
  10 │       ╲     ●
     │         ╲     ╲●
   0 └────────────────────► jours du sprint
     J1                J10
        ╲ = trajectoire idéale
```

Un palier horizontal signale une tâche bloquée ; une chute brutale le dernier jour signale que « terminé » a été déclaré trop tard, et donc que le travail n'était pas découpé assez fin.

**La définition de terminé (*Definition of Done*)** est la liste de conditions qu'une story doit remplir pour être considérée comme faite. Elle est commune à toute l'équipe et écrite une fois pour toutes :

- le code est revu et fusionné dans `main` ;
- les tests unitaires sont écrits et la CI est verte ;
- les critères d'acceptation de la story sont vérifiés ;
- la documentation est à jour ;
- la fonctionnalité est déployée en préproduction.

Sans elle, « terminé » veut dire « ça marche sur ma machine » — et la dette s'accumule sprint après sprint.

---

### Waterfall vs Agile — en résumé

| Critère | Waterfall | Agile |
| --- | --- | --- |
| Planification | Complète en début | Itérative |
| Livraison | En fin de projet | Régulière (chaque sprint) |
| Adaptabilité | Faible | Forte |
| Implication client | En début et fin | Continue |
| Idéal pour | Besoins stables, projets réglementés | Besoins évolutifs, projets innovants |
