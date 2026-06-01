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
    enonce: 'Les modes debug et les messages d\'erreur détaillés (stack trace) doivent être désactivés en production.',
    bonneReponse: true,
    explication:
      'Une stack trace expose la structure interne du code (chemins de fichiers, versions de librairies, requêtes SQL…) à n\'importe qui. En ASP.NET Core : `app.UseExceptionHandler("/error")` en prod au lieu de `app.UseDeveloperExceptionPage()`. En React/Vite : le build de prod minifie et ne contient pas les sources.',
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
];
