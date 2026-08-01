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
      'Complétez ce pseudo-code qui applique l’inversion des dépendances : la couche métier ne connaît qu’un contrat.',
    codeAvecTrous: `___1___ IDepotDemande :
    enregistrer(demande)
    listerParSalarie(idSalarie)

classe ServiceConges :
    depot : ___2___          # on déclare le contrat, pas la classe concrète

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
      'Le service déclare ce dont il a besoin (le contrat) et le reçoit de l’extérieur. En production on lui passe le dépôt qui parle à la base, en test un dépôt en mémoire — sans modifier une ligne du service. Ce contrat s’appelle interface en C# ou Java, protocole en Swift, classe abstraite en Python ; le principe ne change pas.',
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
];
