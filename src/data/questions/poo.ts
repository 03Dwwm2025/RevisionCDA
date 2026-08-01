import type { Question } from '../../types/quiz';

export const questionsPOO: Question[] = [
  // --- Vocabulaire de base (6.1) ---
  {
    id: 'poo-001',
    theme: 'poo',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Que réalise la ligne `Eleve unEleve = new Eleve();` ?',
    options: [
      'Une déclaration (réservation mémoire)',
      'Une initialisation (première valeur donnée)',
      'Une instanciation (déclaration + initialisation de l\'objet)',
      'Une affectation (nouvelle valeur à une variable existante)',
    ],
    bonneReponse: 2,
    explication:
      'L\'instanciation combine déclaration ET initialisation en une seule ligne. Si on écrit `Eleve e;` puis `e = new Eleve();`, la 1ʳᵉ ligne est une déclaration et la 2ᵉ une initialisation.',
  },
  {
    id: 'poo-011',
    theme: 'poo',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Quelle syntaxe C# déclare une propriété en **lecture seule depuis l\'extérieur** mais modifiable dans la classe via le constructeur ?',
    options: [
      '`public string Nom { get; set; }`',
      '`public string Nom { get; private set; }`',
      '`public string Nom { get; init; }`',
      '`public readonly string Nom;`',
    ],
    bonneReponse: 1,
    explication:
      '`private set` restreint la modification à la classe elle-même (y compris les méthodes). `init` (C# 9) n\'autorise l\'affectation que dans un initialiseur d\'objet ou le constructeur. `readonly` est un champ, pas une propriété.',
  },

  // --- Encapsulation / modificateurs d'accès (6.2) ---
  {
    id: 'poo-002',
    theme: 'poo',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Quel modificateur d\'accès rend un membre visible uniquement depuis sa propre classe ?',
    options: ['public', 'protected', 'internal', 'private'],
    bonneReponse: 3,
    explication:
      '`private` : visible uniquement dans la classe. `protected` : aussi dans les classes enfants. `internal` : dans tout l\'assembly. `public` : de partout.',
  },
  {
    id: 'poo-010',
    theme: 'poo',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Que fait le mot-clé `static` appliqué à un membre d\'une classe ?',
    options: [
      'Le rend accessible sans avoir besoin d\'instancier la classe',
      'Le rend immuable (constant)',
      'Le rend héritable par les classes enfants',
      'Limite sa visibilité au même fichier',
    ],
    bonneReponse: 0,
    explication:
      'Un membre `static` appartient à la classe elle-même, pas aux instances. Ex : `Math.Abs(-5)` s\'appelle sans `new Math()`. À distinguer de `const` (valeur figée à la compilation).',
  },

  // --- Constructeur et surcharge (6.3) ---
  {
    id: 'poo-005',
    theme: 'poo',
    type: 'vrai_faux',
    difficulte: 1,
    enonce: 'Le constructeur d\'une classe peut être surchargé (avoir plusieurs signatures) en C#.',
    bonneReponse: true,
    explication:
      'La surcharge permet d\'offrir plusieurs façons d\'initialiser un objet selon les infos disponibles. Ex : `new Demande(debut, fin)` et `new Demande(jourUnique)` sont deux surcharges valides.',
  },

  // --- Héritage (6.4) ---
  {
    id: 'poo-004',
    theme: 'poo',
    type: 'vrai_faux',
    difficulte: 1,
    enonce: 'En C#, une classe peut hériter de plusieurs classes à la fois (héritage multiple de classes).',
    bonneReponse: false,
    explication:
      'C# interdit l\'héritage multiple de classes : une classe enfant ne peut avoir qu\'un seul parent. En revanche, elle peut implémenter autant d\'interfaces qu\'elle veut.',
  },

  // --- Classe abstraite, polymorphisme, interface (6.5) ---
  {
    id: 'poo-003',
    theme: 'poo',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quelle affirmation distingue correctement une classe `abstract` d\'une `interface` en C# ?',
    options: [
      'La classe abstraite peut avoir des champs, un constructeur et du code concret ; l\'interface définit un contrat sans état',
      'Une interface peut être instanciée directement, pas une classe abstraite',
      'Une classe peut hériter de plusieurs classes abstraites',
      'Il n\'y a aucune différence depuis C# 8',
    ],
    bonneReponse: 0,
    explication:
      'Classe abstraite = modèle enrichi (champs, code concret, un seul héritage). Interface = contrat pur (plusieurs implémentations possibles, pas d\'état). Les deux ne peuvent pas être instanciées directement.',
  },
  {
    id: 'poo-009',
    theme: 'poo',
    type: 'vrai_faux',
    difficulte: 2,
    enonce:
      'Pour redéfinir une méthode `virtual` dans une classe enfant en C#, le mot-clé `override` est obligatoire.',
    bonneReponse: true,
    explication:
      '`override` signale explicitement qu\'on redéfinit une méthode héritée marquée `virtual` ou `abstract`. Sans `override`, le compilateur considère que c\'est une nouvelle méthode indépendante (et lève un warning).',
  },
  {
    id: 'poo-006',
    theme: 'poo',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque pilier de la POO à sa définition.',
    paires: [
      { gauche: 'Encapsulation', droite: 'Protéger les données et exposer uniquement ce qui est nécessaire' },
      { gauche: 'Héritage', droite: 'Une classe enfant réutilise attributs et méthodes d\'une classe parent' },
      { gauche: 'Polymorphisme', droite: 'Même appel, comportement différent selon le type réel de l\'objet' },
      { gauche: 'Abstraction', droite: 'Masquer les détails d\'implémentation derrière un contrat clair' },
    ],
    explication:
      'Les 4 piliers : encapsulation (protège), héritage (réutilise), polymorphisme (adapte), abstraction (simplifie). Le polymorphisme découle de l\'héritage + `override`.',
  },
  {
    id: 'poo-007',
    theme: 'poo',
    type: 'completer_code',
    difficulte: 2,
    enonce: 'Complétez cette classe C# qui illustre l\'encapsulation d\'un compte bancaire.',
    codeAvecTrous: `public class CompteBancaire
{
    ___1___ decimal _solde;

    public decimal Solde
    {
        ___2___ => _solde;
    }

    public void Deposer(decimal montant)
    {
        if (montant > 0) _solde ___3___ montant;
    }
}`,
    choix: ['private', 'public', 'protected', 'get', 'set', '+=', '-=', '='],
    bonnesReponses: ['private', 'get', '+='],
    explication:
      '`_solde` est `private` (encapsulation : on ne modifie le solde que via les méthodes). La propriété `Solde` n\'expose qu\'un `get` (lecture seule de l\'extérieur). `Deposer` utilise `+=` pour accumuler.',
  },
  {
    id: 'poo-012',
    theme: 'poo',
    type: 'completer_code',
    difficulte: 3,
    enonce: 'Complétez ce code C# illustrant la classe abstraite et le polymorphisme.',
    codeAvecTrous: `public ___1___ class Employe
{
    public string Nom { get; set; }
    public ___2___ decimal CalculerPrime();   // sans corps
    public virtual string Role() => "Employé";
}

public class Manager : ___3___
{
    public ___4___ decimal CalculerPrime() => 2000m;
    public override string Role() => "Manager";
}`,
    choix: ['abstract', 'virtual', 'override', 'static', 'Employe', 'INotifiable', 'new', 'sealed'],
    bonnesReponses: ['abstract', 'abstract', 'Employe', 'override'],
    explication:
      '`abstract class` ne peut pas être instanciée. `abstract decimal CalculerPrime()` oblige les enfants à implémenter. `Manager : Employe` déclare l\'héritage. `override` redéfinit la méthode abstraite (polymorphisme).',
  },

  // --- sealed / base / new vs override (6.4 suite) ---
  {
    id: 'poo-013',
    theme: 'poo',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Le mot-clé `sealed` appliqué à une classe en C# empêche tout héritage de cette classe.',
    bonneReponse: true,
    explication:
      '`sealed class` interdit de créer une classe enfant. Utile pour des raisons de sécurité ou de perf (les appels de méthodes sur une classe `sealed` peuvent être optimisés par le CLR). `sealed` peut aussi s\'appliquer à une `override` pour empêcher la redéfinition ultérieure.',
  },
  {
    id: 'poo-014',
    theme: 'poo',
    type: 'completer_code',
    difficulte: 3,
    enonce: 'Complétez ce code C# : la classe `Manager` appelle le constructeur parent et surcharge `Saluer()`.',
    codeAvecTrous: `public class Employe
{
    public string Nom { get; }
    public Employe(string nom) { Nom = nom; }
    public virtual string Saluer() => $"Bonjour, je suis {Nom}.";
}

public class Manager : Employe
{
    public string Service { get; }

    public Manager(string nom, string service)
        : ___1___(nom)           // appel du constructeur parent
    {
        Service = service;
    }

    public ___2___ string Saluer()
        => $"{___3___.Saluer()} Je manage {Service}.";
}`,
    choix: ['base', 'this', 'super', 'override', 'virtual', 'new'],
    bonnesReponses: ['base', 'override', 'base'],
    explication:
      '`base(nom)` transmet l\'argument au constructeur parent. `override` redéfinit la méthode `virtual`. `base.Saluer()` appelle la version parent pour réutiliser son message au lieu de le dupliquer.',
  },
  {
    id: 'poo-015',
    theme: 'poo',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Quelle est la différence entre `new` et `override` pour redéfinir une méthode héritée ?',
    options: [
      '`new` masque la méthode parent (pas de polymorphisme) ; `override` la redéfinit avec liaison tardive (polymorphisme)',
      '`override` masque la méthode parent ; `new` active le polymorphisme',
      'Les deux sont équivalents ; `new` est juste plus explicite',
      '`new` n\'est valide que sur les méthodes `abstract`',
    ],
    bonneReponse: 0,
    explication:
      'Avec `override`, C# résout la méthode selon le type **réel** à l\'exécution (liaison tardive). Avec `new`, la résolution se fait selon le type **déclaré** : une variable `Employe e = new Manager()` appellera la version `Employe.Saluer()` si `Manager` utilise `new`. C\'est un piège classique en entretien.',
  },

  // --- Séquence ---
  {
    id: 'poo-008',
    theme: 'poo',
    type: 'remettre_ordre',
    difficulte: 2,
    enonce: 'Remettez dans l\'ordre les étapes pour exploiter le polymorphisme en C#.',
    elements: [
      'Déclarer une classe `abstract` avec une méthode `abstract`',
      'Créer une classe enfant qui hérite de la classe abstraite',
      'Implémenter la méthode abstraite avec `override`',
      'Déclarer une variable du type parent et l\'assigner à une instance enfant',
      'Appeler la méthode : C# exécute la version de la classe enfant',
    ],
    explication:
      'C\'est le cœur du polymorphisme : même référence de type parent (`Employe e`), comportement adapté selon l\'objet réel (`Manager`, `Stagiaire`…). L\'`override` est le mécanisme de liaison tardive.',
  },
  // --- Composition et héritage ---
  {
    id: 'poo-016',
    theme: 'poo',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quel test simple permet de décider entre héritage et composition ?',
    options: [
      'La phrase « un X est un Y » doit être vraie sans effort ; sinon c’est « un X a un Y », donc de la composition',
      'Si la classe a plus de cinq méthodes, on utilise l’héritage',
      'On utilise l’héritage quand les deux classes sont dans le même fichier',
      'La composition ne s’utilise que pour les interfaces',
    ],
    bonneReponse: 0,
    explication:
      'Un Manager EST UN Salarie : l’héritage se justifie. Un ServiceConges A UN journal : c’est de la composition. La règle de métier est de préférer la composition — le lien est plus faible, remplaçable à l’exécution, et n’impose pas d’hériter de toute l’interface publique du parent.',
  },
  {
    id: 'poo-017',
    theme: 'poo',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Une sous-classe redéfinit une méthode héritée uniquement pour lever une exception « opération non supportée ». Que révèle ce symptôme ?',
    options: [
      'Une violation du principe de substitution de Liskov : la sous-classe ne peut pas remplacer son parent',
      'Un manque de tests unitaires sur la classe parente',
      'Une mauvaise gestion des exceptions',
      'Un besoin d’ajouter un constructeur par défaut',
    ],
    bonneReponse: 0,
    explication:
      'Si un code qui manipule le parent casse lorsqu’on lui passe l’enfant, la hiérarchie est mal posée. C’est le signal qu’il fallait de la composition, ou une interface plus fine (principe de ségrégation des interfaces).',
  },
  {
    id: 'poo-018',
    theme: 'poo',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Une hiérarchie d’héritage de cinq niveaux est un signe de bonne conception objet.',
    bonneReponse: false,
    explication:
      'Au-delà de deux ou trois niveaux, plus personne ne sait d’où vient un comportement, et une modification dans une classe haute casse des enfants qu’on n’avait pas en tête. Une hiérarchie profonde est un symptôme classique d’héritage utilisé pour réutiliser du code plutôt que pour exprimer un « est un ».',
  },
  // --- Types valeur et référence ---
  {
    id: 'poo-019',
    theme: 'poo',
    type: 'qcm',
    difficulte: 2,
    enonce: 'En C#, que vaut `a` après ce code : `int a = 5; int b = a; b = 10;` ?',
    options: ['5', '10', '15', 'null'],
    bonneReponse: 0,
    explication:
      '`int` est un type valeur : l’affectation copie la valeur, les deux variables sont indépendantes. Avec un type référence (une classe), l’affectation copie l’adresse : les deux variables désignent le même objet, et modifier l’un modifie l’autre.',
  },
  {
    id: 'poo-020',
    theme: 'poo',
    type: 'association',
    difficulte: 2,
    enonce: 'Classez chaque type C# dans sa famille.',
    paires: [
      { gauche: 'int, bool, DateOnly, decimal', droite: 'Types valeur' },
      { gauche: 'struct et enum', droite: 'Types valeur également' },
      { gauche: 'class, tableaux, List<T>', droite: 'Types référence' },
      { gauche: 'string', droite: 'Type référence, mais immuable' },
    ],
    explication:
      '`string` est le piège classique : c’est un type référence, mais son immuabilité lui donne l’apparence d’un type valeur. Toute « modification » crée en réalité une nouvelle chaîne — c’est pourquoi concaténer dans une boucle est coûteux et qu’on préfère StringBuilder.',
  },
  {
    id: 'poo-021',
    theme: 'poo',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Une méthode `void Renommer(Salarie s) => s.Nom = "Modifié";` modifie-t-elle l’objet de l’appelant ?',
    options: [
      'Oui : `Salarie` est un type référence, la méthode reçoit l’adresse de l’objet',
      'Non : les paramètres sont toujours copiés en C#',
      'Oui, mais uniquement si le paramètre est marqué `ref`',
      'Non, sauf si la classe est marquée `static`',
    ],
    bonneReponse: 0,
    explication:
      'La référence est copiée, mais elle désigne le même objet : modifier une propriété est visible chez l’appelant. En revanche, réaffecter le paramètre lui-même (`s = new Salarie()`) n’a aucun effet à l’extérieur — c’est là qu’intervient le mot-clé `ref`.',
  },
  {
    id: 'poo-022',
    theme: 'poo',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Pourquoi remplacer `string Statut` par un `enum StatutDemande` dans une entité ?',
    options: [
      'Parce que l’ensemble des valeurs devient fermé et vérifié par le compilateur : plus de faute de frappe possible',
      'Parce qu’un enum occupe moins de place en base de données',
      'Parce que les chaînes de caractères sont dépréciées en C#',
      'Parce que cela accélère les requêtes SQL',
    ],
    bonneReponse: 0,
    explication:
      'Avec une chaîne libre, `"VALIDEE"`, `"Validee"` et `"VALIDÉE"` sont trois valeurs différentes et le bug ne se voit qu’à l’exécution. L’enum supprime toute une famille d’erreurs et permet au compilateur de vérifier l’exhaustivité des `switch`.',
  },
  {
    id: 'poo-023',
    theme: 'poo',
    type: 'vrai_faux',
    difficulte: 3,
    enonce: 'Deux `record` C# contenant les mêmes valeurs sont considérés comme égaux avec l’opérateur `==`.',
    bonneReponse: true,
    explication:
      'Le `record` est fait pour porter des données : il génère une comparaison par valeur, contrairement à une `class` classique qui compare les références. C’est ce qui en fait un excellent choix pour les DTO et les objets de valeur du métier.',
  },
  {
    id: 'poo-024',
    theme: 'poo',
    type: 'completer_code',
    difficulte: 2,
    enonce: 'Complétez ce code : un ensemble fermé de statuts et un objet de transport immuable.',
    codeAvecTrous: `// Ensemble fermé de valeurs nommées
public ___1___ StatutDemande { EnAttente, Validee, Refusee, Annulee }

// Objet de données immuable, comparé par valeur
public ___2___ DemandeDto(DateOnly DateDebut, DateOnly DateFin);`,
    choix: ['enum', 'record', 'class', 'struct', 'interface'],
    bonnesReponses: ['enum', 'record'],
    explication:
      'L’`enum` ferme l’ensemble des valeurs possibles ; le `record` déclaré en une ligne génère le constructeur, les propriétés en lecture seule, l’égalité par valeur et un affichage lisible. Les deux réduisent la quantité de code à écrire et à tester.',
  },
  {
    id: 'poo-025',
    theme: 'poo',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Pourquoi éviter de concaténer des chaînes dans une boucle de plusieurs milliers d’itérations ?',
    options: [
      'Parce que `string` est immuable : chaque concaténation crée une nouvelle chaîne et recopie tout le contenu',
      'Parce que le compilateur refuse les concaténations dans une boucle',
      'Parce que la taille maximale d’une chaîne est de 1000 caractères',
      'Parce que la concaténation est interdite sur les types référence',
    ],
    bonneReponse: 0,
    explication:
      'Chaque tour de boucle alloue une nouvelle chaîne et recopie l’ancienne : le coût croît de façon quadratique. `StringBuilder` conserve un tampon modifiable et évite ces copies. Sur quelques concaténations, la différence est négligeable — c’est le volume qui fait le problème.',
  },
  {
    id: 'poo-026',
    theme: 'poo',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque relation à sa nature.',
    paires: [
      { gauche: 'Un Manager et un Salarie', droite: 'Héritage — « est un »' },
      { gauche: 'Un ServiceConges et un journal', droite: 'Composition — « a un »' },
      { gauche: 'Un ServiceConges et un IDemandeRepository', droite: 'Composition par injection de dépendance' },
      { gauche: 'Une Commande et ses LigneCommande', droite: 'Composition forte — les parties disparaissent avec le tout' },
    ],
    explication:
      'La composition par injection est ce qui rend le Service testable : on lui passe un faux dépôt en test, sans qu’il sache que ce n’est pas le vrai. C’est le bénéfice concret du principe d’inversion des dépendances.',
  },
];
