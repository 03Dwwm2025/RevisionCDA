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
    enonce: 'Remettez dans l’ordre le flux d’une requête de création dans une architecture en couches.',
    elements: [
      'Le client envoie la requête avec le corps JSON',
      'La couche de présentation désérialise et valide le format des données',
      'La couche métier applique les règles de gestion',
      'La couche d’accès aux données exécute une insertion paramétrée',
      'La réponse remonte les couches jusqu’au client',
    ],
    explication:
      'Le flux est strictement unidirectionnel à l’aller, et chaque couche ne parle qu’à sa voisine immédiate. La base ne remonte pas directement jusqu’à la présentation : c’est ce cloisonnement qui rend chaque couche remplaçable et testable isolément.',
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
    enonce:
      'Complétez ce pseudo-code de couche d’accès aux données pour que la requête soit protégée contre l’injection SQL.',
    codeAvecTrous: `fonction listerDemandesParSalarie(idSalarie) :
    # La valeur ne doit pas entrer dans le texte de la requête
    requete = "SELECT idDemande, dateDebut, statut
               FROM Demande WHERE idSalarie = ___1___"

    commande = connexion.preparer(requete)
    commande.___2___("idSalarie", idSalarie)

    retourner commande.___3___()`,
    choix: [
      ':idSalarie',
      '" + idSalarie + "',
      '{idSalarie}',
      'lierParametre',
      'concatener',
      'formater',
      'executerLecture',
      'executerTexte',
    ],
    bonnesReponses: [':idSalarie', 'lierParametre', 'executerLecture'],
    explication:
      'La requête est écrite une fois avec un emplacement nommé ; la valeur est transmise à part et traitée comme une donnée, jamais comme du code. Concaténer la valeur dans le texte ouvre l’injection SQL. Le nom de l’emplacement varie selon la technologie (`:nom`, `@nom` ou `?`), le principe est identique partout, et un ORM le fait automatiquement.',
  },
  {
    id: 'archi-006',
    theme: 'architecture',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'Pourquoi la couche métier doit-elle dépendre d’une interface de dépôt plutôt que de la classe concrète qui parle à la base ?',
    options: [
      'Pour pouvoir injecter un faux dépôt en test et respecter l’inversion des dépendances',
      'Pour des raisons de performance : les interfaces sont plus rapides',
      'Parce qu’un langage objet interdit d’instancier directement une classe de dépôt',
      'Pour masquer les requêtes SQL au compilateur',
    ],
    bonneReponse: 0,
    explication:
      'En dépendant du contrat et non de l’implémentation, on peut passer un faux dépôt en mémoire lors des tests : la couche métier se teste sans base de données. C’est le D de SOLID, et c’est aussi ce qui permet de changer de moteur de stockage sans réécrire le métier.',
  },
  {
    id: 'archi-007',
    theme: 'architecture',
    type: 'vrai_faux',
    difficulte: 2,
    enonce:
      'Valider le format des données à l’entrée suffit : il est inutile de vérifier quoi que ce soit dans la couche métier.',
    bonneReponse: false,
    explication:
      'La validation d’entrée vérifie la forme : champ présent, type correct, longueur respectée. La couche métier vérifie la cohérence : solde suffisant, absence de chevauchement, droit d’agir. Ces règles exigent de consulter d’autres données, elles ne peuvent pas s’exprimer par une simple contrainte de format.',
  },
  {
    id: 'archi-008',
    theme: 'architecture',
    type: 'qcm',
    difficulte: 3,
    enonce:
      'Qu’est-ce qu’un objet de transfert (DTO) et pourquoi l’utiliser plutôt que l’entité de la base ?',
    options: [
      'Un objet qui ne porte que les données utiles à un échange précis, sans exposer les champs internes de l’entité',
      'Un autre nom pour une entité : les deux termes sont interchangeables',
      'Une entité convertie automatiquement en JSON par le cadriciel',
      'Un remplacement de la couche d’accès aux données pour les cas simples',
    ],
    bonneReponse: 0,
    explication:
      'L’entité Salarié porte le condensat du mot de passe, l’identifiant du manager, des colonnes techniques. Rien de tout cela n’a sa place dans une réponse d’API. L’objet de transfert découple aussi le contrat public du schéma interne : la base peut évoluer sans casser les clients.',
  },

  // --- DTO, injection de dépendances ---
  {
    id: 'archi-009',
    theme: 'architecture',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quel risque concret prend-on en renvoyant directement une entité de base de données dans une réponse d’API ?',
    options: [
      'Exposer des champs sensibles ou internes que personne n’a décidé de publier',
      'Uniquement une perte de performance à la sérialisation',
      'Rendre la réponse impossible à sérialiser en JSON',
      'Aucun risque : c’est la pratique recommandée',
    ],
    bonneReponse: 0,
    explication:
      'Le danger est le champ qu’on oublie. Ajouter demain une colonne interne à l’entité la publie aussitôt dans l’API, sans que personne ne l’ait voulu. Avec un objet de transfert, tout champ exposé est un choix explicite.',
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
    enonce: 'Associez chaque couche à ce qu’elle ne doit PAS contenir.',
    paires: [
      { gauche: 'Présentation', droite: 'Des requêtes vers la base ou des règles de gestion complexes' },
      { gauche: 'Métier', droite: 'Des notions propres à HTTP : codes de statut, en-têtes, requête' },
      { gauche: 'Accès aux données', droite: 'Des règles de gestion comme le contrôle du solde' },
      { gauche: 'Interface utilisateur', droite: 'La seule vérification de sécurité de l’application' },
    ],
    explication:
      'Une couche de présentation qui écrit du SQL est intestable. Une couche métier qui manipule des codes HTTP ne sert plus qu’à une API et devient inutilisable pour une tâche planifiée ou un traitement par lots. Et une vérification qui n’existe que côté client se contourne en trois secondes.',
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
      'Parce qu’il est interdit dans les langages objet modernes',
      'Parce qu’il consomme beaucoup de mémoire',
      'Parce qu’il empêche l’injection de dépendances',
    ],
    bonneReponse: 0,
    explication:
      'Une seule instance pour toute l’application signifie que toutes les requêtes simultanées la partagent : le moindre état modifiable devient une source de bugs difficiles à reproduire. On le réserve aux objets sans état ou protégés contre les accès concurrents — une configuration, un cache conçu pour ça. Par défaut, on préfère une instance par requête.',
  },
  {
    id: 'archi-016',
    theme: 'architecture',
    type: 'completer_code',
    difficulte: 2,
    enonce:
      'Complétez ce pseudo-code du patron Fabrique : le constructeur est fermé, la création passe par des méthodes nommées.',
    codeAvecTrous: `classe Resultat :
    succes : booleen
    message : texte

    ___1___ constructeur()          # inaccessible depuis l'extérieur

    ___2___ fonction Ok() :
        retourner nouveau Resultat(succes = vrai)

    ___2___ fonction Erreur(msg) :
        retourner nouveau Resultat(succes = ___3___, message = msg)`,
    choix: ['prive', 'public', 'protege', 'statique', 'abstrait', 'vrai', 'faux'],
    bonnesReponses: ['prive', 'statique', 'faux'],
    explication:
      'Le constructeur privé interdit de créer l’objet directement ; les méthodes statiques nommées deviennent le seul chemin. `Resultat.Erreur("Solde insuffisant")` se lit mieux qu’un constructeur à paramètres booléens, et surtout il devient impossible de fabriquer un objet incohérent — un échec sans message, par exemple.',
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
