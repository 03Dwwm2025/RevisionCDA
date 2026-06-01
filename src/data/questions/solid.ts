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
      { gauche: 'S — Single Responsibility', droite: 'Une classe = une seule raison de changer' },
      { gauche: 'O — Open/Closed', droite: 'Ouvert à l\'extension, fermé à la modification' },
      { gauche: 'L — Liskov Substitution', droite: 'Une classe enfant doit pouvoir remplacer son parent sans rien casser' },
      { gauche: 'D — Dependency Inversion', droite: 'Dépendre d\'abstractions (interfaces), pas d\'implémentations concrètes' },
    ],
    explication:
      'Astuce : S=Une responsabilité, O=Étendre sans modifier, L=Substitution parent/enfant, I=Interfaces spécifiques, D=Dépendre d\'abstractions. Le D est au cœur de l\'injection de dépendances en ASP.NET Core.',
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
    enonce: 'Complétez ce code ASP.NET Core qui applique la **Dependency Inversion** via l\'injection de dépendances.',
    codeAvecTrous: `// Interface (abstraction)
public ___1___ IServiceConges
{
    Resultat Deposer(int idSalarie, DateOnly debut, DateOnly fin);
}

// Implémentation concrète
public class ServiceConges : ___2___
{
    private readonly IDemandeRepository _repo;
    public ServiceConges(___3___ repo) => _repo = repo;
    public Resultat Deposer(int id, DateOnly d, DateOnly f) { /* ... */ return Resultat.Ok(); }
}`,
    choix: ['interface', 'class', 'abstract', 'IServiceConges', 'ServiceConges', 'IDemandeRepository', 'DemandeRepository'],
    bonnesReponses: ['interface', 'IServiceConges', 'IDemandeRepository'],
    explication:
      '`interface IServiceConges` définit le contrat. `ServiceConges : IServiceConges` en est l\'implémentation. Le constructeur reçoit `IDemandeRepository` (abstraction), pas `DemandeRepository` (concret) : c\'est la DIP. On peut ainsi substituer un faux repository en tests.',
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
    enonce: 'En ASP.NET Core, enregistrer `services.AddScoped<IServiceConges, ServiceConges>()` est une application du principe de Dependency Inversion.',
    bonneReponse: true,
    explication:
      'Le conteneur d\'injection résoudra automatiquement `IServiceConges` en injectant `ServiceConges`. Les contrôleurs et services qui déclarent `IServiceConges` dans leur constructeur ne connaissent que l\'abstraction — DIP en action.',
  },
  {
    id: 'solid-009',
    theme: 'solid',
    type: 'qcm',
    difficulte: 3,
    enonce: 'On veut ajouter un nouveau type de calcul de prime (ex. `PrimeTerrain`) sans modifier la classe `ServicePaie` existante. Quelle approche respecte le principe **Open/Closed** ?',
    options: [
      'Ajouter un `if (type == "terrain")` dans `ServicePaie.CalculerPrime()`',
      'Créer une interface `ICalculPrime` et faire implémenter `PrimeTerrain` par une nouvelle classe',
      'Rendre `ServicePaie` abstraite et forcer la surcharge de `CalculerPrime()`',
      'Dupliquer `ServicePaie` en `ServicePaieV2` avec le nouveau cas',
    ],
    bonneReponse: 1,
    explication:
      'OCP = étendre sans modifier. On crée `ICalculPrime` avec `decimal Calculer(Employe e)`, implémentée par `PrimeStandard`, `PrimeTerrain`, etc. `ServicePaie` reçoit l\'interface par injection : on ajoute un nouveau type sans toucher au code existant.',
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
