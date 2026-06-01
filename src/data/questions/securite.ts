import type { Question } from '../../types/quiz';

export const questionsSecurite: Question[] = [
  {
    id: 'secu-001',
    theme: 'securite',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque rang OWASP Top 10 (2021) à son risque principal.',
    paires: [
      { gauche: 'A01 — Broken Access Control', droite: 'Accès non autorisé à des ressources en manipulant les paramètres' },
      { gauche: 'A03 — Injection', droite: 'Code malveillant injecté via les entrées (SQL, XSS, commande OS…)' },
      { gauche: 'A07 — Auth. Failures', droite: 'Mots de passe faibles, sessions mal gérées, brute force possible' },
      { gauche: 'A02 — Cryptographic Failures', droite: 'Données sensibles exposées : transit non chiffré, hachage faible' },
    ],
    explication:
      'A01 est le risque n°1 depuis 2021 (ex-A05). Broken Access Control = un utilisateur accède à des données d\'un autre en changeant un id dans l\'URL. A03 (Injection) était n°1 pendant des années. Ces 4 risques couvrent la majorité des failles exploitées en production.',
  },
  {
    id: 'secu-002',
    theme: 'securite',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Comment doit-on stocker les mots de passe des utilisateurs en base de données ?',
    options: [
      'En clair pour faciliter la récupération en cas d\'oubli',
      'Chiffrés (AES) pour pouvoir les déchiffrer si nécessaire',
      'Hachés avec un algorithme lent et salé (Argon2, bcrypt, PBKDF2)',
      'Encodés en Base64 pour masquer la valeur brute',
    ],
    bonneReponse: 2,
    explication:
      'Un mot de passe ne doit jamais être récupérable (ni en clair, ni chiffré). On stocke une **empreinte** calculée avec un algo lent (bcrypt, Argon2) + un **sel unique** par utilisateur. MD5 et SHA-1 sont à bannir : trop rapides, cassables par rainbow tables. Base64 n\'est pas du chiffrement.',
  },
  {
    id: 'secu-003',
    theme: 'securite',
    type: 'vrai_faux',
    difficulte: 1,
    enonce: 'La triade CIA (Confidentialité, Intégrité, Disponibilité) est le modèle de référence pour évaluer la sécurité d\'un système.',
    bonneReponse: true,
    explication:
      'CIA : **C**onfidentialité (seuls les autorisés accèdent aux données), **I**ntégrité (les données ne sont pas altérées sans détection), **D**isponibilité (le service reste accessible). Chaque mesure de sécurité renforce l\'un de ces trois axes. Exemple : HTTPS renforce C et I ; les sauvegardes renforcent D.',
  },
  {
    id: 'secu-004',
    theme: 'securite',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Qu\'est-ce qu\'une attaque **XSS** (Cross-Site Scripting) et comment s\'en protéger principalement ?',
    options: [
      'Injection de requêtes SQL via un formulaire ; protection : requêtes paramétrées',
      'Injection de JavaScript malveillant dans une page web vue par d\'autres utilisateurs ; protection : échapper le contenu affiché et CSP',
      'Usurpation d\'identité via un lien forgé ; protection : tokens anti-CSRF',
      'Interception du trafic réseau ; protection : HTTPS',
    ],
    bonneReponse: 1,
    explication:
      'XSS : un attaquant injecte `<script>` dans du contenu stocké ou reflété, exécuté dans le navigateur d\'une victime (vol de cookie, redirection…). React échappe automatiquement le JSX — éviter `dangerouslySetInnerHTML`. CSP (Content-Security-Policy) limite les origines de scripts autorisées.',
  },
  {
    id: 'secu-005',
    theme: 'securite',
    type: 'completer_code',
    difficulte: 2,
    enonce: 'Complétez ce code C# de hachage et vérification de mot de passe avec BCrypt.',
    codeAvecTrous: `// À l'inscription : hacher et stocker
string hash = BCrypt.Net.BCrypt.___1___(motDePasse);
// Stocker 'hash' en base, jamais 'motDePasse'

// À la connexion : vérifier
bool estValide = BCrypt.Net.BCrypt.___2___(saisie, hashStocke);
if (!estValide)
    return ___3___("Identifiants incorrects.");`,
    choix: ['HashPassword', 'Hash', 'Encrypt', 'Verify', 'Compare', 'Check', 'Unauthorized', 'Forbid', 'BadRequest'],
    bonnesReponses: ['HashPassword', 'Verify', 'Unauthorized'],
    explication:
      '`HashPassword` calcule le hash avec sel aléatoire intégré. `Verify` compare la saisie au hash stocké (recalcul du hash avec le sel extrait). `Unauthorized()` retourne 401. Ne jamais logger `motDePasse`, ne jamais stocker `hash` en clair dans les logs.',
  },
  {
    id: 'secu-006',
    theme: 'securite',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Qu\'est-ce que le principe du **moindre privilège** appliqué à une base de données ?',
    options: [
      'L\'utilisateur applicatif doit avoir uniquement les droits SELECT/INSERT/UPDATE/DELETE sur ses tables, sans droits d\'administration',
      'Chaque utilisateur final ne peut voir que ses propres données',
      'Le schéma de la base doit être chiffré pour limiter les accès',
      'Les mots de passe de la BDD doivent changer chaque mois',
    ],
    bonneReponse: 0,
    explication:
      'Le compte SQL utilisé par l\'application n\'a pas besoin de `CREATE TABLE`, `DROP`, `GRANT`… Si la BDD est compromise, l\'attaquant ne peut pas supprimer les tables ni créer des comptes admin. En complément : ce compte n\'a accès qu\'aux tables nécessaires à l\'app.',
  },
  {
    id: 'secu-007',
    theme: 'securite',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque faille à sa parade principale.',
    paires: [
      { gauche: 'Injection SQL', droite: 'Requêtes paramétrées ou ORM (jamais de concaténation)' },
      { gauche: 'XSS', droite: 'Échappement du contenu affiché + Content-Security-Policy' },
      { gauche: 'CSRF', droite: 'Token anti-CSRF + attribut cookie SameSite' },
      { gauche: 'SSRF', droite: 'Valider et filtrer les URL/IPs appelées par le serveur' },
    ],
    explication:
      'CSRF (Cross-Site Request Forgery) : un site malveillant déclenche une action sur un autre site où la victime est authentifiée. SameSite=Strict sur les cookies empêche leur envoi cross-site. SSRF (Server-Side Request Forgery) : l\'attaquant fait appeler une URL interne par le serveur (A10 OWASP).',
  },
  {
    id: 'secu-008',
    theme: 'securite',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Un secret (clé API, mot de passe BDD) stocké dans une variable d\'environnement sur le serveur est plus sûr que le même secret codé en dur dans le code source.',
    bonneReponse: true,
    explication:
      'Le code source est versionné (Git), partagé avec l\'équipe, potentiellement public. Une variable d\'environnement existe seulement sur le serveur d\'exécution, avec des droits d\'accès restreints. Mieux encore : un coffre-fort de secrets (HashiCorp Vault, AWS Secrets Manager, GitHub Secrets).',
  },
  {
    id: 'secu-009',
    theme: 'securite',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Quelle mesure protège spécifiquement contre **A01 — Broken Access Control** (le risque n°1 OWASP 2021) ?',
    options: [
      'Chiffrer toutes les communications avec HTTPS',
      'Vérifier côté serveur, à chaque requête, que l\'utilisateur connecté a le droit d\'accéder à la ressource demandée',
      'Hacher les mots de passe avec bcrypt',
      'Limiter le nombre de requêtes par minute (rate limiting)',
    ],
    bonneReponse: 1,
    explication:
      'A01 se produit quand un utilisateur authentifié peut accéder aux ressources d\'un autre en modifiant un identifiant dans l\'URL (ex. `GET /api/demandes/42` alors qu\'il ne devrait voir que les siennes). La parade : vérifier côté serveur que `idSalarie == utilisateur.Id` à chaque accès. Ne JAMAIS faire confiance au client.',
  },
  {
    id: 'secu-010',
    theme: 'securite',
    type: 'remettre_ordre',
    difficulte: 3,
    enonce: 'Remettez dans l\'ordre les étapes de la **Privacy by Design** dès l\'analyse des besoins (RGPD Art. 25).',
    elements: [
      'Identifier les données personnelles traitées et leur finalité',
      'Minimiser : ne collecter que les données strictement nécessaires',
      'Définir les durées de conservation et la procédure d\'effacement',
      'Concevoir les contrôles d\'accès (qui voit quoi) avant de coder',
      'Documenter les traitements dans le registre RGPD',
    ],
    explication:
      'Privacy by Design signifie intégrer la protection des données dès la conception, pas en rajout après. L\'ordre : identifier → minimiser → planifier l\'effacement → contrôler les accès → documenter. Chaque donnée inutile collectée est un risque et une responsabilité légale.',
  },
];
