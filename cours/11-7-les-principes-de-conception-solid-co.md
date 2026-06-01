## 7. Les principes de conception (SOLID & co.)

Écrire du code qui marche ne suffit pas : il doit être maintenable. Les principes **SOLID** sont cinq règles de conception objet de référence.

| Lettre | Principe | Idée |
| --- | --- | --- |
| **S** | Single Responsibility | Une classe = une seule responsabilité, une seule raison de changer |
| **O** | Open/Closed | Ouvert à l'extension, fermé à la modification (on étend sans casser l'existant) |
| **L** | Liskov Substitution | Une classe enfant doit pouvoir remplacer son parent sans rien casser |
| **I** | Interface Segregation | Plusieurs interfaces spécifiques valent mieux qu'une interface fourre-tout |
| **D** | Dependency Inversion | Dépendre d'abstractions (interfaces), pas d'implémentations concrètes |

D'autres principes complètent SOLID : **DRY** (*Don't Repeat Yourself* — ne pas dupliquer), **KISS** (*Keep It Simple* — rester simple) et **YAGNI** (*You Aren't Gonna Need It* — ne pas coder ce dont on n'a pas besoin).

> **💡 Bon à savoir**
>
> La **Dependency Inversion** est au cœur de l'**injection de dépendances** (très présente en ASP.NET Core) : on injecte une interface (`IServiceConges`) plutôt que d'instancier une classe concrète, ce qui rend le code testable (on peut injecter un faux service en test).
