import type { Question } from '../../types/quiz';

export const questionsMiseEnProd: Question[] = [
  {
    id: 'prod-001',
    theme: 'mise-en-prod',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Quel est le rôle principal d\'un **reverse proxy** comme Nginx en production ?',
    options: [
      'Exécuter directement le code de l\'application',
      'Se placer devant l\'application pour recevoir les requêtes publiques et les rediriger vers le bon conteneur, gérer le HTTPS et la compression',
      'Stocker les sauvegardes de la base de données',
      'Scanner les images Docker pour des vulnérabilités',
    ],
    bonneReponse: 1,
    explication:
      'Nginx reçoit les requêtes HTTPS du public (port 443), termine le TLS et les redirige en HTTP vers le conteneur applicatif en interne. Il gère aussi : la compression gzip, le cache statique, le load balancing. L\'application n\'est jamais exposée directement à Internet.',
  },
  {
    id: 'prod-002',
    theme: 'mise-en-prod',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque concept DNS/HTTPS à sa définition.',
    paires: [
      { gauche: 'Enregistrement A (DNS)', droite: 'Fait correspondre un nom de domaine à une adresse IPv4' },
      { gauche: 'TLS/HTTPS', droite: 'Chiffre les échanges entre le navigateur et le serveur' },
      { gauche: 'Let\'s Encrypt', droite: 'Autorité de certification gratuite qui délivre des certificats TLS' },
      { gauche: 'Certbot', droite: 'Outil qui obtient et renouvelle automatiquement les certificats Let\'s Encrypt' },
    ],
    explication:
      'HTTPS est indispensable en production : sans TLS, les données transitent en clair (mots de passe, tokens JWT). Let\'s Encrypt est gratuit et automatisable. Certbot intègre directement Nginx pour configurer le certificat et la redirection HTTP→HTTPS.',
  },
  {
    id: 'prod-003',
    theme: 'mise-en-prod',
    type: 'vrai_faux',
    difficulte: 1,
    enonce: '`fail2ban` est un outil qui bannit automatiquement les adresses IP après trop de tentatives de connexion échouées (ex. SSH).',
    bonneReponse: true,
    explication:
      'fail2ban surveille les logs système et crée des règles iptables/ufw temporaires pour bloquer les IP après N échecs. Protection efficace contre le brute force SSH et les tentatives de connexion automatisées. À combiner avec la désactivation de l\'authentification SSH par mot de passe (clé uniquement).',
  },
  {
    id: 'prod-004',
    theme: 'mise-en-prod',
    type: 'remettre_ordre',
    difficulte: 2,
    enonce: 'Remettez dans l\'ordre les étapes de sécurisation d\'un VPS Ubuntu neuf.',
    elements: [
      'Créer un utilisateur dédié avec droits sudo (ne pas travailler en root)',
      'Configurer l\'authentification SSH par clé et désactiver le login par mot de passe',
      'Configurer le pare-feu ufw (bloquer tout entrant, ouvrir 22/80/443)',
      'Installer et configurer fail2ban',
      'Mettre à jour le système (`apt update && apt upgrade`)',
    ],
    explication:
      'L\'ordre est important : créer l\'utilisateur avant de désactiver root, configurer SSH avant d\'activer ufw (pour ne pas se couper l\'accès). fail2ban vient après ufw. Les mises à jour en dernier pour ne pas redémarrer et perdre la session.',
  },
  {
    id: 'prod-005',
    theme: 'mise-en-prod',
    type: 'completer_code',
    difficulte: 2,
    enonce: 'Complétez cette configuration Nginx de reverse proxy vers un conteneur applicatif.',
    codeAvecTrous: `server {
  listen 443 ___1___;
  server_name mon-app.fr;

  ssl_certificate     /etc/letsencrypt/live/mon-app.fr/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/mon-app.fr/privkey.pem;

  location / {
    ___2___         http://app:3000;
    proxy_set_header Host              $host;
    proxy_set_header ___3___  $remote_addr;
  }
}`,
    choix: ['ssl', 'tls', 'https', 'proxy_pass', 'forward', 'redirect', 'X-Real-IP', 'X-Forwarded-For', 'X-Remote-IP'],
    bonnesReponses: ['ssl', 'proxy_pass', 'X-Real-IP'],
    explication:
      '`listen 443 ssl` active HTTPS. `proxy_pass` transmet la requête au conteneur `app` sur le port 3000 (réseau interne Docker). `X-Real-IP` transmet l\'IP réelle du client à l\'application (sinon l\'app verrait toujours l\'IP de Nginx).',
  },
  {
    id: 'prod-006',
    theme: 'mise-en-prod',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Pourquoi le fichier `.env` de production doit-il avoir les permissions `chmod 600` ?',
    options: [
      'Pour le rendre exécutable par le serveur web',
      'Pour limiter sa lecture au propriétaire uniquement et empêcher les autres utilisateurs du serveur de lire les secrets',
      'Pour que Docker Compose puisse le monter comme volume',
      'C\'est une convention sans impact réel sur la sécurité',
    ],
    bonneReponse: 1,
    explication:
      '`chmod 600` = lecture/écriture pour le propriétaire uniquement (rw-------). Sur un serveur partagé ou multi-utilisateur, sans cette restriction, n\'importe quel processus sous un autre utilisateur pourrait lire les secrets (clé SSH, mot de passe BDD, token JWT).',
  },
  {
    id: 'prod-007',
    theme: 'mise-en-prod',
    type: 'vrai_faux',
    difficulte: 2,
    enonce:
      'Le mode de débogage et les messages d’erreur détaillés doivent être désactivés en production.',
    bonneReponse: true,
    explication:
      'Une trace d’exécution expose la structure interne du projet à n’importe quel visiteur : chemins de fichiers, versions de bibliothèques, parfois la requête SQL fautive. En production on renvoie un message générique avec un identifiant de corrélation, et le détail reste dans les journaux serveur. Côté front, le build de production supprime aussi les cartes de source.',
  },
  {
    id: 'prod-008',
    theme: 'mise-en-prod',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Dans une architecture Docker Compose (API + BDD), comment s\'assure-t-on que la BDD ne soit pas accessible depuis Internet ?',
    options: [
      'En ajoutant `EXPOSE 5432` dans le Dockerfile de la BDD',
      'En ne mappant pas le port de la BDD vers l\'hôte (pas de `ports:` dans `compose.yaml` pour le service db)',
      'En configurant un pare-feu Nginx devant la BDD',
      'En chiffrant la communication entre l\'API et la BDD avec TLS',
    ],
    bonneReponse: 1,
    explication:
      '`EXPOSE` est documentaire, il n\'ouvre pas de port sur l\'hôte. `ports: "5432:5432"` l\'ouvrirait → accessible depuis Internet. Sans `ports:`, le service db communique uniquement via le réseau interne Docker (réseau bridge privé). L\'API accède à la BDD via son nom de service (`db:5432`), pas via l\'hôte.',
  },

  // --- DNS, SSH, UFW ---
  {
    id: 'prod-009',
    theme: 'mise-en-prod',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque type d\'enregistrement DNS à son rôle.',
    paires: [
      { gauche: 'Enregistrement A', droite: 'Fait pointer un domaine vers une adresse IPv4' },
      { gauche: 'Enregistrement AAAA', droite: 'Fait pointer un domaine vers une adresse IPv6' },
      { gauche: 'Enregistrement CNAME', droite: 'Alias — fait pointer un nom vers un autre nom de domaine' },
      { gauche: 'Enregistrement MX', droite: 'Désigne le serveur de messagerie du domaine' },
    ],
    explication:
      'Pour pointer `mon-app.fr` vers un VPS avec IP `45.155.171.34`, on crée un enregistrement A : `mon-app.fr → 45.155.171.34`. Pour `www`, on peut créer un CNAME : `www → mon-app.fr`. La propagation DNS peut prendre de quelques minutes à 24h.',
  },
  {
    id: 'prod-010',
    theme: 'mise-en-prod',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quelle commande UFW bloque tout le trafic entrant par défaut, tout en autorisant SSH, HTTP et HTTPS ?',
    options: [
      '`ufw allow all && ufw deny ssh`',
      '`ufw default deny incoming && ufw allow 22 && ufw allow 80 && ufw allow 443 && ufw enable`',
      '`ufw block all && ufw open 22 80 443`',
      '`iptables -A INPUT -p tcp --dport 80 -j ACCEPT`',
    ],
    bonneReponse: 1,
    explication:
      'La séquence correcte : d\'abord `default deny incoming` (bloquer tout), puis ouvrir uniquement les ports nécessaires (22/SSH, 80/HTTP, 443/HTTPS), enfin `ufw enable`. **Attention :** ne pas oublier d\'autoriser le port 22 avant d\'activer UFW, sinon on se coupe l\'accès SSH.',
  },
  {
    id: 'prod-011',
    theme: 'mise-en-prod',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'L\'authentification SSH par clé est plus sécurisée que l\'authentification par mot de passe car une clé privée ne peut pas être devinée par brute force.',
    bonneReponse: true,
    explication:
      'Une clé SSH Ed25519 est cryptographiquement impossible à brute-forcer (256 bits d\'entropie). Un mot de passe, même complexe, peut être testé des milliers de fois par seconde. Bonne pratique : générer une paire de clés (`ssh-keygen -t ed25519`), copier la clé publique sur le serveur, désactiver `PasswordAuthentication` dans `/etc/ssh/sshd_config`.',
  },
  {
    id: 'prod-012',
    theme: 'mise-en-prod',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Pourquoi doit-on **désactiver** `PermitRootLogin` dans la configuration SSH du VPS ?',
    options: [
      'Pour économiser des ressources serveur',
      'Pour empêcher les connexions directes en root : si un attaquant passe SSH, il a les pleins pouvoirs — mieux vaut forcer le passage par un utilisateur dédié + sudo',
      'Parce que root n\'a pas accès à Docker',
      'Pour respecter les contraintes de Let\'s Encrypt',
    ],
    bonneReponse: 1,
    explication:
      'Root est le compte le plus ciblé par les attaques SSH. Le désactiver force à se connecter avec un compte utilisateur puis à `sudo` pour les actions privilégiées. Cela crée une étape supplémentaire que l\'attaquant doit franchir et génère des logs traçables des actions d\'administration.',
  },
  // --- Environnements ---
  {
    id: 'prod-013',
    theme: 'mise-en-prod',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque environnement à son rôle.',
    paires: [
      { gauche: 'Développement', droite: 'Coder et déboguer sur la machine du développeur' },
      { gauche: 'Intégration', droite: 'Exécuter les tests automatisés à chaque commit' },
      { gauche: 'Recette / préproduction', droite: 'Dérouler le cahier de recettes avec le client avant la prod' },
      { gauche: 'Production', droite: 'Le service rendu aux utilisateurs réels' },
    ],
    explication:
      'La règle est que ces environnements soient aussi proches que possible les uns des autres : un bug qui n’apparaît qu’en production vient le plus souvent d’un écart de configuration ou de version. C’est précisément ce que Docker apporte — la même image partout, seule la configuration change.',
  },
  {
    id: 'prod-014',
    theme: 'mise-en-prod',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Copier la base de production en préproduction pour « tester avec de vraies données » est une bonne pratique.',
    bonneReponse: false,
    explication:
      'C’est une faute au regard du RGPD : les données personnelles sortent de leur cadre de traitement et se retrouvent sur un environnement moins protégé, accessible à plus de personnes. Il faut anonymiser ou pseudonymiser avant toute copie hors production.',
  },
  // --- Stratégies de déploiement ---
  {
    id: 'prod-015',
    theme: 'mise-en-prod',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque stratégie de déploiement à son principe.',
    paires: [
      { gauche: 'Recreate', droite: 'On arrête l’ancienne version puis on démarre la nouvelle' },
      { gauche: 'Rolling update', droite: 'On remplace les instances une par une, sans coupure' },
      { gauche: 'Blue-green', droite: 'Deux environnements complets ; on bascule le trafic d’un coup' },
      { gauche: 'Canary', droite: 'La nouvelle version reçoit d’abord une petite part du trafic' },
    ],
    explication:
      'Le blue-green offre le retour arrière le plus rapide : rebasculer le routage. Le canary permet de détecter un problème sur 5 % des utilisateurs plutôt que sur 100 %. Sur un VPS unique, `docker compose up -d` fait un recreate, avec quelques secondes de coupure.',
  },
  {
    id: 'prod-016',
    theme: 'mise-en-prod',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Pourquoi éviter le tag `latest` pour une image Docker en production ?',
    options: [
      'Parce qu’on ne sait plus quel code tourne réellement, et qu’aucun retour arrière n’est possible',
      'Parce que ce tag n’est pas supporté par Docker Hub',
      'Parce qu’il télécharge une image plus volumineuse',
      'Parce qu’il empêche l’utilisation des volumes',
    ],
    bonneReponse: 0,
    explication:
      '`latest` désigne une cible mouvante : deux serveurs qui font `docker pull` à deux moments différents obtiennent deux images différentes. Un tag par version ou par SHA de commit rend le déploiement traçable et le retour arrière possible en une commande.',
  },
  {
    id: 'prod-017',
    theme: 'mise-en-prod',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Une migration a supprimé une colonne. Que se passe-t-il si l’on redéploie simplement l’image précédente ?',
    options: [
      'L’ancienne version cherche une colonne qui n’existe plus : le retour arrière du code ne défait pas celui de la base',
      'La colonne est automatiquement restaurée par le SGBD',
      'Rien, les deux versions sont compatibles',
      'La base bascule seule sur sa version précédente',
    ],
    bonneReponse: 0,
    explication:
      'C’est le vrai point dur du retour arrière. Deux réflexes : écrire des migrations réversibles (chaque `Up` a son `Down`) et procéder par étapes compatibles — ajouter la colonne, déployer le code qui lit les deux formes, migrer les données, et supprimer l’ancienne colonne seulement une version plus tard.',
  },
  // --- Documentation et versionnement ---
  {
    id: 'prod-018',
    theme: 'mise-en-prod',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque document de livraison à son destinataire.',
    paires: [
      { gauche: 'Manuel de déploiement', droite: 'Celui qui déploie : prérequis, commandes, retour arrière' },
      { gauche: 'Documentation technique', droite: 'Le développeur qui reprend le projet' },
      { gauche: 'Documentation d’API', droite: 'Le développeur front ou l’intégrateur' },
      { gauche: 'Manuel utilisateur', droite: 'L’utilisateur final' },
    ],
    explication:
      'La compétence du référentiel dit « préparer et DOCUMENTER le déploiement » : la documentation est un livrable, pas un bonus. La documentation d’API se génère avec Swagger/OpenAPI, ce qui garantit qu’elle reste synchronisée avec le code.',
  },
  {
    id: 'prod-019',
    theme: 'mise-en-prod',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque changement au passage de version SemVer correspondant.',
    paires: [
      { gauche: 'Correction d’un calcul erroné, sans changement d’usage', droite: '1.4.0 vers 1.4.1' },
      { gauche: 'Ajout d’un nouvel endpoint d’export', droite: '1.4.1 vers 1.5.0' },
      { gauche: 'La réponse d’un endpoint change de forme', droite: '1.5.0 vers 2.0.0' },
    ],
    explication:
      'MAJEUR.MINEUR.CORRECTIF : la majeure signale une rupture de compatibilité, la mineure un ajout rétrocompatible, le correctif une correction. Une version qui porte du sens permet à un consommateur de savoir s’il peut mettre à jour sans relire le journal des modifications.',
  },
  {
    id: 'prod-020',
    theme: 'mise-en-prod',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quel élément d’un manuel de déploiement est le plus souvent oublié, et le plus utile en incident ?',
    options: [
      'La procédure de retour arrière',
      'La liste des contributeurs',
      'Le schéma de la base de données',
      'La licence du projet',
    ],
    bonneReponse: 0,
    explication:
      'À trois heures du matin, la question n’est pas comment déployer mais comment revenir à l’état précédent. Un manuel qui ne décrit que le chemin nominal laisse la personne d’astreinte improviser au pire moment.',
  },
  {
    id: 'prod-021',
    theme: 'mise-en-prod',
    type: 'completer_code',
    difficulte: 2,
    enonce: 'Complétez ces commandes de publication d’une version.',
    codeAvecTrous: `# Poser une étiquette annotée sur le commit de livraison
git ___1___ -a v1.5.0 -m "Export PDF du planning"
git push origin v1.5.0

# Construire l'image avec un tag traçable plutôt que latest
docker build -t ghcr.io/valentin/congeapp:___2___ .`,
    choix: ['tag', 'branch', 'commit', 'v1.5.0', 'latest', 'main'],
    bonnesReponses: ['tag', 'v1.5.0'],
    explication:
      'L’étiquette Git annotée porte un message et un auteur, contrairement à l’étiquette légère. Utiliser le même identifiant pour l’étiquette Git et le tag d’image permet de retrouver instantanément quel code tourne en production.',
  },
  {
    id: 'prod-022',
    theme: 'mise-en-prod',
    type: 'remettre_ordre',
    difficulte: 2,
    enonce: 'Remettez dans l’ordre les étapes d’une mise en production maîtrisée.',
    elements: [
      'La CI valide le build et les tests sur la branche principale',
      'L’image est construite et poussée avec un tag traçable',
      'Le déploiement est effectué en préproduction',
      'Le client déroule le cahier de recettes et prononce l’acceptation',
      'Le déploiement est effectué en production',
      'On surveille les métriques et les journaux après la bascule',
    ],
    explication:
      'La surveillance qui suit la bascule fait partie du déploiement : la plupart des incidents apparaissent dans les minutes suivantes. Sans elle, on découvre la panne par les plaintes des utilisateurs.',
  },
  {
    id: 'prod-023',
    theme: 'mise-en-prod',
    type: 'vrai_faux',
    difficulte: 1,
    enonce: 'Le déploiement continu suppose une confiance élevée dans la suite de tests automatisés.',
    bonneReponse: true,
    explication:
      'En déploiement continu, chaque commit vert part en production sans validation humaine : la suite de tests est le seul garde-fou. C’est justement pour ça que beaucoup d’équipes s’arrêtent à la livraison continue, où l’artefact est prêt mais où un humain déclenche la mise en production.',
  },
];
