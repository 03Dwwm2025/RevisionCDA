## 5. L'architecture logicielle

L'architecture définit comment le code est **organisé en responsabilités séparées**. Une bonne architecture rend le code testable, maintenable et évolutif. La structure de référence du CDA est l'**architecture en couches**.

### 5.1 L'architecture en couches

Chaque couche a une responsabilité unique et ne communique qu'avec ses voisines, du plus proche de l'utilisateur au plus proche des données :

| Couche | Rôle |
| --- | --- |
| **View** (Vue) | Permet les interactions avec l'utilisateur (affichage, formulaires) |
| **Controller** | Contrôle, formate et vérifie l'intégrité, la pertinence et la bonne transmission des données |
| **Business / Métier** | Communique avec le repository ; contient les algorithmes liés à l'usage de l'application |
| **Repository** | Effectue les requêtes préparées / paramétrées vers la base |
| **BDD** | La base de données, interrogée par le repository |
| **Model** | Objets de données, utilisables partout (transverse) |
| **Outils / Utils** | Couche d'utilitaires disponible un peu partout (transverse) |

Le flux d'une requête traverse les couches : **View → Controller → Business → Repository → BDD**, puis remonte. Le **Model** et les **Outils** sont transverses (accessibles depuis plusieurs couches).

### 5.2 Le patron MVC

**MVC** (Model-View-Controller) est une déclinaison très répandue de cette séparation :

- **Model** : les données et la logique métier.
- **View** : la présentation (ce que voit l'utilisateur).
- **Controller** : reçoit les actions de l'utilisateur, sollicite le Model, choisit la View à renvoyer.

L'intérêt : on peut changer la vue (web, mobile) sans toucher au métier, et tester le métier sans interface.

### 5.3 Architectures n-tiers et client-serveur

Sur le plan déploiement, on parle d'architecture **3-tiers** : un client (navigateur), un serveur applicatif (l'API/le back) et un serveur de données (la BDD), souvent sur des machines distinctes. C'est le modèle de CongeApp : un front React appelle une API ASP.NET Core qui interroge une base SQL.

> **🔒 Sécurité**
>
> L'architecture en couches est elle-même un dispositif de sécurité (**défense en profondeur**).
> - **Valider à chaque couche** : ne jamais faire confiance aux données reçues de la couche au-dessus. La validation côté client (View) est pour le confort ; la vraie validation se fait côté serveur (Controller + Business).
> - Le **Repository** isole l'accès aux données et **centralise les requêtes paramétrées** : c'est le bon endroit pour empêcher les injections SQL.
> - **Cloisonnement** : une faille dans une couche ne doit pas compromettre tout le système. Le serveur de données n'est jamais exposé directement à Internet.
> - Appliquer le **moindre privilège** : le compte applicatif qui accède à la BDD n'a que les droits nécessaires (pas de DROP TABLE…).
