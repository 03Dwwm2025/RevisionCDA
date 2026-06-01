## 13. Les tests

Tester, c'est vérifier que le logiciel fait ce qu'on attend et continue de le faire après chaque modification. On distingue plusieurs niveaux, organisés en **pyramide** :

| Niveau | Portée | Quantité |
| --- | --- | --- |
| **Unitaires** | Une méthode/classe isolée | Beaucoup (base de la pyramide) |
| **Intégration** | Plusieurs composants ensemble (ex : service + BDD) | Moins nombreux |
| **End-to-End (E2E)** | L'application complète, comme un utilisateur | Peu (sommet, coûteux) |

Le **TDD** (*Test-Driven Development*) inverse l'ordre : on écrit d'abord le test (qui échoue), puis le code qui le fait passer, puis on refactore (cycle *Red-Green-Refactor*).

```
// Test unitaire avec xUnit (.NET)
[Fact]
public void Deposer_RefuseSiDatesIncoherentes()
{
    var service = new ServiceConges(new FakeRepo());
    var res = service.Deposer(1,
        new DateOnly(2026,7,10), new DateOnly(2026,7,1));
    Assert.False(res.Succes); // Arrange - Act - Assert
}
```

> **💡 Bon à savoir**
>
> Structure d'un test : **AAA** — *Arrange* (préparer), *Act* (exécuter), *Assert* (vérifier). Un bon test est rapide, isolé et reproductible. La **couverture de code** mesure la part de code testée (sans être une fin en soi).

> **🔒 Sécurité**
>
> - Inclure des **tests de sécurité** : cas limites, entrées malveillantes, contrôle des autorisations.
> - **SAST** (analyse statique du code) et **DAST** (test de l'application en marche) intégrés au pipeline détectent les failles tôt.
> - Vérifier les **dépendances** vulnérables (`npm audit`, `dotnet list package --vulnerable`, Dependabot).
