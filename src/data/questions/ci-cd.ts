import type { Question } from '../../types/quiz';

export const questionsCiCd: Question[] = [
  {
    id: 'cicd-001',
    theme: 'ci-cd',
    type: 'vrai_faux',
    difficulte: 1,
    enonce: 'La CI (Intégration Continue) construit et teste automatiquement le code à chaque push, tandis que la CD (Déploiement Continu) pousse automatiquement le build validé vers un environnement cible.',
    bonneReponse: true,
    explication:
      'CI = build + tests à chaque commit (feedback rapide sur les régressions). CD = si la CI passe, on déploie automatiquement (staging ou production). Sans CI solide, la CD est risquée. La chaîne : push → CI (build + tests) → CD (image Docker → push registry → déploiement).',
  },
  {
    id: 'cicd-002',
    theme: 'ci-cd',
    type: 'remettre_ordre',
    difficulte: 1,
    enonce: 'Remettez dans l\'ordre les étapes d\'un pipeline CI/CD typique (GitHub Actions).',
    elements: [
      'Déclenchement sur push vers main',
      'Checkout du code source',
      'Installation des dépendances (`npm ci` ou `dotnet restore`)',
      'Exécution des tests automatisés',
      'Build de l\'image Docker et push vers le registry',
      'Déploiement sur le VPS via SSH',
    ],
    explication:
      'L\'ordre est crucial : on installe avant de tester, on teste avant de builder l\'image, on construit avant de déployer. Si les tests échouent, le pipeline s\'arrête — le déploiement n\'a pas lieu. Le job `deploy` déclare `needs: build-test` pour exprimer cette dépendance.',
  },
  {
    id: 'cicd-003',
    theme: 'ci-cd',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Où doit-on stocker les secrets (clé SSH, token registry) utilisés par un pipeline GitHub Actions ?',
    options: [
      'En clair dans le fichier YAML du workflow',
      'Dans les GitHub Secrets (chiffrés), accessibles via `${{ secrets.NOM }}`',
      'Dans un fichier `.env` commité dans le repo',
      'Dans les variables d\'environnement du Dockerfile',
    ],
    bonneReponse: 1,
    explication:
      'GitHub Secrets sont chiffrés au repos et masqués dans les logs. Un secret ne doit jamais apparaître dans le YAML (il serait versionné et visible). `.env` commité est une faille critique. Les variables Dockerfile sont dans l\'image et peuvent être lues avec `docker history`.',
  },
  {
    id: 'cicd-004',
    theme: 'ci-cd',
    type: 'completer_code',
    difficulte: 2,
    enonce: 'Complétez ce workflow GitHub Actions qui teste puis déploie une application.',
    codeAvecTrous: `name: CI/CD
on:
  push:
    branches: [main]
jobs:
  build-test:
    ___1___: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
  deploy:
    ___2___: build-test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        run: ssh deploy@vps 'docker compose ___3___ && docker compose up -d'`,
    choix: ['runs-on', 'run', 'uses', 'needs', 'depends-on', 'after', 'pull', 'build', 'restart'],
    bonnesReponses: ['runs-on', 'needs', 'pull'],
    explication:
      '`runs-on` définit l\'environnement d\'exécution du job. `needs: build-test` bloque le job `deploy` jusqu\'à ce que `build-test` réussisse. `docker compose pull` récupère les nouvelles images depuis le registry avant de relancer les conteneurs.',
  },
  {
    id: 'cicd-005',
    theme: 'ci-cd',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Qu\'est-ce que le **DevSecOps** dans le contexte d\'un pipeline CI/CD ?',
    options: [
      'Un outil de déploiement automatique qui remplace Docker',
      'L\'intégration d\'étapes de sécurité (SAST, scan des dépendances, scan d\'image Docker) directement dans le pipeline CI/CD',
      'Une méthode de gestion de projet agile qui inclut les équipes sécurité',
      'Un protocole de chiffrement des communications entre les jobs du pipeline',
    ],
    bonneReponse: 1,
    explication:
      'DevSecOps = "Shift Left Security" : intégrer la sécurité dès le développement plutôt qu\'à la fin. Dans la CI : SAST sur le code, `npm audit` / `dotnet list package --vulnerable` pour les dépendances, Trivy ou Snyk pour l\'image Docker. Ces étapes sont **bloquantes** si elles trouvent des failles critiques.',
  },
  {
    id: 'cicd-006',
    theme: 'ci-cd',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque outil à son rôle dans une chaîne CI/CD.',
    paires: [
      { gauche: 'GitHub Actions', droite: 'Orchestrateur de pipeline déclenché par des événements Git' },
      { gauche: 'Docker registry (GHCR)', droite: 'Stocke et distribue les images Docker buildées' },
      { gauche: 'Trivy / Snyk', droite: 'Scanne les images Docker et les dépendances pour des CVE' },
      { gauche: 'Dependabot', droite: 'Ouvre automatiquement des PRs pour mettre à jour les dépendances vulnérables' },
    ],
    explication:
      'GHCR (GitHub Container Registry) est le registry intégré à GitHub. Les images y sont taguées avec le SHA du commit pour la traçabilité. Trivy/Snyk sont des outils DevSecOps. Dependabot automatise la veille sur les vulnérabilités des dépendances (OWASP A06).',
  },
  {
    id: 'cicd-007',
    theme: 'ci-cd',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Tagger les images Docker avec le SHA du commit Git (`ghcr.io/user/app:abc1234`) plutôt que `latest` permet de tracer exactement quel code est déployé.',
    bonneReponse: true,
    explication:
      '`latest` est un alias flottant : deux déploiements successifs avec `latest` peuvent pointer vers des images différentes, rendant les rollbacks difficiles. Le SHA du commit permet de savoir exactement quelle version est en prod et de déployer une version précédente en cas de problème.',
  },
  {
    id: 'cicd-008',
    theme: 'ci-cd',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Pourquoi le job `deploy` doit-il déclarer `needs: build-test` dans un pipeline GitHub Actions ?',
    options: [
      'Pour réduire le temps d\'exécution total du pipeline',
      'Pour garantir que le déploiement n\'a lieu que si les tests passent, évitant de mettre en prod une version cassée',
      'Pour partager les variables d\'environnement entre les deux jobs',
      'C\'est obligatoire syntaxiquement pour les jobs qui utilisent SSH',
    ],
    bonneReponse: 1,
    explication:
      'Sans `needs`, GitHub Actions exécute les jobs en parallèle par défaut. Le déploiement pourrait s\'exécuter avant la fin des tests (ou même si les tests échouent). `needs` crée une dépendance explicite : `deploy` attend que `build-test` se termine avec succès.',
  },
  {
    id: 'cicd-009',
    theme: 'ci-cd',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quelle est la différence entre livraison continue et déploiement continu ?',
    options: [
      'En livraison continue, l’artefact est prêt à partir mais un humain déclenche la production ; en déploiement continu, tout est automatique',
      'La livraison continue ne lance pas les tests',
      'Le déploiement continu ne concerne que les environnements de test',
      'Les deux termes désignent exactement la même pratique',
    ],
    bonneReponse: 0,
    explication:
      'Les deux se disent « CD » en anglais, d’où la confusion. La livraison continue (Continuous Delivery) automatise tout jusqu’à la préproduction et garde une validation humaine ; le déploiement continu (Continuous Deployment) va jusqu’en production sans intervention. Le second suppose une confiance totale dans les tests.',
  },
  {
    id: 'cicd-010',
    theme: 'ci-cd',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Pourquoi chaque job d’un pipeline GitHub Actions doit-il refaire un `actions/checkout` ?',
    options: [
      'Parce que chaque job démarre sur un runner neuf, qui ne partage rien avec les autres',
      'Parce que le code change entre deux jobs',
      'Parce que le cache expire après chaque job',
      'Parce que checkout met aussi à jour les dépendances',
    ],
    bonneReponse: 0,
    explication:
      'Les jobs sont isolés : un job `deploy` qui suit un job `build-test` repart d’une machine vide. Le partage se fait explicitement, par des artefacts téléversés puis téléchargés, ou par un registre d’images.',
  },
  {
    id: 'cicd-011',
    theme: 'ci-cd',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Les secrets GitHub sont accessibles aux pipelines déclenchés par une pull request venant d’un dépôt forké.',
    bonneReponse: false,
    explication:
      'GitHub ne transmet pas les secrets aux exécutions déclenchées depuis un fork, précisément pour éviter qu’une pull request malveillante ne les exfiltre. C’est aussi pour cela qu’on sépare le job de build (qui tourne sur les PR) du job de déploiement (réservé à la branche principale).',
  },
  {
    id: 'cicd-012',
    theme: 'ci-cd',
    type: 'remettre_ordre',
    difficulte: 2,
    enonce: 'Remettez dans l’ordre les étapes d’un pipeline complet, du commit à la production.',
    elements: [
      'Récupérer le code source sur le runner',
      'Installer les dépendances depuis le fichier de verrouillage',
      'Lancer les tests automatisés',
      'Analyser la sécurité (dépendances, code, image)',
      'Construire l’image et la pousser avec un tag traçable',
      'Déployer sur le serveur cible',
    ],
    explication:
      'L’analyse de sécurité se place avant la construction de l’artefact final : détecter une faille en CI coûte bien moins cher qu’en production. Chaque étape est bloquante — si les tests échouent, rien n’est publié ni déployé.',
  },
  {
    id: 'cicd-013',
    theme: 'ci-cd',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Quel réglage de protection de branche empêche un compte développeur compromis de pousser du code malveillant en production ?',
    options: [
      'Exiger une pull request approuvée et une CI verte avant toute fusion dans la branche principale',
      'Activer l’authentification à deux facteurs sur le compte du serveur',
      'Chiffrer le dépôt Git',
      'Interdire les commits en dehors des heures ouvrées',
    ],
    bonneReponse: 0,
    explication:
      'C’est la parade à OWASP A08, l’intégrité de la chaîne de livraison. Sans revue obligatoire, un seul compte compromis suffit à injecter du code jusqu’en production. Interdire aussi la poussée forcée empêche de réécrire l’historique pour masquer l’intrusion.',
  },
];
