# Introduction

Ce document est un cours de synthèse couvrant l'ensemble du cycle de vie d'une application, **de sa conception à son déploiement**, tel qu'abordé dans la formation Concepteur Développeur d'Applications (CDA). L'objectif n'est pas seulement de lister des notions, mais de montrer comment elles s'enchaînent : on part d'un besoin client, on le modélise, on le développe en couches, on le teste, puis on le met en production de façon automatisée et sécurisée.

Un fil rouge traverse tout le document : la **sécurité**. Elle n'est pas un chapitre isolé mais une préoccupation présente à chaque étape — on parle de *Security by Design*. À chaque grande notion, un encadré « Sécurité » rappelle les points de vigilance correspondants.

---

### Une convention à connaître avant de commencer

**Le cours illustre, les quiz évaluent — et les deux ne visent pas la même chose.**

Les exemples de code du cours sont écrits en **C# et en SQL**, parce qu'il faut bien choisir un langage pour montrer du code réel. Ce sont des illustrations : ce qui compte est le raisonnement, pas la syntaxe. Une couche d'accès aux données, une injection de dépendance ou une requête paramétrée s'écrivent différemment en Java, en PHP ou en Python, mais répondent au même besoin.

Les **questions d'entraînement**, elles, sont volontairement formulées **sans langage imposé** : elles portent sur les concepts, et le code qu'elles présentent est du pseudo-code, du SQL standard ou des échanges HTTP. C'est aussi la logique du référentiel CDA, qui ne prescrit aucune technologie — le jury évalue une démarche de conception, pas la maîtrise d'un cadriciel particulier.

Concrètement : si tu développes en Java ou en Python, lis les exemples C# comme tu lirais un schéma, et concentre-toi sur ce qu'ils démontrent.
