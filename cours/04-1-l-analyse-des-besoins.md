## 1. L'analyse des besoins

Tout projet commence par la compréhension du besoin réel du client. On distingue :

- Le **besoin fonctionnel** : ce que l'application doit faire (ex : « un salarié peut déposer une demande de congé »).
- Le **besoin non-fonctionnel** : les contraintes de qualité (performance, sécurité, disponibilité, accessibilité, compatibilité navigateurs…).

Ces besoins sont formalisés dans un **cahier des charges**. Pour les recueillir, on questionne le client, on exploite les informations existantes et on **anticipe les besoins** non exprimés.

### 1.1 Les user stories

En agile, un besoin s'exprime sous forme de *user story*, selon le gabarit :

```
En tant que <rôle>, je veux <action> afin de <bénéfice>.

Ex : En tant que salarié, je veux consulter mon solde de congés
     afin de planifier mes vacances.
```

Chaque story s'accompagne de **critères d'acceptation** (les conditions à remplir pour la considérer « terminée ») et d'une estimation de complexité.

### 1.2 Priorisation : la méthode MoSCoW

Tout n'a pas la même importance. La méthode MoSCoW classe les fonctionnalités :

| Catégorie | Signification | Exemple (CongeApp) |
| --- | --- | --- |
| **M**ust have | Indispensable, sans quoi le produit n'a pas de sens | Déposer une demande de congé |
| **S**hould have | Important mais contournable temporairement | Notification e-mail au manager |
| **C**ould have | Confort, si le temps le permet | Export PDF du planning |
| **W**on't have | Hors périmètre pour cette version | Application mobile native |

### 1.3 Exemple fil rouge : CongeApp

Pour illustrer tout ce cours, on s'appuie sur **CongeApp**, une application web de gestion des congés pour une PME. Acteurs identifiés : le **salarié** (dépose et suit ses demandes), le **manager** (valide ou refuse) et l'**administrateur RH** (gère les soldes, les utilisateurs et les règles). Ce périmètre simple permet de dérouler conception, développement et déploiement de bout en bout.

> **🔒 Sécurité**
>
> La sécurité commence dès l'analyse, pas après le développement.
> - **Identifier les données sensibles** dès l'expression du besoin : CongeApp manipule des données personnelles (identité, e-mail) relevant du **RGPD**.
> - **Privacy by design / by default** (article 25 RGPD) : ne collecter que les données strictement nécessaires (*minimisation*), et avec le niveau de confidentialité le plus protecteur par défaut.
> - **Définir les rôles et habilitations** très tôt : qui a le droit de voir/modifier quoi ? Un salarié ne doit jamais voir les demandes d'un collègue.
> - Lister les **exigences de sécurité non-fonctionnelles** : chiffrement, authentification forte, traçabilité (logs), durée de conservation des données.
