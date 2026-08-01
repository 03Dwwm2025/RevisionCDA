## Annexe B — Glossaire express

**Conception et gestion de projet**

| Terme | Définition courte |
| --- | --- |
| Backlog | Liste priorisée des fonctionnalités à développer, tenue par le Product Owner |
| Cahier des charges | Document contractuel qui formalise les besoins, les contraintes et les critères de recette |
| Definition of Done | Liste des conditions à remplir pour qu'une story soit considérée terminée |
| MCD / MLD / MPD | Modèle Conceptuel / Logique / Physique de Données (Merise) |
| MoSCoW | Priorisation : Must, Should, Could, Won't have |
| MVP | Produit minimum viable — la version la plus réduite qui apporte déjà de la valeur |
| Point de complexité | Unité d'estimation relative d'une user story (suite de Fibonacci) |
| Règle de gestion | Contrainte métier exprimée en une phrase, traduite ensuite en contrainte ou en code |
| UML | Langage de modélisation objet : cas d'utilisation, classes, séquence, activité, états-transitions |
| User story | Besoin exprimé sous la forme « En tant que… je veux… afin de… » |
| Vélocité | Nombre de points réellement terminés par sprint, utilisé pour prévoir |

**Données**

| Terme | Définition courte |
| --- | --- |
| ACID | Atomicité, Cohérence, **Isolation**, Durabilité — propriétés des transactions |
| BASE | Basically Available, Soft state, Eventually consistent — le compromis des bases distribuées |
| CAP (théorème) | Un système distribué choisit deux propriétés sur trois : cohérence, disponibilité, tolérance au partitionnement |
| DDL / DML / DCL / TCL | Sous-langages SQL : structure / données / droits / transactions |
| Index | Structure qui accélère les lectures et ralentit les écritures |
| Normalisation | Organisation des tables en 1NF, 2NF, 3NF pour supprimer la redondance |
| NoSQL | Bases non relationnelles : document, clé-valeur, colonnes, graphe |
| ORM | Object-Relational Mapping — pont entre objets et tables (Entity Framework Core) |
| Procédure stockée | Bloc SQL nommé, enregistré et exécutable dans la base |
| Trigger | Bloc SQL déclenché automatiquement par un INSERT, UPDATE ou DELETE |
| Vue | Requête stockée, interrogeable comme une table |

**Développement**

| Terme | Définition courte |
| --- | --- |
| API REST | Interface exposant des ressources via HTTP et JSON |
| Composition | Relation « a un » entre objets — à préférer à l'héritage |
| DTO | Data Transfer Object — objet de transport des données entre couches |
| Injection de dépendances | Fournir ses dépendances à un objet plutôt que de le laisser les créer |
| Idempotent | Une opération qui, répétée, produit le même état (GET, PUT, DELETE) |
| Patron de conception | Solution éprouvée à un problème de conception récurrent (Singleton, Factory, Strategy) |
| POO | Programmation Orientée Objet : encapsulation, héritage, polymorphisme, abstraction |
| Repository | Couche qui isole l'accès aux données du reste de l'application |
| SOLID | Cinq principes de conception objet |
| Type valeur / référence | La variable contient la valeur / l'adresse de l'objet |

**Tests**

| Terme | Définition courte |
| --- | --- |
| Cahier de recettes | Liste des scénarios fonctionnels à dérouler avec le client |
| Couverture de code | Pourcentage de lignes exécutées pendant les tests |
| Jeu d'essai | Lot de données préparé pour exécuter les tests : cas normaux, limites, erreurs |
| Mock / Stub / Fake | Doublures de test : vérifie les appels / renvoie une valeur / implémentation simplifiée |
| Non-régression | Rejeu des tests existants pour vérifier qu'une évolution n'a rien cassé |
| TDD | Test-Driven Development — le test d'abord, le code ensuite |

**Sécurité**

| Terme | Définition courte |
| --- | --- |
| CIA | Confidentialité, Intégrité, Disponibilité — la triade de la sécurité |
| CSRF | Falsification de requête : le navigateur de la victime envoie une action légitime à son insu |
| CVE | Identifiant public d'une vulnérabilité connue |
| Chiffrement | Transformation réversible avec une clé (symétrique : AES ; asymétrique : RSA) |
| Hachage | Transformation irréversible, utilisée pour les mots de passe (bcrypt, Argon2) |
| JWT | JSON Web Token — jeton signé, dont le contenu est encodé mais pas chiffré |
| OWASP | Organisation de référence sur la sécurité applicative (Top 10) |
| RGPD | Règlement européen sur la protection des données personnelles |
| SAST / DAST | Analyse de sécurité du code source / de l'application en fonctionnement |
| XSS | Injection de script exécuté par le navigateur d'une autre victime |

**Déploiement et exploitation**

| Terme | Définition courte |
| --- | --- |
| Blue-green | Deux environnements complets ; la mise en production est une bascule de trafic |
| CI / CD | Intégration continue / livraison ou déploiement continus |
| Conteneur | Instance en cours d'exécution d'une image, isolée mais partageant le noyau de l'hôte |
| Image | Modèle en lecture seule décrivant le système de fichiers d'un conteneur |
| Maintenance | Corrective, évolutive, adaptative, préventive |
| Reverse proxy | Serveur en frontal qui reçoit les requêtes publiques et les distribue en interne (Nginx) |
| RTO / RPO | Durée d'interruption tolérée / perte de données tolérée |
| PRA / PCA | Plan de reprise / de continuité d'activité |
| SemVer | Versionnement sémantique MAJEUR.MINEUR.CORRECTIF |
| VPS | Serveur virtuel privé d'hébergement |
