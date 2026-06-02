import type { Question } from '../../types/quiz';

export const questionsBackEnd: Question[] = [
  // --- Validation des données ---
  {
    id: 'back-001',
    theme: 'back-end',
    type: 'vrai_faux',
    difficulte: 1,
    enonce: 'La validation des données côté serveur est obligatoire même si le front-end valide déjà les données avant envoi.',
    bonneReponse: true,
    explication:
      'La validation front-end est du confort UX — elle peut être contournée en quelques secondes (Postman, curl, DevTools). La seule validation qui protège est celle du serveur. Il faut les deux, mais la validation serveur est la vraie ligne de défense.',
  },
  {
    id: 'back-002',
    theme: 'back-end',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque Data Annotation à ce qu\'elle valide.',
    paires: [
      { gauche: '[Required]', droite: 'Champ obligatoire — non null, non vide' },
      { gauche: '[EmailAddress]', droite: 'Format e-mail valide (contient @ et un domaine)' },
      { gauche: '[Range(0, 100)]', droite: 'Valeur numérique comprise entre 0 et 100' },
      { gauche: '[MaxLength(50)]', droite: 'Longueur maximale de 50 caractères' },
    ],
    explication:
      'Les Data Annotations en C# s\'appliquent sur les propriétés des DTO. ASP.NET Core les vérifie automatiquement et remplit `ModelState`. Si `ModelState.IsValid` est false, on retourne `BadRequest(ModelState)` (400) avec les messages d\'erreur.',
  },
  {
    id: 'back-003',
    theme: 'back-end',
    type: 'completer_code',
    difficulte: 2,
    enonce: 'Complétez ce DTO C# avec les Data Annotations de validation appropriées.',
    codeAvecTrous: `public class InscriptionDto
{
    ___1___
    [MaxLength(50)]
    public string Nom { get; set; } = "";

    ___2___
    public string Email { get; set; } = "";

    [Required]
    ___3___
    [RegularExpression(@"^(?=.*[A-Z])(?=.*\\d).{8,}$")]
    public string MotDePasse { get; set; } = "";
}`,
    choix: ['[Required]', '[Optional]', '[NotNull]', '[EmailAddress]', '[Email]', '[ValidEmail]', '[MinLength(8)]', '[MinLength(6)]', '[Length(8)]'],
    bonnesReponses: ['[Required]', '[EmailAddress]', '[MinLength(8)]'],
    explication:
      '`[Required]` rend le champ obligatoire. `[EmailAddress]` valide le format e-mail. `[MinLength(8)]` impose une longueur minimale. La regex `(?=.*[A-Z])(?=.*\\d)` est un lookahead qui vérifie qu\'il y a au moins une majuscule et un chiffre. Ces attributs sont vérifiés via `ModelState.IsValid` dans le Controller.',
  },
  {
    id: 'back-004',
    theme: 'back-end',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Dans un Controller ASP.NET Core avec `[ApiController]`, que se passe-t-il si `ModelState.IsValid` est `false` et qu\'on ne le vérifie pas explicitement ?',
    options: [
      'ASP.NET Core retourne automatiquement un 400 Bad Request avant même d\'entrer dans la méthode',
      'La requête est traitée normalement, sans erreur',
      'Une exception `InvalidModelStateException` est levée',
      'ASP.NET Core corrige automatiquement les données invalides',
    ],
    bonneReponse: 0,
    explication:
      'Avec `[ApiController]`, ASP.NET Core active le comportement de validation automatique : si les Data Annotations ne sont pas respectées, le framework retourne immédiatement un `400 Bad Request` avec le détail des erreurs dans `ModelState`, **avant d\'exécuter la méthode du controller**. C\'est l\'un des avantages de `[ApiController]`.',
  },

  // --- Gestion des erreurs ---
  {
    id: 'back-005',
    theme: 'back-end',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Pourquoi ne doit-on pas afficher la stack trace au client en production ?',
    options: [
      'Pour économiser de la bande passante',
      'Parce que la stack trace révèle la structure interne du code (chemins de fichiers, versions de librairies, noms de tables SQL) qui peut aider un attaquant',
      'Parce que les navigateurs ne peuvent pas afficher une stack trace',
      'Pour respecter une contrainte de performance d\'ASP.NET Core',
    ],
    bonneReponse: 1,
    explication:
      'Une stack trace expose des informations précieuses : chemin absolu des fichiers, version du framework, requêtes SQL, noms de classes… C\'est du renseignement gratuit pour un attaquant. En production, on utilise `app.UseExceptionHandler("/error")` qui retourne un message générique. En dev, `app.UseDeveloperExceptionPage()` affiche la stack trace compète.',
  },
  {
    id: 'back-006',
    theme: 'back-end',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Le middleware `UseAuthentication` doit être placé **avant** `UseAuthorization` dans le pipeline ASP.NET Core.',
    bonneReponse: true,
    explication:
      'L\'ordre des middlewares est strict. `UseAuthentication` identifie l\'utilisateur (lit et valide le JWT, remplit `HttpContext.User`). `UseAuthorization` vérifie ensuite les droits de cet utilisateur (`[Authorize]`, rôles). Si l\'ordre est inversé, l\'autorisation est vérifiée avant que l\'identité soit établie — les routes protégées seraient accessibles à tous.',
  },
  {
    id: 'back-007',
    theme: 'back-end',
    type: 'remettre_ordre',
    difficulte: 2,
    enonce: 'Remettez dans l\'ordre les middlewares ASP.NET Core du plus externe au plus interne (ordre dans `Program.cs`).',
    elements: [
      'UseExceptionHandler — capture toutes les exceptions non gérées',
      'UseHttpsRedirection — force HTTPS',
      'UseCors — politique CORS',
      'UseAuthentication — vérifie le JWT, identifie l\'utilisateur',
      'UseAuthorization — vérifie les droits ([Authorize])',
      'MapControllers — route vers les controllers',
    ],
    explication:
      'L\'exception handler doit être en premier pour capturer les erreurs des autres middlewares. HTTPS ensuite. CORS avant l\'auth. Authentication avant Authorization. MapControllers en dernier : c\'est l\'endpoint final. Chaque middleware englobe les suivants comme des poupées russes.',
  },

  // --- Configuration ---
  {
    id: 'back-008',
    theme: 'back-end',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Où doit-on stocker un secret comme la clé JWT (`Jwt:Secret`) dans une application ASP.NET Core ?',
    options: [
      'Dans `appsettings.json` pour que tous les développeurs y aient accès',
      'En dur dans le code C# pour éviter tout fichier externe',
      'Dans une variable d\'environnement sur le serveur ou un gestionnaire de secrets',
      'Dans la base de données dans une table `Configuration`',
    ],
    bonneReponse: 2,
    explication:
      '`appsettings.json` est commité dans Git — visible de toute l\'équipe (et potentiellement public). Un secret en dur dans le code est encore pire. Les variables d\'environnement existent uniquement sur le serveur d\'exécution avec des droits restreints. En local : `dotnet user-secrets`. En prod : variables d\'env ou coffre (Azure Key Vault, HashiCorp Vault).',
  },
  {
    id: 'back-009',
    theme: 'back-end',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque fichier de configuration ASP.NET Core à son rôle.',
    paires: [
      { gauche: '`appsettings.json`', droite: 'Configuration de base, commité dans Git, sans secrets' },
      { gauche: '`appsettings.Development.json`', droite: 'Surcharges pour le développement local, commité' },
      { gauche: 'Variables d\'environnement', droite: 'Secrets et config de production, jamais committés' },
      { gauche: 'User Secrets (`dotnet user-secrets`)', droite: 'Secrets locaux du développeur, hors du repo' },
    ],
    explication:
      'ASP.NET Core fusionne les sources dans l\'ordre : `appsettings.json` < `appsettings.{env}.json` < variables d\'environnement. Les variables d\'env ont la priorité la plus haute et écrasent ce qui est dans les fichiers JSON — c\'est ce mécanisme qui permet d\'avoir des secrets en prod sans les commiter.',
  },

  // --- Logging ---
  {
    id: 'back-010',
    theme: 'back-end',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque niveau de log à son utilisation.',
    paires: [
      { gauche: 'LogDebug', droite: 'Informations de débogage détaillées — uniquement en développement' },
      { gauche: 'LogInformation', droite: 'Événements normaux du flux applicatif (connexion, création)' },
      { gauche: 'LogWarning', droite: 'Situation anormale mais non bloquante (tentative suspecte)' },
      { gauche: 'LogError', droite: 'Erreur qui a empêché une opération (exception SQL, timeout)' },
    ],
    explication:
      'En production, le niveau minimum est généralement `Information` (on ne veut pas `Debug` qui est très verbeux). `Warning` et `Error` génèrent des alertes. `Critical` signale une défaillance système complète. La hiérarchie : Trace < Debug < Information < Warning < Error < Critical.',
  },
  {
    id: 'back-011',
    theme: 'back-end',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Il est acceptable de logger le mot de passe d\'un utilisateur (même haché) pour faciliter le débogage des erreurs d\'authentification.',
    bonneReponse: false,
    explication:
      'Jamais. Le hash du mot de passe est une donnée sensible — si quelqu\'un accède aux logs, il peut tenter des attaques hors ligne. Les logs doivent contenir l\'événement ("connexion échouée pour user@example.com") sans aucune donnée secrète. OWASP A09 : les logs sont une surface d\'attaque à ne pas négliger.',
  },
  {
    id: 'back-012',
    theme: 'back-end',
    type: 'completer_code',
    difficulte: 2,
    enonce: 'Complétez ce middleware pipeline ASP.NET Core dans le bon ordre.',
    codeAvecTrous: `var app = builder.Build();

app.___1___("/error");    // 1. Capturer les exceptions
app.UseHttpsRedirection();            // 2. Forcer HTTPS
app.___2___();             // 3. Identifier l'utilisateur (JWT)
app.UseAuthorization();               // 4. Vérifier les droits
app.___3___();             // 5. Router vers les controllers

app.Run();`,
    choix: ['UseExceptionHandler', 'UseErrorPage', 'UseDeveloperException', 'UseAuthentication', 'UseJwt', 'UseIdentity', 'MapControllers', 'UseControllers', 'UseRouting'],
    bonnesReponses: ['UseExceptionHandler', 'UseAuthentication', 'MapControllers'],
    explication:
      '`UseExceptionHandler` en premier pour englober tout le pipeline. `UseAuthentication` avant `UseAuthorization` (identifier avant d\'autoriser). `MapControllers` en dernier — c\'est l\'endpoint final qui appelle la méthode du controller. L\'ordre est une convention stricte : en changer peut créer des failles de sécurité ou des erreurs silencieuses.',
  },
  {
    id: 'back-013',
    theme: 'back-end',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Quelle est la différence entre la **validation** (Data Annotations, ModelState) et la **logique métier** (Service) ?',
    options: [
      'La validation vérifie le format des données ; la logique métier vérifie les règles business — les deux doivent être dans le Controller',
      'La validation vérifie le format et le type des données (côté Controller) ; la logique métier vérifie les règles applicatives (solde suffisant, chevauchement de dates) — côté Service',
      'La validation est uniquement côté front-end ; la logique métier est côté serveur',
      'Il n\'y a pas de différence — tout peut être mis dans les Data Annotations',
    ],
    bonneReponse: 1,
    explication:
      'Les Data Annotations vérifient le **format** : champ non vide, e-mail valide, longueur respectée. Le Service vérifie les **règles métier** : est-ce que le salarié a assez de solde ? Y a-t-il un chevauchement avec une autre demande ? Ces règles dépendent du contexte (autres données en base) et ne peuvent pas être exprimées avec des annotations simples. La séparation Controller/Service suit ce découpage.',
  },
];
