## 8. L'architecture en couches en pratique

On concrétise ici la théorie de la Partie I. Le flux : le **Controller** reçoit la requête, délègue au **Service** (métier), qui passe par le **Repository** (accès données), qui dialogue avec la BDD via des **requêtes paramétrées**. Les **DTO/Models** transportent les données.

### 8.1 Le Repository (accès aux données)

Le repository centralise les requêtes. Point crucial : **toujours des requêtes paramétrées**, jamais de concaténation de chaînes (cf. injection SQL).

```
public class DemandeRepository
{
    private readonly string _connString;
    public DemandeRepository(string cs) => _connString = cs;

    public List<Demande> GetParSalarie(int idSalarie)
    {
        var list = new List<Demande>();
        using var conn = new SqlConnection(_connString);
        // SELECT avec colonnes nommées (pas de SELECT *)
        var sql = @"SELECT idDemande, dateDebut, dateFin, statut
                    FROM Demande WHERE idSalarie = @id";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@id", idSalarie); // paramétré !
        conn.Open();
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            list.Add(new Demande {
                Id = reader.GetInt32(0),
                Debut = DateOnly.FromDateTime(reader.GetDateTime(1)),
                Fin = DateOnly.FromDateTime(reader.GetDateTime(2)),
                Statut = reader.GetString(3)
            });
        }
        return list;
    }
}
```

> **💡 Bon à savoir**
>
> Pour récupérer la clé générée par un INSERT, on utilise `OUTPUT INSERTED.idDemande` (SQL Server), ce qui permet de chaîner plusieurs insertions liées dans une transaction.

### 8.2 Le Service (métier) et le Controller

Le **Service** porte les règles métier (ex : refuser une demande si le solde est insuffisant). Le **Controller** ne fait que recevoir, valider et déléguer.

```
public class ServiceConges
{
    private readonly DemandeRepository _repo;
    public ServiceConges(DemandeRepository repo) => _repo = repo;

    public Resultat Deposer(int idSalarie, DateOnly d, DateOnly f)
    {
        if (f < d) return Resultat.Erreur("Dates incohérentes.");
        // ... règles métier (solde, chevauchement...) ...
        _repo.Inserer(idSalarie, d, f);
        return Resultat.Ok();
    }
}
```

> **📌 À retenir**
>
> Règle d'or des couches : **les dépendances vont vers le bas**. Le Controller connaît le Service, le Service connaît le Repository — jamais l'inverse. La BDD ne « remonte » jamais directement jusqu'à la vue.
