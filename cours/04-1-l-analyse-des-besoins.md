## 1. L'analyse des besoins

Tout projet commence par la compréhension du **besoin réel** du client. C'est l'étape la plus critique : un logiciel techniquement parfait qui ne répond pas au vrai besoin est un échec. Et corriger une erreur d'analyse en fin de projet coûte 10× plus cher que de la corriger au début.

---

### 1.1 Besoins fonctionnels vs non-fonctionnels

On distingue deux grandes catégories de besoins :

| Type | Définition | Exemples CongeApp |
| --- | --- | --- |
| **Fonctionnel** | Ce que le système **doit faire** — les fonctionnalités visibles | « Un salarié peut déposer une demande », « Le manager valide ou refuse » |
| **Non-fonctionnel** | Les **contraintes de qualité** — comment le système doit se comporter | Performance (< 2s), disponibilité (99,9 %), sécurité, accessibilité, compatibilité navigateurs |

**Les besoins non-fonctionnels sont souvent négligés** alors qu'ils sont tout aussi importants. Une application correcte fonctionnellement mais qui répond en 30 secondes sera abandonnée. Elle doit aussi être sécurisée, accessible, maintenable.

Exemples de besoins non-fonctionnels à ne pas oublier :
- **Performance** : le chargement d'une page doit prendre moins de 2 secondes
- **Disponibilité** : l'application doit être accessible 99,9 % du temps (soit moins de 9h d'indisponibilité par an)
- **Sécurité** : les données personnelles doivent être chiffrées en transit (HTTPS)
- **Accessibilité** : l'interface doit respecter les critères WCAG niveau AA
- **Maintenabilité** : le code doit être testé et documenté pour faciliter les évolutions futures

---

### 1.2 Recueillir les besoins

Avant d'écrire une seule ligne de code, il faut **comprendre** le besoin. Plusieurs techniques permettent de le recueillir :

**Les entretiens :** discussions directes avec les futurs utilisateurs et le client. On pose des questions ouvertes pour comprendre leur quotidien, leurs frustrations avec l'outil actuel, ce qu'ils attendent.

```
Bonnes questions à poser :
→ "Comment gérez-vous les congés aujourd'hui ?"
→ "Qu'est-ce qui prend le plus de temps dans ce processus ?"
→ "Qu'est-ce qui vous frustre avec le système actuel ?"
→ "Dans un monde idéal, comment ça fonctionnerait ?"
```

**Les ateliers (*workshops*) :** réunions avec plusieurs parties prenantes en même temps pour confronter les points de vue, aligner les priorités et éviter les malentendus entre ce que veut la direction et ce que vivent les utilisateurs.

**L'observation :** regarder les utilisateurs travailler sans les interrompre. On découvre souvent des besoins non exprimés — les utilisateurs font tellement certaines choses par habitude qu'ils n'y pensent plus comme un besoin.

**L'existant :** analyser les outils actuels (Excel, e-mails, formulaires papier…). Ce qu'ils font avec leurs outils actuels, même imparfaitement, est un besoin réel.

**Les besoins implicites vs explicites :**

| Type | Définition | Exemple |
| --- | --- | --- |
| **Explicite** | Le client l'a dit clairement | « Je veux pouvoir déposer une demande de congé en ligne » |
| **Implicite** | Évident mais non dit | Que l'application soit sécurisée, que les données soient sauvegardées |
| **Latent** | Le client n'y a pas pensé mais en aura besoin | Un historique des demandes, une notification par e-mail |

Un bon analyste identifie les trois types, pas seulement ce qui est explicitement demandé.

---

### 1.3 Le cahier des charges

Le cahier des charges (CDC) est le document qui **formalise et consolide** tous les besoins recueillis. Il sert de **référence contractuelle** entre le client et l'équipe de développement — tout le monde s'y réfère en cas de désaccord.

**Ce qu'il contient :**

- Le **contexte** : qui est le client, quel est son métier, quel problème cherche-t-on à résoudre
- Les **objectifs** : ce qu'on veut obtenir à l'issue du projet
- Les **acteurs** : qui utilisera le système et avec quels droits
- Les **besoins fonctionnels** : la liste des fonctionnalités attendues
- Les **besoins non-fonctionnels** : contraintes de performance, sécurité, accessibilité…
- Les **contraintes techniques** : stack imposée, hébergement existant, intégrations
- Les **délais et jalons** : dates clés, phases de livraison
- Les **critères de recette** : comment on valide que le projet est terminé et conforme

Un CDC mal rédigé (ambigu, incomplet) est la première cause d'échec des projets informatiques.

---

### 1.4 Les user stories

En méthode agile, les besoins fonctionnels s'expriment sous forme de **user stories** — des récits courts centrés sur la valeur apportée à l'utilisateur, pas sur la technique.

**Format :**
```
En tant que <rôle>,
je veux <action>
afin de <bénéfice>.
```

Le "afin de" est essentiel : il justifie pourquoi la fonctionnalité a de la valeur. Sans lui, on peut coder quelque chose qui répond à la lettre mais pas à l'esprit du besoin.

**Exemples CongeApp :**

| ID | User story complète | Priorité |
| --- | --- | --- |
| US-01 | En tant que **salarié**, je veux **déposer une demande de congé** afin de **planifier mes absences** | Must |
| US-02 | En tant que **salarié**, je veux **consulter mon solde** afin de **savoir combien de jours il me reste** | Must |
| US-03 | En tant que **manager**, je veux **valider ou refuser une demande** afin de **gérer la disponibilité de mon équipe** | Must |
| US-04 | En tant que **salarié**, je veux **recevoir une notification** quand ma demande est traitée afin de **ne pas avoir à vérifier manuellement** | Should |
| US-05 | En tant qu'**admin RH**, je veux **exporter le planning** en PDF afin de **le partager en réunion** | Could |

---

### 1.5 Les critères d'acceptation

Chaque user story doit être accompagnée de **critères d'acceptation** (*acceptance criteria*) : des conditions précises et vérifiables qui définissent quand la story est considérée comme « terminée ».

Sans critères d'acceptation, "terminé" est subjectif — le développeur pense avoir fini, le client pense qu'il manque la moitié.

**Format courant — Given / When / Then :**

```
Given   (contexte initial)
When    (action effectuée)
Then    (résultat attendu)
```

**Exemple pour US-01 — Déposer une demande :**

```
✅ Critère 1 : saisie de base
Given   je suis connecté en tant que salarié
When    je soumets une demande du 01/07 au 15/07
Then    la demande apparaît dans mon historique avec le statut "En attente"
        ET un e-mail est envoyé au manager

✅ Critère 2 : dates incohérentes
Given   je suis connecté en tant que salarié
When    je soumets une demande avec une date de fin antérieure à la date de début
Then    le formulaire affiche un message d'erreur "La date de fin doit être après la date de début"
        ET aucune demande n'est créée

✅ Critère 3 : solde insuffisant
Given   mon solde est de 3 jours
When    je soumets une demande de 10 jours
Then    la demande est refusée avec le message "Solde insuffisant (3 jours disponibles)"

✅ Critère 4 : chevauchement
Given   j'ai déjà une demande acceptée du 10 au 20 juillet
When    je soumets une demande du 15 au 25 juillet
Then    la demande est refusée avec le message "Une demande existe déjà sur cette période"
```

Les critères d'acceptation servent aussi de base aux **tests** : chaque critère devient un test à automatiser.

---

### 1.6 La méthode MoSCoW — prioriser

Tout ne peut pas être développé en même temps ni avec la même urgence. MoSCoW est une méthode de priorisation des fonctionnalités avec le client.

| Catégorie | Signification | Exemple CongeApp |
| --- | --- | --- |
| **M**ust have | Indispensable — sans ça, le produit n'a pas de sens | Déposer et valider une demande |
| **S**hould have | Important mais contournable temporairement | Notification e-mail au manager |
| **C**ould have | Confort, si le temps le permet | Export PDF du planning |
| **W**on't have | Hors périmètre pour cette version | Application mobile native |

**Le MVP** (*Minimum Viable Product*) = les fonctionnalités Must have uniquement. C'est la version minimale mais utilisable qu'on livre en premier pour avoir du feedback réel.

**Pourquoi prioriser ?** Les projets dérapent rarement parce qu'on manque de bonnes idées — ils dérapent parce qu'on essaie de tout faire en même temps. Prioriser permet de livrer de la valeur tôt et de s'adapter au feedback plutôt que de découvrir en fin de projet que la moitié des fonctionnalités ne sont pas utiles.

---

### 1.7 Identifier les acteurs et les droits

L'analyse des besoins doit identifier précisément **qui** utilisera le système, **ce qu'il peut faire** et **ce qu'il ne peut pas faire**.

| Acteur | Actions autorisées | Actions interdites |
| --- | --- | --- |
| **Salarié** | Déposer une demande, voir son solde, voir son historique | Voir les demandes d'un collègue, valider des demandes |
| **Manager** | Valider/refuser les demandes de son équipe | Modifier le solde, accéder aux demandes d'autres équipes |
| **Admin RH** | Gérer les utilisateurs, les soldes, les règles métier | — |

Cette matrice est le point de départ du **contrôle d'accès** (RBAC — *Role-Based Access Control*) qui sera implémenté dans le code. La définir en amont évite les failles de sécurité par oubli.

---

> **🔒 Sécurité**
>
> La sécurité commence à l'analyse, pas après le développement.
> - **Identifier les données sensibles** dès l'expression du besoin : CongeApp manipule des données personnelles (identité, e-mail) relevant du **RGPD**.
> - **Privacy by design** (article 25 RGPD) : ne collecter que les données strictement nécessaires — chaque donnée non collectée est un risque en moins.
> - **Définir les rôles et interdictions explicitement** : "un salarié ne peut pas voir les demandes d'un collègue" doit apparaître dans le CDC, pas être découvert pendant les tests.
> - **Lister les exigences de sécurité non-fonctionnelles** : chiffrement en transit (HTTPS), authentification, traçabilité des actions, durée de conservation des données.
