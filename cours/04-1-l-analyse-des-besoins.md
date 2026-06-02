## 1. L'analyse des besoins

Tout projet commence par la compréhension du **besoin réel** du client. Un logiciel techniquement parfait qui ne répond pas au besoin est un échec.

### 1.1 Besoins fonctionnels vs non-fonctionnels

| Type | Définition | Exemples |
| --- | --- | --- |
| **Fonctionnel** | Ce que le système **doit faire** | « Un salarié peut déposer une demande de congé », « Le manager peut valider ou refuser » |
| **Non-fonctionnel** | Les **contraintes de qualité** du système | Performance (< 2s), disponibilité (99,9 %), sécurité, accessibilité, compatibilité navigateurs |

Les besoins non-fonctionnels sont souvent négligés mais tout aussi importants : une application qui répond en 30 secondes, même correcte fonctionnellement, sera abandonnée.

---

### 1.2 Le cahier des charges

Le cahier des charges (CDC) est le document qui formalise les besoins. Il sert de **référence contractuelle** entre le client et l'équipe de développement. Il contient :

- Le contexte et les objectifs du projet
- La liste des fonctionnalités attendues (besoins fonctionnels)
- Les contraintes techniques et de qualité (besoins non-fonctionnels)
- Les acteurs du système et leurs droits
- Les délais et jalons
- Les critères de recette (comment on valide que c'est terminé)

---

### 1.3 Les user stories

En méthode agile, les besoins s'expriment sous forme de **user stories** (récits utilisateur), selon le gabarit :

```
En tant que <rôle>,
je veux <action>
afin de <bénéfice>.
```

**Exemples pour CongeApp :**

| User story | Rôle | Action | Bénéfice |
| --- | --- | --- | --- |
| US-01 | Salarié | déposer une demande de congé | planifier mes absences |
| US-02 | Salarié | consulter mon solde de congés | savoir combien il m'en reste |
| US-03 | Manager | valider ou refuser une demande | gérer la disponibilité de l'équipe |
| US-04 | Admin RH | créer/supprimer des comptes | gérer les utilisateurs |

Chaque user story est accompagnée de **critères d'acceptation** : les conditions précises à remplir pour que la story soit considérée « terminée ». Exemple pour US-01 :
- Le salarié peut saisir une date de début et de fin
- La demande est refusée si les dates sont incohérentes
- La demande est refusée si le solde est insuffisant
- Un e-mail est envoyé au manager à la création

---

### 1.4 La méthode MoSCoW — prioriser les fonctionnalités

Tout ne peut pas être développé en même temps. MoSCoW aide à prioriser avec le client :

| Catégorie | Signification | Exemple CongeApp |
| --- | --- | --- |
| **M**ust have | Indispensable — sans ça, le produit n'a pas de sens | Déposer et valider une demande |
| **S**hould have | Important mais contournable temporairement | Notification e-mail au manager |
| **C**ould have | Confort, si le temps le permet | Export PDF du planning de congés |
| **W**on't have | Hors périmètre pour cette version | Application mobile native |

Le **MVP** (*Minimum Viable Product*) correspond aux fonctionnalités « Must have » — la version minimale mais utilisable du produit.

---

### 1.5 Identifier les acteurs et les rôles

L'analyse des besoins doit identifier **qui** utilisera le système et **avec quels droits**.

Pour CongeApp :

| Acteur | Droits |
| --- | --- |
| **Salarié** | Déposer une demande, consulter son solde et son historique |
| **Manager** | Valider ou refuser les demandes de son équipe |
| **Administrateur RH** | Gérer les utilisateurs, les soldes, les règles métier |

Cette identification des rôles est le point de départ du contrôle d'accès (*RBAC — Role-Based Access Control*) qui sera implémenté dans l'application.

---

> **🔒 Sécurité**
>
> La sécurité commence dès l'analyse — pas après le développement.
> - **Identifier les données sensibles** dès l'expression du besoin : CongeApp manipule des données personnelles (identité, e-mail) relevant du **RGPD**.
> - **Privacy by design** (article 25 RGPD) : ne collecter que les données strictement nécessaires.
> - **Définir les rôles et habilitations très tôt** : un salarié ne doit jamais voir les demandes d'un collègue.
> - Lister les **exigences de sécurité non-fonctionnelles** : chiffrement, authentification forte, traçabilité (logs), durée de conservation des données.
