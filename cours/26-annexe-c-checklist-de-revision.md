## Annexe C — Checklist de révision

À vérifier avant l'épreuve : sais-tu **expliquer chaque point, avec un exemple**, sans relire le cours ?

**Gestion de projet et analyse**

- [ ] Les phases du cycle de vie ; cascade et agile, avec les avantages de chaque approche.
- [ ] Scrum : les trois rôles, les quatre cérémonies, le backlog.
- [ ] Estimer en points, la vélocité, le graphe d'avancement, la définition de terminé.
- [ ] Besoin fonctionnel / non-fonctionnel ; besoin explicite, implicite, latent.
- [ ] User story, critères d'acceptation en Given/When/Then, MoSCoW, MVP.
- [ ] Rédiger une règle de gestion et dire où elle se traduit dans le code ou la base.

**Conception**

- [ ] Dictionnaire → MCD → normalisation → MLD → MPD, et les règles de passage.
- [ ] Les cardinalités Merise et le passage d'une association many-to-many en table de liaison.
- [ ] **Les trois formes normales** : « la clé, toute la clé, rien que la clé », avec un contre-exemple.
- [ ] Les cinq diagrammes UML utiles et leur famille (statique ou dynamique).
- [ ] `<<include>>` contre `<<extend>>` ; agrégation contre composition.
- [ ] Zoning, wireframe, mockup, prototype ; UI contre UX.
- [ ] Accessibilité RGAA/WCAG et éco-conception : deux gestes concrets pour chacune.

**Développement**

- [ ] Les quatre piliers de la POO, chacun avec un exemple de code.
- [ ] Les niveaux de visibilité et les membres statiques ; classe abstraite contre interface.
- [ ] Redéfinition contre masquage, et la liaison tardive ; copie de valeur contre copie de référence.
- [ ] Composition contre héritage, et le test « est un / a un ».
- [ ] Les cinq principes SOLID, chacun avec un contre-exemple.
- [ ] Les patrons de conception : Singleton, Factory, Strategy, Observer, Repository.
- [ ] Le rôle de chaque couche et le sens des dépendances ; l'injection de dépendances.
- [ ] Les requêtes SQL : jointures, `GROUP BY` contre `HAVING`, sous-requêtes, `ON DELETE CASCADE`.
- [ ] Les quatre familles NoSQL et le critère de choix entre relationnel et document.
- [ ] Les verbes HTTP, l'idempotence, les codes de statut, 401 contre 403.
- [ ] Pagination, versionnement d'API, session contre JWT, jeton de rafraîchissement.
- [ ] Validation côté serveur, middleware, gestion globale des erreurs, niveaux de log.

**Tests**

- [ ] La pyramide de tests et pourquoi on ne l'inverse pas.
- [ ] Le pattern AAA ; stub, mock et fake.
- [ ] Le cycle TDD et ce que la couverture de code ne dit pas.
- [ ] Plan de tests, cahier de recettes, jeu d'essai, non-régression.
- [ ] Construire un jeu d'essai complet : nominal, limite, erreur, interdit, hostile.

**Sécurité**

- [ ] La triade CIA et la défense en profondeur.
- [ ] L'OWASP Top 10, avec un exemple d'attaque et sa parade pour au moins cinq risques.
- [ ] Injection SQL et requêtes paramétrées.
- [ ] **XSS** : les trois types et les trois lignes de défense.
- [ ] **CSRF** : le mécanisme, et pourquoi `HttpOnly` n'y change rien.
- [ ] Encodage, chiffrement et hachage : les différences ; symétrique contre asymétrique.
- [ ] Le bon stockage d'un mot de passe, et pourquoi un algorithme lent est un avantage.
- [ ] RGPD : minimisation, durée de conservation, anonymisation avant la préproduction.

**Déploiement et exploitation**

- [ ] Git : `merge` contre `rebase`, résolution de conflit, GitHub Flow, Conventional Commits.
- [ ] Image contre conteneur, build multi-étapes, volumes, `.dockerignore`, Compose.
- [ ] CI contre CD, et livraison continue contre déploiement continu.
- [ ] Anatomie d'un pipeline GitHub Actions ; pourquoi on évite le tag `latest`.
- [ ] Reverse proxy, DNS, HTTPS ; le durcissement d'un VPS.
- [ ] Les environnements et les stratégies de déploiement ; comment revenir en arrière.
- [ ] Documenter : manuel de déploiement, documentation technique, SemVer.
- [ ] Logs, métriques et seuils d'alerte ; sauvegardes 3-2-1 et test de restauration.
- [ ] RTO, RPO, PRA, PCA ; les quatre types de maintenance.

**Bon courage pour ton examen, Valentin.**
