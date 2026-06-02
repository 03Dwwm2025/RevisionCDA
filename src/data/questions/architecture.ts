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
];
