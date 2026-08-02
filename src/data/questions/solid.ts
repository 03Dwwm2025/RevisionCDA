import type { Question } from '../../types/quiz';

export const questionsSOLID: Question[] = [
  // --- Les 5 principes SOLID ---
  {
    id: 'solid-001',
    theme: 'solid',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque lettre de SOLID au principe correspondant.',
    paires: [
      { gauche: 'S — Single Responsibility', droite: 'Une classe, une seule raison de changer' },
      { gauche: 'O — Open/Closed', droite: 'Ouvert à l’extension, fermé à la modification' },
      { gauche: 'L — Liskov Substitution', droite: 'Une classe enfant doit pouvoir remplacer son parent sans rien casser' },
      { gauche: 'D — Dependency Inversion', droite: 'Dépendre d’abstractions, pas d’implémentations concrètes' },
    ],
    explication:
      'Moyen mnémotechnique : une responsabilité, étendre sans modifier, substitution parent-enfant, interfaces spécifiques, dépendre d’abstractions. Le D est le principe derrière l’injection de dépendances, quel que soit le langage.',
  },
  {
    id: 'solid-002',
    theme: 'solid',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Quel principe SOLID est violé si une classe `RapportConges` gère à la fois le calcul des congés **et** l\'envoi d\'e-mails de notification ?',
    options: [
      'Open/Closed',
      'Single Responsibility',
      'Liskov Substitution',
      'Interface Segregation',
    ],
    bonneReponse: 1,
    explication:
      'SRP : chaque classe a une seule responsabilité. Ici, `RapportConges` a deux raisons de changer : si le calcul évolue, ou si le format d\'e-mail change. Solution : séparer en `ServiceConges` et `ServiceNotification`.',
  },
  {
    id: 'solid-003',
    theme: 'solid',
    type: 'vrai_faux',
    difficulte: 1,
    enonce: 'Le principe Open/Closed signifie qu\'on ne doit jamais modifier une classe existante sous peine de casser l\'application.',
    bonneReponse: false,
    explication:
      'Non : OCP dit qu\'on préfère **étendre** (nouvelle classe, nouvel héritage ou implémentation) plutôt que modifier le code existant stabilisé. Corriger un bug ou une feature dans une classe est normal ; OCP vise à éviter de modifier ce qui fonctionne quand on ajoute un nouveau comportement.',
  },
  {
    id: 'solid-004',
    theme: 'solid',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quelle situation viole le principe de **substitution de Liskov** ?',
    options: [
      'Une classe `Manager` hérite de `Employe` et ajoute une méthode `ValiderDemande()`',
      'Une classe `Carre` hérite de `Rectangle` et lève une exception si `Largeur ≠ Hauteur`',
      'Une classe `ServiceCongesPro` implémente l\'interface `IServiceConges`',
      'Une méthode `Deposer()` retourne un objet `Resultat` au lieu de `void`',
    ],
    bonneReponse: 1,
    explication:
      'LSP : substituer un enfant à son parent ne doit pas changer le comportement attendu. `Carre extends Rectangle` viole LSP car un carré ne peut pas avoir des côtés indépendants — la contrainte de `Rectangle` (largeur ≠ hauteur possible) est brisée. C\'est l\'exemple canonique.',
  },
  {
    id: 'solid-005',
    theme: 'solid',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quel principe SOLID recommande de découper `IEntite` (qui expose `Sauvegarder()`, `Envoyer()`, `Imprimer()`) en trois interfaces distinctes ?',
    options: [
      'Single Responsibility',
      'Open/Closed',
      'Interface Segregation',
      'Dependency Inversion',
    ],
    bonneReponse: 2,
    explication:
      'ISP : une classe ne doit pas être forcée d\'implémenter des méthodes qu\'elle n\'utilise pas. Une `Demande` a besoin de `Sauvegarder()` mais pas de `Imprimer()`. Mieux : `ISauvegardable`, `IEnvoyable`, `IImprimable`.',
  },
  {
    id: 'solid-006',
    theme: 'solid',
    type: 'completer_code',
    difficulte: 2,
    enonce:
      'Complétez ce pseudo-code qui applique l’inversion des dépendances : la couche métier ne doit dépendre d’aucune classe concrète.',
    codeAvecTrous: `___1___ IDepotDemande :
    enregistrer(demande)
    listerParSalarie(idSalarie)

classe ServiceConges :
    depot : ___2___          # ce qu'on déclare, ce n'est pas la classe concrète

    constructeur(depot) :    # la dépendance est reçue, pas créée
        ceci.depot = depot

# En production
service = nouveau ServiceConges(nouveau ___3___())
# En test
service = nouveau ServiceConges(nouveau DepotEnMemoire())`,
    choix: [
      'contrat',
      'classe',
      'enumeration',
      'IDepotDemande',
      'DepotDemandeSql',
      'ServiceConges',
      'DepotEnMemoire',
    ],
    bonnesReponses: ['contrat', 'IDepotDemande', 'DepotDemandeSql'],
    explication:
      'Le service déclare ce dont il a besoin et le reçoit de l’extérieur. En production on lui passe le dépôt qui parle à la base, en test un dépôt en mémoire — sans modifier une ligne du service. Ce contrat s’appelle interface en C# ou Java, protocole en Swift, classe abstraite en Python ; le principe ne change pas.',
  },
  {
    id: 'solid-007',
    theme: 'solid',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque principe DRY/KISS/YAGNI à sa définition.',
    paires: [
      { gauche: 'DRY', droite: 'Ne pas dupliquer la logique : une information a une seule source de vérité' },
      { gauche: 'KISS', droite: 'Préférer la solution la plus simple qui fonctionne' },
      { gauche: 'YAGNI', droite: 'Ne pas coder ce dont on n\'a pas encore besoin' },
      { gauche: 'SRP (rappel)', droite: 'Une classe, une seule raison de changer' },
    ],
    explication:
      'DRY évite les bugs de synchronisation (corriger au même endroit). KISS réduit la complexité accidentelle. YAGNI évite le sur-engineering (feature hypothétique = dette technique). Ces trois principes se complètent avec SOLID.',
  },
  {
    id: 'solid-008',
    theme: 'solid',
    type: 'vrai_faux',
    difficulte: 1,
    enonce:
      'Déclarer dans un conteneur d’injection qu’un contrat se résout vers une implémentation concrète est une application de l’inversion des dépendances.',
    bonneReponse: true,
    explication:
      'Le conteneur fait le lien à un seul endroit ; tout le reste du code ne manipule que le contrat. Changer d’implémentation revient à changer cette ligne de configuration. Les cadriciels modernes fournissent tous ce mécanisme, sous des noms différents — conteneur de services, injecteur, fournisseur.',
  },
  {
    id: 'solid-009',
    theme: 'solid',
    type: 'qcm',
    difficulte: 3,
    enonce:
      'On veut ajouter un nouveau mode de calcul de prime sans modifier le service de paie existant. Quelle approche respecte le principe ouvert/fermé ?',
    options: [
      'Définir un contrat de calcul et créer une nouvelle implémentation pour ce mode',
      'Ajouter une condition sur le type de prime dans la méthode de calcul existante',
      'Rendre le service abstrait et forcer chaque sous-classe à redéfinir le calcul',
      'Dupliquer le service de paie en une seconde version qui gère le nouveau cas',
    ],
    bonneReponse: 0,
    explication:
      'Ouvert à l’extension, fermé à la modification : le service reçoit un calculateur qui respecte le contrat, et ajouter un mode revient à écrire une nouvelle classe sans toucher au code existant, donc sans risque de régression. Empiler des conditions fait grossir une méthode que chaque ajout oblige à retester en entier.',
  },
  {
    id: 'solid-010',
    theme: 'solid',
    type: 'remettre_ordre',
    difficulte: 2,
    enonce: 'Remettez dans l\'ordre les étapes pour refactorer une classe qui viole SRP.',
    elements: [
      'Identifier les responsabilités distinctes dans la classe actuelle',
      'Créer une nouvelle classe pour chaque responsabilité extraite',
      'Définir une interface pour chaque nouvelle classe si besoin',
      'Injecter les nouvelles classes dans la classe d\'origine (DIP)',
      'Supprimer le code extrait de la classe d\'origine',
    ],
    explication:
      'Ce refactoring suit le pattern Extract Class. L\'ordre compte : on identifie d\'abord, on extrait ensuite, on câble via injection. Supprimer le code original en dernier minimise les régressions.',
  },
  {
    id: 'solid-011',
    theme: 'solid',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Pourquoi la **testabilité** est-elle un signe qu\'une classe respecte bien SOLID ?',
    options: [
      'Parce que les classes SOLID sont plus courtes et donc plus faciles à lire',
      'Parce que SRP et DIP permettent d\'isoler chaque composant et d\'injecter des faux (mocks) en test',
      'Parce que les tests unitaires ne fonctionnent qu\'avec des classes respectant LSP',
      'Parce qu\'une classe testable doit impérativement implémenter au moins une interface',
    ],
    bonneReponse: 1,
    explication:
      'SRP garantit que la classe fait une seule chose → test focalisé. DIP garantit que les dépendances sont des interfaces → on peut injecter un `FakeRepository` en test sans toucher à la BDD. Si une classe est difficile à tester, c\'est souvent le signe d\'une violation de SRP ou DIP.',
  },
  {
    id: 'solid-012',
    theme: 'solid',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'Une classe s’appelle `GestionnaireUtilisateur` et compte 900 lignes. Quel principe est le plus directement mis en cause ?',
    options: [
      'La responsabilité unique : le nom vague trahit une classe qui fait plusieurs métiers',
      'L’inversion des dépendances : la classe est trop concrète',
      'La substitution de Liskov : la classe est trop grande pour être héritée',
      'Aucun : la taille d’une classe n’est pas un critère',
    ],
    bonneReponse: 0,
    explication:
      'Un nom qu’on ne peut pas rendre plus précis (« gestionnaire », « manager », « helper », « utils ») signale en général une classe qui a absorbé plusieurs responsabilités. Le test : essayer de la décrire en une phrase sans « et ». Si c’est impossible, il y a plusieurs raisons de la modifier, donc plusieurs classes.',
  },
  {
    id: 'solid-013',
    theme: 'solid',
    type: 'qcm',
    difficulte: 3,
    enonce:
      'Chaque ajout d’un nouveau type de document oblige à modifier la même longue suite de conditions. Quel principe est violé, et quelle est la parade ?',
    options: [
      'Ouvert/fermé : remplacer les conditions par un contrat que chaque type implémente',
      'Responsabilité unique : découper la fonction en plusieurs fonctions plus courtes',
      'Ségrégation des interfaces : créer une interface par type de document',
      'Inversion des dépendances : injecter la liste des types dans la fonction',
    ],
    bonneReponse: 0,
    explication:
      'Le symptôme est le code existant qu’on rouvre à chaque ajout, avec le risque de régression qui va avec. Remplacer la suite de conditions par un contrat rend l’ajout purement additif : une nouvelle classe, et pas une ligne modifiée dans le code déjà testé.',
  },
  {
    id: 'solid-014',
    theme: 'solid',
    type: 'vrai_faux',
    difficulte: 2,
    enonce:
      'Une classe fille peut renforcer les conditions d’entrée d’une méthode héritée sans casser le principe de substitution de Liskov.',
    bonneReponse: false,
    explication:
      'Exiger davantage que le parent casse le contrat : un code qui fonctionnait avec le parent échoue avec l’enfant. La règle est l’inverse — une classe fille peut accepter plus large en entrée et garantir plus strict en sortie, mais pas le contraire.',
  },
  {
    id: 'solid-015',
    theme: 'solid',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'Quel signe indique qu’un contrat est trop large et devrait être découpé ?',
    options: [
      'Des classes l’implémentent en laissant certaines méthodes vides ou en levant une erreur',
      'Le contrat compte plus de deux méthodes',
      'Plusieurs classes implémentent le même contrat',
      'Le contrat est utilisé par la couche métier',
    ],
    bonneReponse: 0,
    explication:
      'C’est le signal de la ségrégation des interfaces : une classe forcée d’implémenter ce qu’elle ne sait pas faire annonce un contrat fourre-tout. Le nombre de méthodes n’est pas le critère — un contrat de cinq méthodes cohérentes est parfaitement sain.',
  },
  {
    id: 'solid-016',
    theme: 'solid',
    type: 'association',
    difficulte: 3,
    enonce: 'Associez chaque symptôme dans le code au principe SOLID qu’il met en défaut.',
    paires: [
      { gauche: 'Une classe qui change pour trois raisons différentes', droite: 'Responsabilité unique' },
      { gauche: 'Une suite de conditions rallongée à chaque nouveau cas', droite: 'Ouvert/fermé' },
      { gauche: 'Une méthode redéfinie pour lever « non supporté »', droite: 'Substitution de Liskov' },
      { gauche: 'Une classe qui construit elle-même sa connexion à la base', droite: 'Inversion des dépendances' },
    ],
    explication:
      'Les principes se repèrent mieux par leurs symptômes que par leur définition. En entretien, savoir citer le symptôme et la correction vaut bien plus que réciter les cinq intitulés.',
  },
  {
    id: 'solid-017',
    theme: 'solid',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'En quoi le respect de SOLID facilite-t-il concrètement l’écriture des tests ?',
    options: [
      'Les dépendances étant reçues et non créées, on peut les remplacer par des doublures',
      'Le code SOLID contient automatiquement moins de bugs',
      'Les principes imposent d’écrire les tests avant le code',
      'Une classe SOLID n’a pas besoin d’être testée',
    ],
    bonneReponse: 0,
    explication:
      'C’est le lien le plus tangible entre SOLID et le quotidien : une classe qui reçoit ses collaborateurs se teste sans base de données ni réseau. À l’inverse, une classe qui instancie elle-même ses dépendances est intestable sans monter toute l’infrastructure.',
  },
  {
    id: 'solid-018',
    theme: 'solid',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Que dit le principe DRY, et quelle est son erreur d’interprétation courante ?',
    options: [
      'Éviter la duplication de connaissance ; l’erreur est de factoriser deux codes qui se ressemblent par hasard',
      'Éviter la duplication de lignes ; toute répétition doit être factorisée',
      'Éviter d’écrire deux fois la même fonctionnalité dans deux projets',
      'Éviter les commentaires qui répètent ce que dit le code',
    ],
    bonneReponse: 0,
    explication:
      'DRY porte sur la connaissance, pas sur les caractères. Deux règles métier distinctes qui s’écrivent pareil aujourd’hui vont diverger demain : les avoir fusionnées oblige alors à ajouter un paramètre, puis une condition, et on obtient une fonction plus complexe que les deux d’origine.',
  },
  {
    id: 'solid-019',
    theme: 'solid',
    type: 'vrai_faux',
    difficulte: 2,
    enonce:
      'Le principe YAGNI invite à écrire dès maintenant les points d’extension dont on aura probablement besoin plus tard.',
    bonneReponse: false,
    explication:
      'YAGNI dit exactement l’inverse : on n’écrit pas ce dont on n’a pas besoin aujourd’hui. Une abstraction ajoutée « au cas où » est du code à maintenir et à tester pour un besoin hypothétique — et quand le vrai besoin arrive, il ressemble rarement à ce qu’on avait prévu.',
  },
  {
    id: 'solid-020',
    theme: 'solid',
    type: 'qcm',
    difficulte: 3,
    enonce:
      'Appliquer SOLID à la lettre sur un petit projet produit parfois un résultat pire. Pourquoi ?',
    options: [
      'Chaque abstraction ajoute une indirection : trop d’indirections rendent le code difficile à suivre',
      'Les principes sont incompatibles entre eux',
      'Les cadriciels modernes les appliquent déjà automatiquement',
      'Les principes ne valent que pour les langages compilés',
    ],
    bonneReponse: 0,
    explication:
      'Les principes servent à absorber le changement. Là où le changement n’arrive pas, l’abstraction ne coûte que de la lecture : trois fichiers et une interface pour une classe utilisée à un seul endroit. Le rasoir d’Ockham s’applique aussi aux principes de conception.',
  },
];
