## 11bis. Le développement back-end

Le **back-end** est la partie de l'application qui s'exécute côté serveur. Il est invisible pour l'utilisateur mais constitue le cœur de l'application : il reçoit les requêtes du front-end, applique les règles métier, communique avec la base de données et renvoie les réponses.

```
Navigateur (front-end) ──► Serveur back-end ──► Base de données
     (HTML/CSS/JS)          (API HTTP)              (SQL)
```

> **Les exemples sont en JavaScript.** Les mécanismes présentés ici — validation, chaîne de traitement, configuration, journalisation — existent à l'identique dans tous les écosystèmes serveur, sous des noms parfois différents.

---

### 11bis.1 Validation des données côté serveur

La validation serveur est **la seule validation qui compte pour la sécurité**. Celle du front-end est du confort d'usage — elle se contourne avec un client HTTP en ligne de commande.

**Déclarer les règles à côté du modèle d'entrée**, plutôt que de les éparpiller dans le code :

```javascript
const schemaInscription = {
  nom:         { requis: true, maxLongueur: 50 },
  email:       { requis: true, format: 'email' },
  motDePasse:  { requis: true, minLongueur: 8, motif: /^(?=.*[A-Z])(?=.*\d).+$/ },
  soldeConges: { min: 0, max: 100 },
};
```

| Règle | Ce qu'elle vérifie |
| --- | --- |
| `requis` | La valeur est présente et non vide |
| `minLongueur` / `maxLongueur` | La taille d'une chaîne |
| `min` / `max` | Un nombre dans un intervalle |
| `format` | Un motif connu : adresse e-mail, URL, date |
| `motif` | Une expression régulière, pour un besoin spécifique |
| `identiqueA` | Deux champs égaux (confirmation de mot de passe) |

Chaque écosystème a ses bibliothèques — annotations sur les propriétés en C# ou en Java, schémas déclaratifs en JavaScript, règles de formulaire en PHP. Le vocabulaire ci-dessus, lui, est commun.

**Vérifier avant de déléguer :**

```javascript
app.post('/api/inscriptions', async (req, res) => {
  const erreurs = valider(req.body, schemaInscription);
  if (erreurs) return res.status(400).json({ erreurs });   // 400 + détail par champ

  // Si on arrive ici, les données sont bien formées
  const resultat = await serviceInscription.inscrire(req.body);
  res.status(201).json(resultat);
});
```

**Renvoyer le détail par champ** permet au front d'afficher l'erreur au bon endroit :

```json
{
  "erreurs": {
    "email": "L'adresse e-mail est invalide.",
    "motDePasse": "Le mot de passe doit contenir au moins une majuscule et un chiffre."
  }
}
```

**Où s'arrête la validation ?** Dès qu'une règle a besoin d'autres données, elle change de nature :

```javascript
// Vérifiable avec la seule valeur reçue : c'est de la validation de format
const dateDansLeFutur = (valeur) => new Date(valeur) > new Date();

// Suppose d'aller lire le solde en base : c'est une règle de gestion.
// Sa place est dans la couche métier, pas dans le schéma d'entrée.
```

---

### 11bis.2 Gestion des erreurs et exceptions

**Distinguer l'erreur métier de la panne technique.** Un solde insuffisant est un cas prévu, qui se renvoie comme un résultat. Une base injoignable est un imprévu, qui remonte comme exception.

```javascript
class ServiceConges {
  async deposer(idSalarie, donnees) {
    // Cas métier prévu : pas d'exception, un résultat explicite
    if (donnees.dateFin < donnees.dateDebut) {
      return Resultat.erreur('Dates incohérentes.');
    }

    try {
      await this.depot.inserer({ idSalarie, ...donnees });
      return Resultat.ok();
    } catch (err) {
      // Panne technique : on journalise le détail, on renvoie un message neutre
      logger.error('Échec de l’insertion en base', { idSalarie, erreur: err.message });
      return Resultat.erreur('Erreur technique. Veuillez réessayer.');
    }
  }
}
```

**Un traitement global des erreurs**, plutôt qu'un `try/catch` répété à chaque point d'entrée :

```javascript
// Placé en dernier : il capture ce que les étapes précédentes ont laissé passer
app.use((err, req, res, next) => {
  const reference = genererIdentifiant();
  logger.error('Erreur non gérée', { reference, chemin: req.path, pile: err.stack });

  res.status(500).json(
    process.env.NODE_ENV === 'production'
      ? { message: 'Une erreur est survenue.', reference }
      : { message: err.message, pile: err.stack },
  );
});
```

L'**identifiant de corrélation** est le pont entre l'utilisateur et les journaux : il signale « erreur ABC-123 », on retrouve la trace complète côté serveur. On donne le diagnostic sans rien exposer.

**Un format d'erreur standard.** La RFC 9457 (qui remplace la RFC 7807) définit un corps de réponse commun pour les erreurs d'API :

```json
{
  "type": "https://congeapp.fr/erreurs/solde-insuffisant",
  "title": "Solde insuffisant",
  "status": 400,
  "detail": "Le solde disponible est de 3 jours, la demande en réclame 10.",
  "instance": "/api/demandes"
}
```

Adopter un format unique évite à chaque client de deviner la forme des erreurs. La plupart des cadriciels savent le produire.

---

### 11bis.3 La chaîne de traitement d'une requête

Une requête HTTP traverse une **suite d'étapes** avant d'atteindre le code métier, puis les retraverse en sens inverse pour la réponse. Chaque étape peut traiter la requête, la laisser passer, ou l'arrêter net.

```
Requête HTTP entrante
       │
  ┌────▼──────────────────────────────────────────┐
  │  Capture globale des erreurs                  │
  │  ┌────▼──────────────────────────────────────┐│
  │  │  Redirection vers HTTPS                    ││
  │  │  ┌────▼──────────────────────────────────┐││
  │  │  │  Contrôle d'origine (CORS)             │││
  │  │  │  ┌────▼──────────────────────────────┐│││
  │  │  │  │  Authentification : QUI ?          ││││
  │  │  │  │  ┌────▼──────────────────────────┐││││
  │  │  │  │  │  Autorisation : A LE DROIT ?  │││││
  │  │  │  │  │  ┌────▼──────────────────────┐│││││
  │  │  │  │  │  │  Traitement métier        ││││││
  │  │  │  │  │  └───────────────────────────┘│││││
  │  │  │  │  └──────────────────────────────┘││││
  │  │  │  └─────────────────────────────────┘│││
  │  │  └────────────────────────────────────┘││
  │  └───────────────────────────────────────┘│
  └──────────────────────────────────────────┘
       │
  Réponse HTTP sortante
```

```javascript
app.use(gestionErreurs);        // 1. englobe tout le reste
app.use(forcerHttps);           // 2. rediriger avant de traiter quoi que ce soit
app.use(cors(politiqueCors));   // 3. contrôle d'origine
app.use(authentifier);          // 4. identifier l'utilisateur
app.use(autoriser);             // 5. vérifier ses droits
app.use('/api', routeurApi);    // 6. router vers le traitement métier
```

> **L'ordre est déterminant.** L'authentification doit précéder l'autorisation : contrôler des droits sur une identité encore inconnue laisse passer tout le monde. Et la capture des erreurs doit englober le reste, sinon une panne survenue plus loin lui échappe. Selon la technologie, ces étapes s'appellent middleware, filtres ou intercepteurs — la logique ne change pas.

---

### 11bis.4 Configuration et environnements

La même application doit tourner en local, en recette et en production **sans être recompilée** : seule la configuration change.

**Ce qui est versionné**, parce que ce n'est pas secret :

```json
{
  "journalisation": { "niveau": "information" },
  "jwt": { "emetteur": "congeapp.fr", "dureeMinutes": 60 },
  "pagination": { "tailleParDefaut": 20, "tailleMax": 100 }
}
```

**Ce qui reste hors du dépôt** — les secrets, fournis par l'environnement d'exécution :

```bash
# Fichier .env sur le serveur : droits 600, non versionné
JWT_SECRET=une-cle-longue-et-aleatoire
DATABASE_URL=postgresql://app:motdepasse@db:5432/congeapp
SMTP_PASSWORD=un-autre-secret
```

**Un `.env.example` versionné**, lui, documente ce qu'il faut renseigner sans livrer aucune valeur :

```bash
JWT_SECRET=
DATABASE_URL=
SMTP_PASSWORD=
```

**Les sources se superposent**, du plus général au plus spécifique :

```
fichier de base  <  fichier par environnement  <  variables d'environnement
```

Les variables d'environnement ont la priorité la plus haute : c'est ce qui permet de livrer la même image partout et de n'ajuster que la configuration. C'est l'un des principes de la méthode dite des douze facteurs.

**Lire la configuration en un seul point** évite de disperser des accès aux variables dans tout le code :

```javascript
export const config = {
  jwt: {
    secret:       exigerVariable('JWT_SECRET'),  // absente → l'application refuse de démarrer
    emetteur:     'congeapp.fr',
    dureeMinutes: Number(process.env.JWT_DUREE ?? 60),
  },
  baseDeDonnees: { url: exigerVariable('DATABASE_URL') },
};
```

Échouer au démarrage quand un secret manque vaut mieux que de découvrir le problème à la première connexion d'un utilisateur.

---

### 11bis.5 La journalisation côté serveur

Les journaux permettent de comprendre ce qui se passe en production — sans eux, un bug en production est invisible.

```javascript
class ServiceConges {
  async deposer(idSalarie, { debut, fin }) {
    logger.info('Tentative de dépôt de demande', { idSalarie, debut, fin });

    if (fin < debut) {
      logger.warn('Dates incohérentes', { idSalarie });
      return Resultat.erreur('Dates incohérentes.');
    }

    try {
      const id = await this.depot.inserer({ idSalarie, debut, fin });
      logger.info('Demande créée', { idSalarie, idDemande: id });
      return Resultat.ok(id);
    } catch (err) {
      logger.error('Échec de la création', { idSalarie, erreur: err.message });
      return Resultat.erreur('Erreur technique.');
    }
  }
}
```

**Message fixe, données à part.** Écrire `` logger.info(`Dépôt par ${idSalarie}`) `` produit un message différent à chaque appel : impossible de compter, de filtrer ou de déclencher une alerte dessus. En séparant le libellé des valeurs, l'outil de supervision peut regrouper et agréger.

**Niveaux de journalisation** (du moins au plus grave) :

| Niveau | Quand l'utiliser |
| --- | --- |
| `trace` | Détails très fins, mise au point intensive |
| `debug` | Informations de mise au point, uniquement en développement |
| `info` | Événements normaux du flux applicatif |
| `warn` | Situation anormale mais non bloquante |
| `error` | Erreur qui a empêché une opération d'aboutir |
| `critical` | Défaillance système — l'application est inutilisable |

En production, on filtre à partir de `info` : `debug` est trop verbeux et fait grossir les journaux pour rien.

**⚠️ Ce qui n'a rien à faire dans un journal :**
- les mots de passe, et leurs empreintes
- les jetons d'authentification
- les données personnelles sensibles (numéro de sécurité sociale, données de santé)
- les numéros de carte bancaire

Les journaux sont souvent lisibles par l'équipe d'exploitation et exportés vers un outil tiers : une donnée sensible qui y entre est une fuite.

> **🔒 Sécurité**
>
> - **Validation systématiquement côté serveur** — celle du front-end est du confort, pas une protection.
> - **Aucun détail technique dans les erreurs renvoyées au client** : ni trace d'exécution, ni nom de table, ni version de bibliothèque. Un identifiant de corrélation suffit.
> - **Les secrets viennent de l'environnement**, pas d'un fichier versionné — et un secret entré une fois dans l'historique Git doit être considéré comme compromis.
> - **Journaliser les événements de sécurité** (connexions échouées, accès refusés) sans y inclure de donnée sensible (OWASP A09).
