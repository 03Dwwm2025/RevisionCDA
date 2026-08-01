## 8. L'architecture en couches en pratique

On concrétise ici la théorie de la Partie I. Le flux complet d'une requête HTTP :

```
Client HTTP
    │  POST /api/demandes
    ▼
Présentation  ← reçoit, valide le FORMAT des données
    │  délègue
    ▼
Métier        ← applique les RÈGLES DE GESTION (solde, dates, chevauchement)
    │  délègue
    ▼
Accès données ← exécute le SQL paramétré
    │  requête
    ▼
Base de données
```

Chaque couche a une responsabilité unique. Les dépendances vont dans un seul sens, vers le bas — la présentation connaît le métier, le métier connaît l'accès aux données, et pas l'inverse.

> **Les exemples de ce chapitre sont en JavaScript et en SQL.** Ce sont des illustrations : la structure en couches se transpose telle quelle en C#, Java, PHP ou Python. Seuls les noms changent — Controller ou Handler, Service ou UseCase, Repository ou DAO.

---

### 8.1 L'objet Resultat — la valeur de retour de la couche métier

La couche métier ne renvoie ni un simple booléen, ni une exception pour une erreur de gestion normale. Une demande refusée pour solde insuffisant n'est pas un incident technique : c'est un cas prévu. Elle renvoie un objet `Resultat` qui porte le succès ou l'échec, avec un message exploitable.

```javascript
// Défini une fois, utilisé dans tout le projet
class Resultat {
  constructor(succes, message = '', id = null) {
    this.succes = succes;
    this.message = message;
    this.id = id;
    Object.freeze(this);          // figé : personne ne le modifiera après coup
  }

  // Méthodes de fabrique : le nom dit l'intention
  static ok(id)      { return new Resultat(true, '', id); }
  static erreur(msg) { return new Resultat(false, msg); }
}
```

Utilisation depuis la couche de présentation :

```javascript
const resultat = await serviceConges.deposer(idSalarie, donnees);
// resultat.succes  → l'opération a-t-elle abouti ?
// resultat.message → le motif du refus, à afficher à l'utilisateur
// resultat.id      → l'identifiant créé en cas de succès
```

**Pourquoi pas une exception ?** Une exception coûte cher, remonte toute la pile, et surtout brouille la lecture : elle signale un imprévu, alors qu'un solde insuffisant est un cas métier parfaitement prévu. On réserve les exceptions aux vraies pannes — base injoignable, disque plein.

---

### 8.2 Les modèles et les objets de transport

Les **entités** représentent les données telles qu'elles existent en base. Les **objets de transport** (*Data Transfer Objects*) ne portent que les données nécessaires à un échange précis.

```javascript
// ← ENTITÉ : reflet de la table en base
// { id, dateDebut, dateFin, statut, idSalarie }

// ← ENTRÉE : ce que le client a le droit d'envoyer au POST
//   Pas d'identifiant (généré par la base), pas de statut (toujours EN_ATTENTE
//   à la création) : ces champs ne doivent pas être pilotables par le client.
const schemaCreation = {
  dateDebut: { type: 'date', requis: true },
  dateFin:   { type: 'date', requis: true },
};

// ← SORTIE : ce que l'API renvoie, enrichi et filtré
function versReponse(demande, salarie) {
  return {
    id:         demande.id,
    dateDebut:  demande.dateDebut,
    dateFin:    demande.dateFin,
    statut:     demande.statut,
    nomSalarie: salarie.nom,      // ← vient d'une jointure, pas de l'entité
    // ni le solde, ni l'identifiant du manager, ni aucune colonne technique
  };
}
```

**Pourquoi séparer ?** L'entité `Salarie` porte l'empreinte du mot de passe, des clés étrangères, des colonnes techniques. Le danger n'est pas ce qu'on expose aujourd'hui : c'est la colonne qu'on ajoutera demain à l'entité, et qui se retrouverait publiée dans l'API sans que personne ne l'ait décidé.

**Le piège de l'entrée**, souvent sous-estimé : si le client peut envoyer un champ `statut`, il peut créer une demande directement validée. Ce qu'on accepte en entrée se déclare aussi explicitement que ce qu'on renvoie en sortie.

---

### 8.3 L'accès aux données — deux approches possibles

Cette couche centralise toutes les requêtes vers la base. Deux grandes façons de l'écrire.

**Approche 1 — SQL écrit à la main.** On maîtrise la requête exacte ; on paramètre soi-même.

```javascript
class DepotDemande {
  constructor(connexion) { this.connexion = connexion; }

  async parSalarie(idSalarie) {
    const { rows } = await this.connexion.query(
      `SELECT idDemande, dateDebut, dateFin, statut
       FROM Demande
       WHERE idSalarie = $1
       ORDER BY dateDebut DESC`,
      [idSalarie],                       // ← paramétré : protection contre l'injection SQL
    );
    return rows;
  }

  async inserer({ idSalarie, dateDebut, dateFin }) {
    const { rows } = await this.connexion.query(
      `INSERT INTO Demande (idSalarie, dateDebut, dateFin, statut)
       VALUES ($1, $2, $3, 'EN_ATTENTE')
       RETURNING idDemande`,
      [idSalarie, dateDebut, dateFin],
    );
    return rows[0].idDemande;
  }
}
```

**Approche 2 — un ORM.** On décrit la requête avec des objets, l'outil produit le SQL paramétré.

```javascript
class DepotDemande {
  constructor(orm) { this.orm = orm; }

  async parSalarie(idSalarie) {
    // Traduit en : SELECT ... FROM Demande WHERE idSalarie = $1 ORDER BY dateDebut DESC
    return this.orm.demande.findMany({
      where:   { idSalarie },
      orderBy: { dateDebut: 'desc' },
    });
  }

  async inserer(donnees) {
    const creee = await this.orm.demande.create({ data: { ...donnees, statut: 'EN_ATTENTE' } });
    return creee.idDemande;
  }
}
```

**Lequel choisir ?** L'ORM couvre confortablement la grande majorité des cas : moins de code répétitif, paramétrage automatique, migrations de schéma versionnées. Le SQL écrit à la main reste utile pour une requête analytique complexe, ou quand on veut contrôler précisément le plan d'exécution. Les deux cohabitent très bien dans le même projet.

**Ce qui compte, c'est que les deux respectent le même contrat.** La couche métier appelle `parSalarie()` et `inserer()` sans savoir laquelle des deux implémentations elle a en face — c'est ce qui permet d'en changer, et de tester sans base de données.

---

### 8.4 La couche métier

C'est ici que vivent les **règles de gestion**. Cette couche ne connaît ni HTTP, ni SQL : elle reçoit ses collaborateurs et travaille avec des objets du domaine.

```javascript
class ServiceConges {
  // ← Les dépendances sont reçues, pas créées : on peut les remplacer en test
  constructor(depotDemande, depotSalarie) {
    this.depotDemande = depotDemande;
    this.depotSalarie = depotSalarie;
  }

  async deposer(idSalarie, { dateDebut, dateFin }) {
    // ← RG-02 : cohérence des dates
    if (dateFin < dateDebut) {
      return Resultat.erreur('La date de fin doit être après la date de début.');
    }

    // ← RG-03 : solde disponible suffisant
    const nbJours = joursEntre(dateDebut, dateFin);
    const salarie = await this.depotSalarie.parId(idSalarie);
    if (salarie.soldeConges < nbJours) {
      return Resultat.erreur(`Solde insuffisant (${salarie.soldeConges} jours disponibles).`);
    }

    // ← RG-06 : pas de chevauchement avec une demande déjà acceptée
    const existantes = await this.depotDemande.parSalarie(idSalarie);
    const chevauche = existantes.some(
      (d) => d.statut !== 'REFUSEE' && d.dateDebut <= dateFin && d.dateFin >= dateDebut,
    );
    if (chevauche) {
      return Resultat.erreur('Une demande existe déjà sur cette période.');
    }

    const id = await this.depotDemande.inserer({ idSalarie, dateDebut, dateFin });
    return Resultat.ok(id);
  }
}
```

Les commentaires renvoient aux **règles de gestion numérotées** lors de l'analyse des besoins. C'est ce qui rend la traçabilité possible : chaque règle du cahier des charges se retrouve à un endroit précis du code, et chaque règle donne un test.

---

### 8.5 La couche de présentation

Elle reçoit la requête HTTP, **valide le format**, **délègue**, puis traduit le résultat métier en réponse HTTP. Pas de SQL, pas de règle de gestion.

```javascript
app.post('/api/demandes', authentifier, async (req, res) => {
  // ← Niveau 1 : le format. Rejeté tout de suite, sans déranger le métier.
  const erreurs = valider(req.body, schemaCreation);
  if (erreurs) return res.status(400).json({ erreurs });

  // ← L'identité vient du jeton vérifié, pas du corps de la requête
  const idSalarie = req.utilisateur.id;

  // ← Niveau 2 : les règles de gestion, dans la couche métier
  const resultat = await serviceConges.deposer(idSalarie, req.body);

  if (!resultat.succes) return res.status(400).json({ message: resultat.message });

  res.status(201)
     .location(`/api/demandes/${resultat.id}`)
     .json({ id: resultat.id });
});
```

> **L'identité ne se lit pas dans le corps de la requête.** Accepter un `idSalarie` envoyé par le client, c'est laisser n'importe qui déposer une demande au nom d'un collègue. Elle vient du jeton d'authentification, vérifié en amont. C'est le risque n°1 de l'OWASP Top 10.

**Les deux niveaux de validation :**

| Niveau | Où | Quoi | Exemple |
| --- | --- | --- | --- |
| **1 — Format** | Présentation | Types, présence, longueurs, motifs | Date de début obligatoire, e-mail plausible |
| **2 — Gestion** | Métier | Règles qui dépendent d'autres données | Solde suffisant, pas de chevauchement |

Le premier niveau ne peut pas absorber le second : vérifier un solde suppose d'aller lire en base, ce qui n'est pas le rôle d'une contrainte de format.

---

### 8.6 L'assemblage des couches

Chaque composant déclare ce dont il a besoin ; l'assemblage se fait à un seul endroit, au démarrage.

```javascript
// Composition de l'application — le seul endroit qui connaît les classes concrètes
const connexion     = creerConnexion(process.env.DATABASE_URL);
const depotDemande  = new DepotDemande(connexion);
const depotSalarie  = new DepotSalarie(connexion);
const serviceConges = new ServiceConges(depotDemande, depotSalarie);
```

**En test**, on remplace les collaborateurs sans toucher une ligne de la couche métier :

```javascript
const service = new ServiceConges(new DepotDemandeEnMemoire(), new DepotSalarieFactice());
// ServiceConges ne sait pas que ce ne sont pas les vrais : il ne connaît que le contrat
```

**La durée de vie des objets** est le second réglage à connaître, quel que soit l'outillage :

| Durée de vie | Une instance… | Usage typique |
| --- | --- | --- |
| Par requête | par requête HTTP traitée | Le cas par défaut : services, dépôts |
| Unique | pour toute l'application | Configuration, cache, réserve de connexions |
| À chaque demande | à chaque injection | Objets porteurs d'un état éphémère |

Le piège classique est l'instance unique qui porte un état modifiable : toutes les requêtes simultanées la partagent, et les bugs qui en découlent sont difficiles à reproduire.

> **📌 Règle d'or :** les dépendances vont **vers le bas**. Présentation → métier → accès aux données → base. Aucune couche ne connaît celle du dessus, et c'est ce qui rend chacune remplaçable et testable isolément.
