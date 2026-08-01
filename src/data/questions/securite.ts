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
    enonce: 'Complétez ce pseudo-code d’inscription puis de connexion, avec un stockage sûr du mot de passe.',
    codeAvecTrous: `# À l'inscription : on ne stocke que l'empreinte
empreinte = ___1___(motDePasse)
depot.enregistrer(email, empreinte)

# À la connexion : on ne déchiffre pas, on compare
si ___2___(saisie, empreinteStockee) :
    retourner jetonDacces()
sinon :
    retourner reponse(___3___, "Identifiants incorrects.")`,
    choix: ['hacher', 'chiffrer', 'encoder', 'verifier', 'dechiffrer', 'comparerTexte', '401', '403', '500'],
    bonnesReponses: ['hacher', 'verifier', '401'],
    explication:
      'Le hachage est irréversible : on ne retrouve pas le mot de passe, on recalcule l’empreinte de la saisie et on la compare. Chiffrer serait une faute — une clé volée exposerait tous les comptes. Le 401 signale une authentification qui n’a pas abouti ; le message reste volontairement vague pour ne pas révéler si l’adresse existe.',
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
  // --- XSS ---
  {
    id: 'secu-011',
    theme: 'securite',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque type de XSS à l’endroit où vit la charge malveillante.',
    paires: [
      { gauche: 'XSS stocké', droite: 'En base de données, servi à tous les visiteurs' },
      { gauche: 'XSS réfléchi', droite: 'Dans l’URL, renvoyé tel quel dans la réponse' },
      { gauche: 'XSS DOM', droite: 'Uniquement côté client, sans passer par le serveur' },
    ],
    explication:
      'Le XSS stocké est le plus grave : la charge touche chaque lecteur, sans action de sa part. Le réfléchi demande de piéger la victime avec un lien. Le XSS DOM ne laisse aucune trace côté serveur, ce qui le rend difficile à détecter dans les journaux.',
  },
  {
    id: 'secu-012',
    theme: 'securite',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quelle est la protection principale contre le XSS ?',
    options: [
      'Échapper les données à l’affichage : utiliser `textContent` plutôt qu’`innerHTML`',
      'Chiffrer la base de données',
      'Utiliser HTTPS sur toutes les pages',
      'Interdire les caractères accentués dans les formulaires',
    ],
    bonneReponse: 0,
    explication:
      'La faille naît au moment où une donnée est interprétée comme du code par le navigateur. L’échappement en sortie est donc la défense de première ligne. La validation en entrée et la Content-Security-Policy sont les deuxième et troisième lignes — utiles, mais insuffisantes seules.',
  },
  {
    id: 'secu-013',
    theme: 'securite',
    type: 'completer_code',
    difficulte: 2,
    enonce: 'Complétez ce code JavaScript pour afficher sans risque un motif saisi par un utilisateur.',
    codeAvecTrous: `// Vulnérable : le navigateur interprète le contenu comme du HTML
zone.___1___ = demande.motif;

// Protégé : le contenu est traité comme du texte
zone.___2___ = demande.motif;`,
    choix: ['innerHTML', 'textContent', 'outerHTML', 'value', 'innerText'],
    bonnesReponses: ['innerHTML', 'textContent'],
    explication:
      '`innerHTML` analyse la chaîne comme du HTML : une balise `<img src=x onerror="...">` déclenche l’exécution du script. `textContent` insère la chaîne telle quelle, en échappant automatiquement les caractères spéciaux.',
  },
  {
    id: 'secu-014',
    theme: 'securite',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Dans quelle catégorie de l’OWASP Top 10 2021 le XSS est-il classé ?',
    options: [
      'A03 — Injection, avec l’injection SQL',
      'A01 — Broken Access Control',
      'A07 — Identification and Authentication Failures',
      'Il a sa propre catégorie, A11',
    ],
    bonneReponse: 0,
    explication:
      'Depuis la révision 2021, le XSS est fusionné dans A03 Injection. La logique est la même que pour l’injection SQL : une donnée non maîtrisée est interprétée comme du code, seul l’interpréteur change — le moteur SQL d’un côté, le navigateur de l’autre.',
  },
  {
    id: 'secu-015',
    theme: 'securite',
    type: 'qcm',
    difficulte: 2,
    enonce: 'À quoi sert l’en-tête `Content-Security-Policy` ?',
    options: [
      'À indiquer au navigateur quelles sources de scripts il a le droit d’exécuter',
      'À chiffrer les échanges entre le client et le serveur',
      'À empêcher le vol de cookies par le réseau',
      'À vérifier l’identité de l’utilisateur',
    ],
    bonneReponse: 0,
    explication:
      'Une politique comme `script-src \'self\'` interdit l’exécution de tout script en ligne ou provenant d’un autre domaine. C’est le filet de sécurité : même si un XSS passe l’échappement, le navigateur refuse d’exécuter la charge injectée.',
  },
  // --- CSRF ---
  {
    id: 'secu-016',
    theme: 'securite',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quel est le mécanisme d’une attaque CSRF ?',
    options: [
      'Un site tiers déclenche une requête vers votre application, et le navigateur y joint automatiquement le cookie de session',
      'L’attaquant vole le cookie de session en lisant le stockage du navigateur',
      'L’attaquant injecte du JavaScript dans une page de votre site',
      'L’attaquant intercepte les requêtes sur le réseau Wi-Fi',
    ],
    bonneReponse: 0,
    explication:
      'L’attaquant n’a pas accès au cookie — il n’en a pas besoin. Il profite du fait que le navigateur attache automatiquement les cookies à toute requête vers le domaine concerné. Côté serveur, la requête paraît parfaitement authentifiée.',
  },
  {
    id: 'secu-017',
    theme: 'securite',
    type: 'association',
    difficulte: 3,
    enonce: 'Associez chaque caractéristique à l’attaque correspondante.',
    paires: [
      { gauche: 'On trompe le navigateur de la victime', droite: 'XSS' },
      { gauche: 'On trompe le serveur', droite: 'CSRF' },
      { gauche: 'La défense principale est l’échappement en sortie', droite: 'XSS — protection' },
      { gauche: 'La défense principale est le jeton anti-CSRF et SameSite', droite: 'CSRF — protection' },
    ],
    explication:
      'XSS : du code de l’attaquant s’exécute sur votre site. CSRF : une requête légitime est déclenchée à l’insu de la victime. Un XSS réussi contourne d’ailleurs les protections CSRF, puisque le code s’exécute sur le site et peut lire le jeton anti-CSRF.',
  },
  {
    id: 'secu-018',
    theme: 'securite',
    type: 'vrai_faux',
    difficulte: 3,
    enonce: 'Un cookie `HttpOnly` protège contre les attaques CSRF.',
    bonneReponse: false,
    explication:
      '`HttpOnly` empêche JavaScript de LIRE le cookie, ce qui protège contre le vol par XSS. Mais le navigateur continue de l’ENVOYER automatiquement : l’attaque CSRF fonctionne toujours. Les bonnes parades sont l’attribut `SameSite` et le jeton anti-CSRF.',
  },
  {
    id: 'secu-019',
    theme: 'securite',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Pourquoi une API qui authentifie par en-tête `Authorization: Bearer` est-elle peu exposée au CSRF ?',
    options: [
      'Parce que le navigateur n’ajoute pas automatiquement cet en-tête sur une requête venue d’un autre site',
      'Parce que les jetons JWT sont chiffrés',
      'Parce que les API REST ne acceptent pas les requêtes POST inter-sites',
      'Parce que CORS bloque toutes les requêtes externes',
    ],
    bonneReponse: 0,
    explication:
      'Le CSRF repose sur l’envoi automatique des identifiants par le navigateur, ce qui ne vaut que pour les cookies. Un en-tête doit être posé explicitement par du code, et la politique de même origine empêche un site tiers de lire le jeton pour le poser.',
  },
  {
    id: 'secu-020',
    theme: 'securite',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Que fait l’attribut `SameSite=Strict` sur un cookie ?',
    options: [
      'Il empêche le navigateur d’envoyer le cookie sur une requête initiée depuis un autre site',
      'Il chiffre le contenu du cookie',
      'Il limite la durée de vie du cookie à la session',
      'Il empêche JavaScript de lire le cookie',
    ],
    bonneReponse: 0,
    explication:
      'C’est la parade native au CSRF. `Strict` bloque tout envoi inter-sites, y compris quand l’utilisateur clique sur un lien légitime venu d’ailleurs ; `Lax` autorise ce cas de navigation, ce qui en fait le compromis courant. Empêcher la lecture par JavaScript, c’est le rôle de `HttpOnly`.',
  },
  // --- Chiffrement, hachage, encodage ---
  {
    id: 'secu-021',
    theme: 'securite',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque opération à sa caractéristique.',
    paires: [
      { gauche: 'Encodage (base64)', droite: 'Réversible sans clé — aucune sécurité' },
      { gauche: 'Chiffrement (AES, RSA)', droite: 'Réversible avec la clé' },
      { gauche: 'Hachage (bcrypt, Argon2)', droite: 'Non réversible, par conception' },
    ],
    explication:
      'Confusion très fréquente. Le payload d’un JWT est encodé en base64, donc lisible par n’importe qui : la signature garantit son intégrité, pas sa confidentialité. Un mot de passe se hache, il ne se chiffre pas — un chiffrement réversible signifie qu’une clé volée expose tous les comptes.',
  },
  {
    id: 'secu-022',
    theme: 'securite',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Pourquoi bcrypt et Argon2 sont-ils préférés à SHA-256 pour stocker un mot de passe ?',
    options: [
      'Parce qu’ils sont lents par conception et intègrent un sel, ce qui rend l’attaque par force brute coûteuse',
      'Parce qu’ils produisent une empreinte plus longue',
      'Parce qu’ils sont réversibles en cas d’oubli du mot de passe',
      'Parce qu’ils sont plus rapides, donc plus économes en ressources',
    ],
    bonneReponse: 0,
    explication:
      'La vitesse est un défaut pour un hachage de mot de passe : SHA-256 permet des milliards d’essais par seconde sur du matériel spécialisé. bcrypt et Argon2 sont volontairement coûteux en temps et en mémoire, et leur facteur de coût s’ajuste à mesure que le matériel progresse.',
  },
  {
    id: 'secu-023',
    theme: 'securite',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque type de chiffrement à sa caractéristique.',
    paires: [
      { gauche: 'Symétrique (AES)', droite: 'Une seule clé partagée, rapide, adapté aux gros volumes' },
      { gauche: 'Asymétrique (RSA)', droite: 'Une paire clé publique / clé privée, lent, sert à échanger un secret ou à signer' },
    ],
    explication:
      'HTTPS combine les deux : la poignée de main TLS utilise l’asymétrique pour authentifier le serveur et convenir d’une clé de session, puis toute la conversation est chiffrée en symétrique parce que c’est bien plus rapide.',
  },
  {
    id: 'secu-024',
    theme: 'securite',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Le contenu d’un jeton JWT est chiffré : un attaquant qui l’intercepte ne peut pas le lire.',
    bonneReponse: false,
    explication:
      'Le payload est simplement encodé en base64 : n’importe qui peut le décoder et lire le rôle, l’identifiant et la date d’expiration. La signature empêche de le MODIFIER sans être détecté, mais ne le rend pas secret. On n’y met donc aucune donnée sensible.',
  },
  {
    id: 'secu-025',
    theme: 'securite',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Quel est le rôle d’un certificat TLS délivré par une autorité comme Let’s Encrypt ?',
    options: [
      'Attester que la clé publique présentée appartient bien au domaine visité',
      'Chiffrer le contenu de la base de données du serveur',
      'Stocker les mots de passe des utilisateurs de façon sécurisée',
      'Empêcher les attaques par déni de service',
    ],
    bonneReponse: 0,
    explication:
      'Sans certificat signé, rien ne prouve qu’on parle au bon serveur : un intercepteur pourrait présenter sa propre clé publique. Le navigateur fait confiance à l’autorité de certification, donc au certificat, donc au serveur — c’est la chaîne de confiance.',
  },
  {
    id: 'secu-026',
    theme: 'securite',
    type: 'qcm',
    difficulte: 2,
    enonce: 'À quoi sert le sel (salt) ajouté au hachage d’un mot de passe ?',
    options: [
      'À rendre l’empreinte différente pour deux utilisateurs ayant le même mot de passe, ce qui casse les tables précalculées',
      'À raccourcir l’empreinte stockée en base',
      'À permettre de retrouver le mot de passe original',
      'À chiffrer l’empreinte une seconde fois',
    ],
    bonneReponse: 0,
    explication:
      'Sans sel, deux comptes avec le même mot de passe ont la même empreinte, et une table arc-en-ciel précalculée les casse d’un coup. Le sel, unique par utilisateur, rend chaque empreinte unique et oblige à attaquer les comptes un par un. bcrypt et Argon2 gèrent le sel automatiquement.',
  },
];
