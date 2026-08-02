import type { Question } from '../../types/quiz';

export const questionsPOO: Question[] = [
  // --- Vocabulaire de base ---
  {
    id: 'poo-001',
    theme: 'poo',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Que réalise une ligne du type `eleve = nouveau Eleve()` ?',
    options: [
      'Une instanciation : déclaration et création de l’objet en une seule ligne',
      'Une déclaration : simple réservation d’un nom de variable',
      'Une initialisation : première valeur donnée à une variable existante',
      'Une affectation : nouvelle valeur donnée à une variable existante',
    ],
    bonneReponse: 0,
    explication:
      'L’instanciation combine la déclaration et la création. Écrire d’abord `Eleve eleve;` puis `eleve = nouveau Eleve()` sépare les deux étapes : la première déclare, la seconde crée l’objet en mémoire et en range la référence dans la variable.',
  },
  {
    id: 'poo-011',
    theme: 'poo',
    type: 'qcm',
    difficulte: 1,
    enonce:
      'Comment exposer une donnée d’un objet en lecture seule pour l’extérieur, tout en la laissant modifiable à l’intérieur de la classe ?',
    options: [
      'Garder le champ privé et n’exposer qu’un accesseur en lecture',
      'Rendre le champ public : c’est plus simple et le résultat est le même',
      'Exposer un accesseur en lecture et un accesseur en écriture publics',
      'Déclarer le champ constant, pour qu’il ne change jamais',
    ],
    bonneReponse: 0,
    explication:
      'C’est l’encapsulation : les données restent privées, seul ce qui doit sortir est exposé, et uniquement en lecture. Le champ reste modifiable par les méthodes de la classe, qui peuvent faire respecter les règles. La syntaxe varie — propriété à accesseur privé en C#, méthode `get` en Java, propriété calculée en Python — le principe est identique.',
  },

  // --- Encapsulation et visibilité ---
  {
    id: 'poo-002',
    theme: 'poo',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Quel niveau de visibilité rend un membre accessible uniquement depuis sa propre classe ?',
    options: ['private', 'protected', 'public', 'package / interne'],
    bonneReponse: 0,
    explication:
      '`private` limite l’accès à la classe elle-même, `protected` l’étend aux classes filles, `public` l’ouvre à tout le monde. Le quatrième niveau porte un nom différent selon les langages (interne à l’assemblage en C#, au paquet en Java) et couvre l’unité de compilation. La règle : commencer au plus fermé, ouvrir seulement quand c’est nécessaire.',
  },
  {
    id: 'poo-010',
    theme: 'poo',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Que signifie qu’un membre est déclaré statique ?',
    options: [
      'Il appartient à la classe, pas aux instances : on l’utilise sans créer d’objet',
      'Il est immuable une fois affecté',
      'Il est automatiquement hérité par les classes filles',
      'Il n’est visible que dans le fichier courant',
    ],
    bonneReponse: 0,
    explication:
      'Un membre statique existe en un seul exemplaire, partagé par toute l’application : une fonction utilitaire de calcul, un compteur global. À ne pas confondre avec une constante, qui décrit une valeur figée. Attention : un état statique modifiable est un état global, avec tous les problèmes que ça pose en accès concurrent.',
  },

  // --- Constructeur ---
  {
    id: 'poo-005',
    theme: 'poo',
    type: 'vrai_faux',
    difficulte: 1,
    enonce: 'Une classe peut offrir plusieurs façons différentes d’initialiser un objet.',
    bonneReponse: true,
    explication:
      'On propose plusieurs points d’entrée selon les informations disponibles : une demande construite avec deux dates, ou avec une seule pour un jour isolé. Les langages à surcharge (C#, Java) déclarent plusieurs constructeurs de signatures différentes ; Python ou JavaScript obtiennent le même résultat avec des paramètres par défaut ou des méthodes de fabrique nommées.',
  },

  // --- Héritage ---
  {
    id: 'poo-004',
    theme: 'poo',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'Pourquoi la plupart des langages objet interdisent-ils d’hériter de plusieurs classes à la fois, tout en autorisant plusieurs contrats (interfaces) ?',
    options: [
      'Parce que deux parents peuvent fournir la même méthode et rendre le comportement ambigu',
      'Parce que cela consommerait trop de mémoire',
      'Parce que le compilateur ne saurait pas allouer l’objet',
      'Parce que l’héritage multiple rend le code plus lent à l’exécution',
    ],
    bonneReponse: 0,
    explication:
      'C’est le problème dit du diamant : si deux parents proposent la même méthode, l’enfant ne sait plus laquelle utiliser. Une interface ne porte qu’un contrat, sans implémentation à choisir : on peut donc en cumuler autant qu’on veut. Les langages qui autorisent l’héritage multiple, comme C++ ou Python, imposent des règles explicites de résolution.',
  },
  {
    id: 'poo-003',
    theme: 'poo',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quelle affirmation distingue correctement une classe abstraite d’une interface ?',
    options: [
      'La classe abstraite peut porter un état et du code concret ; l’interface définit un contrat, sans état',
      'L’interface peut être instanciée directement, pas la classe abstraite',
      'Une classe peut hériter de plusieurs classes abstraites',
      'Il n’y a plus aucune différence dans les langages modernes',
    ],
    bonneReponse: 0,
    explication:
      'La classe abstraite est un modèle partiellement écrit : champs, constructeur, méthodes déjà implémentées, et un seul héritage possible. L’interface est un contrat pur, cumulable. Le repère : héritage pour un « est un » avec du code commun, interface pour un « sait faire ». Aucune des deux ne s’instancie directement.',
  },
  {
    id: 'poo-009',
    theme: 'poo',
    type: 'vrai_faux',
    difficulte: 2,
    enonce:
      'Redéfinir une méthode héritée devrait être signalé explicitement dans le code de la classe fille.',
    bonneReponse: true,
    explication:
      'Sans marque explicite, une faute de frappe dans le nom crée une nouvelle méthode au lieu de redéfinir l’ancienne, et le bug passe inaperçu. C# impose `override`, Java propose l’annotation `@Override` que le compilateur vérifie, Python n’a pas de mécanisme intégré — d’où la vigilance accrue dans ce cas.',
  },
  {
    id: 'poo-006',
    theme: 'poo',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque pilier de la POO à sa définition.',
    paires: [
      { gauche: 'Encapsulation', droite: 'Protéger les données et n’exposer que ce qui est nécessaire' },
      { gauche: 'Héritage', droite: 'Réutiliser et spécialiser sans dupliquer' },
      { gauche: 'Polymorphisme', droite: 'Même appel, comportement adapté au type réel de l’objet' },
      { gauche: 'Abstraction', droite: 'Masquer les détails derrière un contrat clair' },
    ],
    explication:
      'Encapsulation protège, héritage réutilise, polymorphisme adapte, abstraction simplifie. Le polymorphisme découle de l’héritage ou de l’implémentation d’un contrat : c’est ce qui permet d’écrire un code qui manipule des formes sans savoir s’il s’agit d’un cercle ou d’un carré.',
  },
  {
    id: 'poo-007',
    theme: 'poo',
    type: 'completer_code',
    difficulte: 2,
    enonce:
      'Complétez ce pseudo-code : le solde doit être inaccessible depuis l’extérieur de la classe, et modifiable uniquement par ses méthodes.',
    codeAvecTrous: `classe CompteBancaire :
    ___1___ solde : decimal        # même les classes filles n'y touchent pas

    ___2___ fonction lireSolde() : # seule lecture autorisée
        retourner ceci.solde

    ___2___ fonction deposer(montant) :
        si montant > 0 :
            ceci.solde ___3___ montant`,
    choix: ['prive', 'public', 'protege', '+=', '-=', '='],
    bonnesReponses: ['prive', 'public', '+='],
    explication:
      'Le niveau privé est le plus fermé : même une classe fille n’accède pas au champ. Le niveau protégé, lui, l’ouvrirait aux classes filles — ce n’est pas ce qu’on veut ici. Les méthodes, elles, sont publiques : elles forment la seule porte d’entrée, et font respecter la règle « un dépôt est positif ».',
  },
  {
    id: 'poo-012',
    theme: 'poo',
    type: 'completer_code',
    difficulte: 3,
    enonce: 'Complétez ce pseudo-code illustrant la classe abstraite et le polymorphisme.',
    codeAvecTrous: `___1___ classe Employe :          # ne peut pas être instanciée
    nom : texte

    ___1___ fonction calculerPrime()  # déclarée, sans corps
    fonction role() : retourner "Employé"

classe Manager ___2___ Employe :
    ___3___ fonction calculerPrime() : retourner 2000
    ___3___ fonction role() : retourner "Manager"`,
    choix: ['abstraite', 'finale', 'statique', 'herite de', 'implemente', 'contient', 'redefinit', 'surcharge'],
    bonnesReponses: ['abstraite', 'herite de', 'redefinit'],
    explication:
      'La classe abstraite pose le modèle commun et impose aux enfants d’écrire ce qui leur est propre. Un code qui manipule une liste d’employés appelle `calculerPrime()` sans savoir à qui il parle : chaque objet répond selon son type réel. C’est le polymorphisme, et c’est ce qui remplace une cascade de conditions sur le type.',
  },
  {
    id: 'poo-013',
    theme: 'poo',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Un langage objet permet en général d’interdire explicitement qu’une classe soit héritée.',
    bonneReponse: true,
    explication:
      'On ferme une classe quand on ne veut pas que son comportement soit détourné : une classe de sécurité, un objet valeur. Le mot-clé change — `sealed` en C#, `final` en Java, fermé par défaut en Kotlin — mais l’intention est la même. Fermer par défaut et ouvrir sciemment est même considéré comme la meilleure valeur par défaut.',
  },
  {
    id: 'poo-014',
    theme: 'poo',
    type: 'completer_code',
    difficulte: 3,
    enonce:
      'Complétez ce pseudo-code : la classe fille appelle le constructeur parent, puis enrichit une méthode héritée.',
    codeAvecTrous: `classe Manager herite de Employe :
    service : texte

    constructeur(nom, service) :
        ___1___(nom)                 # appel du constructeur parent
        ceci.service = service

    ___2___ fonction saluer() :
        retourner ___3___.saluer() + " Je manage " + ceci.service`,
    choix: ['parent', 'ceci', 'nouveau', 'redefinit', 'surcharge', 'statique'],
    bonnesReponses: ['parent', 'redefinit', 'parent'],
    explication:
      'Le constructeur parent initialise la part héritée avant que l’enfant n’ajoute la sienne. Rappeler la méthode du parent dans la version redéfinie évite de dupliquer son contenu. Selon le langage, le parent s’appelle `base`, `super` ou `parent` — le mécanisme est identique.',
  },
  {
    id: 'poo-015',
    theme: 'poo',
    type: 'qcm',
    difficulte: 3,
    enonce:
      'Une variable est déclarée du type parent mais contient un objet enfant. Quelle méthode s’exécute quand l’enfant a redéfini la méthode appelée ?',
    options: [
      'Celle de l’enfant : le choix se fait à l’exécution, sur le type réel de l’objet',
      'Celle du parent : le choix se fait à la compilation, sur le type déclaré',
      'Les deux, l’une après l’autre',
      'Cela dépend uniquement de l’ordre de déclaration des classes',
    ],
    bonneReponse: 0,
    explication:
      'C’est la liaison tardive, le mécanisme même du polymorphisme : le type réel de l’objet décide. Attention au piège inverse, le masquage : certains langages permettent de définir dans l’enfant une méthode qui cache celle du parent sans la redéfinir, et là c’est le type déclaré qui l’emporte — deux comportements très différents pour un code qui se ressemble.',
  },
  {
    id: 'poo-008',
    theme: 'poo',
    type: 'remettre_ordre',
    difficulte: 2,
    enonce: 'Remettez dans l’ordre les étapes pour exploiter le polymorphisme.',
    elements: [
      'Définir un contrat commun : classe parente ou interface',
      'Déclarer la méthode destinée à être redéfinie',
      'Faire hériter ou implémenter les classes filles',
      'Redéfinir la méthode dans chaque classe fille',
      'Manipuler les objets à travers le type commun, sans tester leur type réel',
    ],
    explication:
      'La dernière étape est celle qui apporte le bénéfice : le code appelant ne connaît que le contrat. Ajouter un nouveau type ne demande alors aucune modification du code existant — c’est le lien direct entre polymorphisme et principe ouvert/fermé.',
  },
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
      'La composition ne s’utilise que pour les contrats',
    ],
    bonneReponse: 0,
    explication:
      'Un manager EST UN salarié : l’héritage se justifie. Un service de congés A UN journal : c’est de la composition. La règle de métier est de préférer la composition — le lien est plus faible, remplaçable à l’exécution, et n’oblige pas à hériter de toute l’interface publique du parent.',
  },
  {
    id: 'poo-017',
    theme: 'poo',
    type: 'qcm',
    difficulte: 3,
    enonce:
      'Une sous-classe redéfinit une méthode héritée uniquement pour lever une erreur « opération non supportée ». Que révèle ce symptôme ?',
    options: [
      'Une violation du principe de substitution de Liskov : la sous-classe ne peut pas remplacer son parent',
      'Un manque de tests unitaires sur la classe parente',
      'Une mauvaise gestion des erreurs',
      'Un besoin d’ajouter un constructeur par défaut',
    ],
    bonneReponse: 0,
    explication:
      'Si un code qui manipule le parent casse lorsqu’on lui passe l’enfant, la hiérarchie est mal posée. C’est le signal qu’il fallait de la composition, ou un contrat plus fin — le principe de ségrégation des interfaces.',
  },
  {
    id: 'poo-018',
    theme: 'poo',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Une hiérarchie d’héritage de cinq niveaux est un signe de bonne conception objet.',
    bonneReponse: false,
    explication:
      'Au-delà de deux ou trois niveaux, plus personne ne sait d’où vient un comportement, et une modification dans une classe haute casse des enfants qu’on n’avait pas en tête. Une hiérarchie profonde signale en général un héritage utilisé pour réutiliser du code plutôt que pour exprimer un « est un ».',
  },

  // --- Copie de valeur et copie de référence ---
  {
    id: 'poo-019',
    theme: 'poo',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'Que vaut `a` après ce code, sachant que le nombre est un type simple : `a = 5 ; b = a ; b = 10` ?',
    options: ['5', '10', '15', 'indéfini'],
    bonneReponse: 0,
    explication:
      'Pour un type simple, l’affectation copie la valeur : les deux variables sont indépendantes. Pour un objet, c’est la référence qui est copiée : les deux variables désignent le même objet en mémoire, et modifier l’un se voit sur l’autre. C’est la source d’une bonne partie des bugs de débutant, dans tous les langages.',
  },
  {
    id: 'poo-020',
    theme: 'poo',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque famille de données au comportement de l’affectation.',
    paires: [
      { gauche: 'Nombres et booléens', droite: 'La valeur est copiée : les variables sont indépendantes' },
      { gauche: 'Objets, listes et dictionnaires', droite: 'La référence est copiée : deux variables, un seul objet' },
      { gauche: 'Chaînes de caractères', droite: 'Objets, mais immuables : toute modification crée une nouvelle chaîne' },
    ],
    explication:
      'La chaîne de caractères est le piège classique : c’est un objet, mais son immuabilité lui donne l’apparence d’une valeur simple. C’est aussi la raison pour laquelle concaténer dans une boucle coûte cher. Le vocabulaire change — types valeur et référence en C#, primitifs et objets en Java, immuables et mutables en Python — le comportement est le même.',
  },
  {
    id: 'poo-021',
    theme: 'poo',
    type: 'qcm',
    difficulte: 3,
    enonce:
      'Une fonction reçoit un objet en paramètre et modifie une de ses propriétés. L’appelant voit-il la modification ?',
    options: [
      'Oui : la référence a été copiée, mais elle désigne le même objet',
      'Non : les paramètres sont toujours entièrement copiés',
      'Oui, mais seulement si le paramètre est marqué comme modifiable',
      'Non, sauf si la fonction retourne l’objet',
    ],
    bonneReponse: 0,
    explication:
      'Modifier une propriété agit sur l’objet partagé, donc c’est visible chez l’appelant. En revanche, remplacer le paramètre lui-même par un nouvel objet ne change rien à l’extérieur : seule la copie locale de la référence pointe ailleurs. C’est cette nuance que les langages traitent avec des mots-clés dédiés — `ref` en C#, passage par référence explicite en PHP.',
  },
  {
    id: 'poo-022',
    theme: 'poo',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'Pourquoi remplacer un statut stocké en chaîne libre par une énumération ?',
    options: [
      'Parce que l’ensemble des valeurs devient fermé et vérifié dès la compilation : plus de faute de frappe possible',
      'Parce qu’une énumération occupe moins de place en base de données',
      'Parce que les chaînes de caractères sont dépréciées',
      'Parce que cela accélère les requêtes SQL',
    ],
    bonneReponse: 0,
    explication:
      'Avec une chaîne libre, « VALIDEE », « Validee » et « VALIDÉE » sont trois valeurs différentes, et le bug ne se voit qu’à l’exécution. L’énumération ferme l’ensemble des possibles et permet à l’outillage de signaler un cas oublié. Elle existe en C#, Java, TypeScript, PHP et Python.',
  },
  {
    id: 'poo-023',
    theme: 'poo',
    type: 'qcm',
    difficulte: 3,
    enonce:
      'Deux objets distincts portent exactement les mêmes valeurs. Par défaut, une comparaison d’égalité les considère comme :',
    options: [
      'Différents : la comparaison porte sur la référence, pas sur le contenu',
      'Identiques : la comparaison porte toujours sur le contenu',
      'Différents, sauf si les objets sont dans la même liste',
      'Identiques, sauf si les objets sont de types différents',
    ],
    bonneReponse: 0,
    explication:
      'Par défaut, comparer deux objets revient à demander « est-ce le même exemplaire ? ». Pour comparer le contenu, il faut le dire : redéfinir l’égalité, ou utiliser un type conçu pour ça — un `record` en C#, un `record` en Java, une `dataclass` en Python, un objet valeur en conception. C’est indispensable pour les objets de transport et les valeurs métier.',
  },
  {
    id: 'poo-024',
    theme: 'poo',
    type: 'completer_code',
    difficulte: 2,
    enonce: 'Complétez ce pseudo-code : un ensemble fermé de statuts et un objet valeur immuable.',
    codeAvecTrous: `# Ensemble fermé de valeurs nommées
___1___ StatutDemande = { EnAttente, Validee, Refusee, Annulee }

# Objet de transport : lecture seule, comparé sur son contenu
___2___ DemandeDto :
    dateDebut : date   ___3___
    dateFin   : date   ___3___`,
    choix: ['enumeration', 'classe', 'interface', 'objet valeur', 'service', 'en lecture seule', 'modifiable'],
    bonnesReponses: ['enumeration', 'objet valeur', 'en lecture seule'],
    explication:
      'L’énumération ferme l’ensemble des statuts possibles. L’objet valeur en lecture seule ne peut pas être modifié après création : on peut le passer entre couches sans craindre qu’un appelant le change en route, et le comparer sur son contenu plutôt que sur son identité.',
  },
  {
    id: 'poo-025',
    theme: 'poo',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'Pourquoi éviter de concaténer des chaînes de caractères dans une boucle de plusieurs milliers d’itérations ?',
    options: [
      'Parce que les chaînes sont immuables : chaque concaténation crée une nouvelle chaîne et recopie tout le contenu',
      'Parce que le compilateur refuse les concaténations dans une boucle',
      'Parce que la taille maximale d’une chaîne est limitée à 1000 caractères',
      'Parce que la concaténation est interdite sur les objets',
    ],
    bonneReponse: 0,
    explication:
      'Chaque tour alloue une nouvelle chaîne et recopie l’ancienne : le coût croît de façon quadratique. La parade est un tampon modifiable — `StringBuilder` en C# et Java, `join` sur une liste en Python, tableau puis `join` en JavaScript. Sur quelques concaténations, la différence est négligeable : c’est le volume qui crée le problème.',
  },
  {
    id: 'poo-026',
    theme: 'poo',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque relation à sa nature.',
    paires: [
      { gauche: 'Un manager et un salarié', droite: 'Héritage — « est un »' },
      { gauche: 'Un service et son journal', droite: 'Composition — « a un »' },
      { gauche: 'Un service et son dépôt de données', droite: 'Composition par injection de dépendance' },
      { gauche: 'Une commande et ses lignes', droite: 'Composition forte — les parties disparaissent avec le tout' },
    ],
    explication:
      'La composition par injection est ce qui rend la couche métier testable : on lui passe un faux dépôt en test, sans qu’elle sache que ce n’est pas le vrai. C’est le bénéfice concret du principe d’inversion des dépendances.',
  },
];
