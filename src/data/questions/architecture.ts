import type { Question } from '../../types/quiz';

export const questionsArchitecture: Question[] = [
  {
    id: 'archi-001',
    theme: 'architecture',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque couche de l\'architecture en couches à son rôle.',
    paires: [
      { gauche: 'Controller', droite: 'Reçoit la requête, valide les données, délègue au Service' },
      { gauche: 'Service (Métier)', droite: 'Applique les règles métier, coordonne les appels au Repository' },
      { gauche: 'Repository', droite: 'Centralise les requêtes SQL paramétrées vers la base de données' },
      { gauche: 'Model / DTO', droite: 'Objets de données transportés entre les couches (transverse)' },
    ],
    explication:
      'Règle d\'or : les dépendances vont vers le bas. Controller → Service → Repository → BDD. Le Controller ne fait jamais de SQL. Le Repository ne contient pas de règles métier. Le Service ne connaît pas la couche HTTP (pas de `HttpContext` dans le Service).',
  },
  {
    id: 'archi-002',
    theme: 'architecture',
    type: 'remettre_ordre',
    difficulte: 1,
    enonce: 'Remettez dans l\'ordre le flux d\'une requête POST dans une architecture en couches.',
    elements: [
      'Le client envoie POST /api/demandes avec le corps JSON',
      'Le Controller désérialise et valide le DTO (`ModelState`)',
      'Le Service applique les règles métier (dates cohérentes, solde suffisant)',
      'Le Repository exécute un INSERT paramétré en base de données',
      'La réponse remonte : 201 Created avec la ressource créée',
    ],
    explication:
      'Le flux est strictement unidirectionnel à l\'aller : Client → Controller → Service → Repository → BDD. Chaque couche ne communique qu\'avec ses voisines immédiates. La BDD ne "remonte" pas directement jusqu\'au Controller.',
  },
  {
    id: 'archi-003',
    theme: 'architecture',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Dans le patron **MVC**, quel composant reçoit les actions de l\'utilisateur, sollicite le Model et choisit la View ?',
    options: ['Model', 'View', 'Controller', 'Service'],
    bonneReponse: 2,
    explication:
      'MVC : Model (données + logique métier), View (présentation), Controller (orchestrateur). Le Controller est le point d\'entrée des requêtes HTTP. Il ne fait pas de logique métier complexe — il délègue au Service/Model. L\'intérêt : on peut changer la View (web → mobile) sans toucher au Model.',
  },
  {
    id: 'archi-004',
    theme: 'architecture',
    type: 'vrai_faux',
    difficulte: 1,
    enonce: 'Dans une architecture 3-tiers, la base de données doit être directement accessible depuis Internet pour que l\'API puisse la requêter.',
    bonneReponse: false,
    explication:
      'La BDD écoute uniquement sur le réseau interne (Docker network ou réseau privé du VPS). Seul l\'API server peut la joindre. Exposer la BDD sur Internet multiplierait les vecteurs d\'attaque. En Docker Compose, les services communiquent via le réseau interne sans port exposé.',
  },
  {
    id: 'archi-005',
    theme: 'architecture',
    type: 'completer_code',
    difficulte: 2,
    enonce: 'Complétez ce Repository C# qui centralise les requêtes SQL paramétrées.',
    codeAvecTrous: `public class DemandeRepository
{
    private readonly string _connString;
    public DemandeRepository(string cs) => _connString = cs;

    public List<Demande> GetParSalarie(int idSalarie)
    {
        var list = new List<Demande>();
        using var conn = new ___1___(_connString);
        var sql = @"SELECT idDemande, dateDebut, dateFin, statut
                    FROM Demande WHERE idSalarie = ___2___";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.___3___("@id", idSalarie);
        conn.Open();
        // ... lecture du reader ...
        return list;
    }
}`,
    choix: ['SqlConnection', 'DbConnection', 'Connection', '@id', '?', '{id}', 'AddWithValue', 'Add', 'Append'],
    bonnesReponses: ['SqlConnection', '@id', 'AddWithValue'],
    explication:
      '`SqlConnection` ouvre la connexion SQL Server. `@id` est le paramètre nommé dans la requête. `AddWithValue("@id", idSalarie)` lie la valeur sans concaténation — c\'est la protection anti-injection SQL. Le `using` garantit la fermeture de la connexion même en cas d\'exception.',
  },
  {
    id: 'archi-006',
    theme: 'architecture',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Pourquoi le Service (couche métier) ne doit-il pas dépendre directement de `DemandeRepository` (classe concrète) mais de `IDemandeRepository` (interface) ?',
    options: [
      'Pour des raisons de performance (les interfaces sont plus rapides)',
      'Pour permettre l\'injection d\'un faux repository en test et respecter la Dependency Inversion (DIP)',
      'Parce que C# n\'autorise pas l\'instanciation directe d\'un repository',
      'Pour cacher les requêtes SQL au compilateur',
    ],
    bonneReponse: 1,
    explication:
      'Si `ServiceConges` dépend de `IDemandeRepository`, on peut injecter un `FakeRepository` en test sans avoir de BDD. C\'est DIP (SOLID) + testabilité. Le conteneur d\'injection (ASP.NET Core) résout l\'interface vers la vraie implémentation en production.',
  },
  {
    id: 'archi-007',
    theme: 'architecture',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'La validation des données dans le Controller (ex. `ModelState.IsValid`) est suffisante ; il n\'est pas nécessaire de revalider dans le Service.',
    bonneReponse: false,
    explication:
      'La validation Controller vérifie la forme (types, longueurs, annotations). Le Service doit valider les **règles métier** : dates cohérentes, solde suffisant, pas de chevauchement. Ces règles ne sont pas exprimables avec des Data Annotations. Défense en profondeur : chaque couche valide ce qui la concerne.',
  },
  {
    id: 'archi-008',
    theme: 'architecture',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Qu\'est-ce qu\'un **DTO** (Data Transfer Object) et pourquoi l\'utiliser plutôt que l\'entité directement ?',
    options: [
      'Un DTO est un alias pour une entité — les deux termes sont interchangeables',
      'Un DTO contient uniquement les données nécessaires à un échange précis (ex. création), évitant d\'exposer des champs sensibles ou internes de l\'entité',
      'Un DTO est une entité sérialisée en JSON automatiquement par ASP.NET Core',
      'Un DTO remplace la couche Repository pour les opérations simples',
    ],
    bonneReponse: 1,
    explication:
      'L\'entité `Salarie` peut contenir `hashMotDePasse`, `soldeConges`, `idManager`… On ne veut pas tout exposer en API. Le DTO `SalarieDto` ne contient que `nom` et `email`. Avantage : découple le schéma interne du contrat API, protège les données sensibles, permet des versions d\'API indépendantes.',
  },

  // --- DTO, injection de dépendances ---
  {
    id: 'archi-009',
    theme: 'architecture',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Pourquoi ne doit-on pas exposer directement l\'entité de la base de données dans la réponse de l\'API ?',
    options: [
      'Pour des raisons de performance uniquement',
      'Parce que l\'entité peut contenir des champs sensibles (hash mot de passe, données internes) qu\'on ne veut pas exposer',
      'Parce que les entités ne peuvent pas être sérialisées en JSON',
      'C\'est une contrainte du framework ASP.NET Core',
    ],
    bonneReponse: 1,
    explication:
      'L\'entité `Salarie` contient potentiellement `hashMotDePasse`, `soldeConges`, `idManager`… On ne veut pas tout exposer. Le DTO (`SalarieReponseDto`) ne contient que `nom` et `email`. Autre avantage : si le schéma interne change, le contrat API reste stable.',
  },
  {
    id: 'archi-010',
    theme: 'architecture',
    type: 'vrai_faux',
    difficulte: 1,
    enonce: 'Dans l\'architecture en couches, le Service (couche métier) peut faire des requêtes SQL directement, sans passer par le Repository.',
    bonneReponse: false,
    explication:
      'Le Service ne connaît que le Repository (via une interface). Il ne fait jamais de SQL direct. Cette séparation permet de changer la BDD ou l\'ORM sans toucher au Service, et de tester le Service avec un faux Repository sans BDD réelle.',
  },
  {
    id: 'archi-011',
    theme: 'architecture',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque couche à ce qu\'elle NE doit PAS contenir.',
    paires: [
      { gauche: 'Controller', droite: 'Requêtes SQL ou logique métier complexe' },
      { gauche: 'Service (Métier)', droite: 'Code HTTP (`HttpContext`, codes de statut)' },
      { gauche: 'Repository', droite: 'Règles métier (validation du solde, chevauchement de dates)' },
      { gauche: 'Vue / Front-end', droite: 'Logique de sécurité ou règles métier (côté client = non fiable)' },
    ],
    explication:
      'Chaque couche doit rester dans son domaine. Un Controller qui fait du SQL est non testable. Un Service qui retourne des `IActionResult` est couplé à HTTP. Un Repository qui valide les règles métier les duplique. La Vue ne doit jamais être la seule ligne de défense.',
  },
  // --- Patrons de conception ---
  {
    id: 'archi-012',
    theme: 'architecture',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque patron de conception au problème qu’il résout.',
    paires: [
      { gauche: 'Singleton', droite: 'Garantir une seule instance pour toute l’application' },
      { gauche: 'Factory', droite: 'Déléguer la création d’objets à une méthode dédiée' },
      { gauche: 'Strategy', droite: 'Rendre un algorithme interchangeable à l’exécution' },
      { gauche: 'Observer', droite: 'Notifier plusieurs abonnés qu’un événement s’est produit' },
    ],
    explication:
      'Un patron n’est pas du code à copier : c’est un schéma d’organisation et surtout un vocabulaire commun. Dire « ici j’utilise un Repository » remplace un paragraphe d’explication en réunion de conception.',
  },
  {
    id: 'archi-013',
    theme: 'architecture',
    type: 'association',
    difficulte: 2,
    enonce: 'Classez chaque patron dans sa famille.',
    paires: [
      { gauche: 'Création', droite: 'Singleton, Factory, Builder' },
      { gauche: 'Structure', droite: 'Adapter, Decorator, Facade, Repository' },
      { gauche: 'Comportement', droite: 'Strategy, Observer, Template Method' },
    ],
    explication:
      'Les patrons de création répondent à « comment instancier », les patrons de structure à « comment assembler », les patrons de comportement à « comment faire collaborer ». Savoir citer la famille montre qu’on a compris la logique et pas seulement appris une liste.',
  },
  {
    id: 'archi-014',
    theme: 'architecture',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quel patron le Repository met-il en œuvre dans une architecture en couches ?',
    options: [
      'Il isole l’accès aux données : le Service manipule une collection d’objets métier, sans connaître le SQL',
      'Il garantit qu’une seule connexion à la base existe',
      'Il transforme les objets métier en JSON',
      'Il gère le cycle de vie des transactions',
    ],
    bonneReponse: 0,
    explication:
      'Bénéfice concret : changer de SGBD, ou remplacer le vrai dépôt par un faux en test, sans toucher à la couche métier. C’est aussi ce qui rend les tests unitaires du Service possibles sans base de données.',
  },
  {
    id: 'archi-015',
    theme: 'architecture',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Pourquoi le patron Singleton demande-t-il de la prudence ?',
    options: [
      'Parce qu’il porte un état global partagé, qui doit être conçu pour l’accès concurrent',
      'Parce qu’il est interdit en C#',
      'Parce qu’il consomme beaucoup de mémoire',
      'Parce qu’il empêche l’injection de dépendances',
    ],
    bonneReponse: 0,
    explication:
      'Une seule instance servie à toute l’application signifie que plusieurs requêtes simultanées la partagent. En ASP.NET Core, `AddSingleton` doit donc être réservé à des objets sans état modifiable, ou protégés contre les accès concurrents. Pour le reste, `AddScoped` est le choix par défaut.',
  },
  {
    id: 'archi-016',
    theme: 'architecture',
    type: 'completer_code',
    difficulte: 2,
    enonce: 'Complétez ce patron Factory : le constructeur est fermé, la création passe par des méthodes nommées.',
    codeAvecTrous: `public class Resultat
{
    public bool   Succes  { get; private set; }
    public string Message { get; private set; } = "";

    ___1___ Resultat() { }   // constructeur inaccessible de l'extérieur

    public ___2___ Resultat Ok()               => new() { Succes = true };
    public ___3___ Resultat Erreur(string msg) => new() { Succes = false, Message = msg };
}`,
    choix: ['private', 'public', 'protected', 'static', 'abstract', 'virtual'],
    bonnesReponses: ['private', 'static', 'static'],
    explication:
      'Le constructeur privé interdit `new Resultat(...)` de l’extérieur ; les méthodes statiques nommées deviennent le seul moyen de créer l’objet. `Resultat.Erreur("Solde insuffisant")` se lit mieux qu’un constructeur à paramètres booléens, et empêche de construire un objet incohérent.',
  },
  {
    id: 'archi-017',
    theme: 'architecture',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Plus une application utilise de patrons de conception, meilleure est son architecture.',
    bonneReponse: false,
    explication:
      'Chaque patron ajoute une indirection, donc de la complexité. On l’introduit quand le problème qu’il résout se présente vraiment — rasoir d’Ockham. Une factory pour une classe instanciée à un seul endroit est du bruit, pas de la qualité.',
  },
  {
    id: 'archi-018',
    theme: 'architecture',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quel patron permet d’ajouter un nouveau mode de calcul du solde sans modifier le Service existant ?',
    options: [
      'Strategy : le Service reçoit une interface de calcul et on en injecte une nouvelle implémentation',
      'Singleton : on remplace l’instance unique par une autre',
      'Observer : le Service s’abonne au nouveau calcul',
      'Adapter : on convertit l’ancien calcul en nouveau',
    ],
    bonneReponse: 0,
    explication:
      'C’est l’application directe du principe ouvert/fermé (le O de SOLID) : le Service est ouvert à l’extension (nouvelle stratégie) mais fermé à la modification. Ajouter un calcul « cadre » ne touche pas une ligne du Service.',
  },
  // --- Monolithe et microservices ---
  {
    id: 'archi-019',
    theme: 'architecture',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Quel problème les microservices résolvent-ils principalement ?',
    options: [
      'Un problème d’organisation : permettre à plusieurs équipes de livrer sans se bloquer',
      'Un problème de performance : le réseau est plus rapide qu’un appel en mémoire',
      'Un problème de sécurité : chaque service est isolé des attaques',
      'Un problème de coût : plusieurs petits serveurs coûtent moins cher',
    ],
    bonneReponse: 0,
    explication:
      'Le gain est humain avant d’être technique. Le prix à payer est lourd : appels réseau entre services, cohérence distribuée, supervision multipliée, déploiement plus complexe. Pour une petite équipe, le monolithe en couches reste le bon choix — et savoir l’expliquer vaut mieux que d’empiler des services.',
  },
  {
    id: 'archi-020',
    theme: 'architecture',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque style d’architecture à sa situation.',
    paires: [
      { gauche: 'Monolithe en couches', droite: 'La majorité des projets : simple à développer, déboguer et déployer' },
      { gauche: 'Monolithe modulaire', droite: 'Un seul déploiement, mais des modules métier étanches' },
      { gauche: 'Microservices', droite: 'Grosses équipes, besoins de montée en charge très différents par service' },
    ],
    explication:
      'Le monolithe modulaire est souvent le bon compromis : il prépare une découpe éventuelle sans en payer le coût tout de suite. Choisir les microservices sans le problème d’organisation qui les justifie, c’est acheter la complexité sans le bénéfice.',
  },
  {
    id: 'archi-021',
    theme: 'architecture',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Dans une architecture 3-tiers, pourquoi la base de données n’est-elle jamais exposée sur Internet ?',
    options: [
      'Parce qu’elle ne doit être accessible que par le serveur applicatif, sur le réseau interne',
      'Parce que les SGBD ne savent pas gérer le protocole HTTPS',
      'Parce que cela ralentirait les requêtes',
      'Parce que le navigateur ne sait pas parler SQL',
    ],
    bonneReponse: 0,
    explication:
      'C’est du cloisonnement : le seul point d’entrée public est l’API, qui contrôle l’authentification et les autorisations. Une base exposée expose aussi ses comptes et toutes ses données à qui trouve un mot de passe faible. En Docker Compose, cela se traduit par l’absence de section `ports:` sur le service de base de données.',
  },
  {
    id: 'archi-022',
    theme: 'architecture',
    type: 'remettre_ordre',
    difficulte: 2,
    enonce: 'Remettez dans l’ordre le trajet d’une requête de création de demande, de l’utilisateur à la base.',
    elements: [
      'La vue envoie la requête HTTP',
      'Le Controller valide le format et délègue',
      'Le Service applique les règles métier',
      'Le Repository exécute la requête SQL paramétrée',
      'La base enregistre la ligne',
    ],
    explication:
      'Les dépendances vont vers le bas : le Controller connaît le Service, le Service connaît le Repository, et jamais l’inverse. Chaque couche ne parle qu’à sa voisine immédiate — c’est ce qui permet de tester le Service sans base et de changer la vue sans toucher au métier.',
  },
];
