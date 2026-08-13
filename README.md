CAHIER DES CHARGES — TASKFLOW PRO
Application avancée de gestion de projets, tâches et équipes
Technologies : HTML5, CSS3, Tailwind CSS, JavaScript ES6+
Niveau : Avancé
Type : Projet fil rouge / Projet de fin de formation en Javascript
Backend : Nodejs
Architecture : JavaScript modulaire et orientée objet
Framework JavaScript : Interdit
API externe : Non obligatoire
1. Présentation du projet
1.1 Contexte
Les équipes de développement, agences digitales, étudiants et freelances doivent régulièrement gérer plusieurs projets, tâches, échéances et collaborateurs.
L'objectif de ce projet est de développer une application web complète permettant de centraliser la gestion de ces éléments.
L'application, appelée TaskFlow Pro, devra permettre à un utilisateur de :
créer et gérer des projets ;
créer et gérer des tâches ;
affecter des tâches à des membres ;
organiser les tâches dans un tableau Kanban ;
suivre les échéances ;
rechercher et filtrer les données ;
consulter des statistiques ;
personnaliser l'interface ;
sauvegarder automatiquement les données ;
exporter et importer les données.
Toutes les données devront être persistantes grâce au mongoDB de nodejs.
2. Contraintes techniques
Technologies obligatoires
HTML5
CSS3
Tailwind CSS
JavaScript ES6+
3. Utilisateur cible
L'application est destinée à un utilisateur souhaitant gérer son activité ou ses projets personnels.
Exemples :
développeur freelance ;
étudiant ;
chef de projet ;
petite équipe ;
agence digitale ;
équipe pédagogique.
4. Fonctionnalités générales
L'application devra contenir au minimum les espaces suivants :
Dashboard
Projets
Tâches
Kanban
Membres
Statistiques
Paramètres
5. Dashboard
Le Dashboard constitue la page d'accueil.
Il devra afficher des indicateurs dynamiques.
5.1 Statistiques générales
Afficher :
nombre total de projets ;
projets actifs ;
projets terminés ;
nombre total de tâches ;
tâches à faire ;
tâches en cours ;
tâches terminées ;
tâches en retard ;
nombre de membres.
Les données doivent être calculées dynamiquement à partir des données présentes dans le mongoDB.
5.2 Progression globale
Afficher le taux global de réalisation :
Tâches terminées / Nombre total de tâches × 100

Exemple :
Progression globale

████████████████░░░░ 78 %

78 tâches terminées sur 100

5.3 Projets récents
Afficher les derniers projets créés.
Chaque projet doit afficher :
nom ;
description ;
statut ;
progression ;
date de création ;
deadline.
5.4 Tâches urgentes
Afficher les tâches :
proches de leur échéance ;
en retard ;
de priorité urgente.
6. Gestion des projets
6.1 Création
L'utilisateur doit pouvoir créer un projet.
Champs :
nom ;
description ;
couleur ;
statut ;
date de début ;
deadline.
6.2 Modification
L'utilisateur peut modifier les informations d'un projet.
6.3 Suppression
La suppression doit demander une confirmation.
Exemple :
Supprimer le projet ?

Cette action supprimera également les tâches
associées au projet.

[Annuler] [Supprimer]

6.4 Archivage
Un projet peut être :
actif ;
terminé ;
archivé.
Un projet archivé ne doit plus apparaître dans les listes principales, sauf si l'utilisateur active le filtre correspondant.
7. Gestion des tâches
La gestion des tâches constitue le cœur de l'application.
7.1 Création
Une tâche doit contenir :
titre ;
description ;
statut ;
priorité ;
projet ;
membre assigné ;
tags ;
deadline.
7.2 Priorités
Les niveaux disponibles :
low ;
medium ;
high ;
urgent.
7.3 Statuts
Les statuts disponibles :
todo
in-progress
paused
completed
8. CRUD des tâches
L'utilisateur doit pouvoir :
créer ;
consulter ;
modifier ;
supprimer ;
terminer ;
réouvrir une tâche.
Toute modification doit être immédiatement sauvegardée dans le MongoDB.
9. Tableau Kanban
Créer un tableau Kanban contenant quatre colonnes :
À FAIRE
EN COURS
EN PAUSE
TERMINÉ

Les tâches doivent être affichées sous forme de cartes.
10. Drag and Drop
L'utilisateur doit pouvoir déplacer une tâche d'une colonne à une autre.
Exemple :
À FAIRE
   ↓
EN COURS
   ↓
EN PAUSE
   ↓
TERMINÉ

Lorsqu'une tâche est déplacée :
son statut doit être modifié ;
le nouvel état doit être sauvegardé ;
le tableau doit être actualisé ;
les statistiques doivent être recalculées.

11. Gestion des membres
L'application devra permettre de gérer les membres d'une équipe.
Informations
Chaque membre possède :
identifiant ;
nom ;
prénom ;
email ;
rôle ;
avatar ;
date de création.
Rôles
Exemples :
développeur ;
designer ;
chef de projet ;
product manager ;
testeur ;
autre.
12. Affectation des tâches
Une tâche peut être assignée à un membre.
L'interface devra permettre de :
sélectionner un membre ;
changer le membre ;
retirer l'affectation.
13. Recherche
Une recherche globale doit permettre de rechercher :
tâches ;
projets ;
membres.
14. Gestion des deadlines
L'application doit automatiquement analyser les dates.
Une tâche peut être :
En avance
Échéance proche
Échéance aujourd'hui
En retard
Terminée

Exemple :
🔴 En retard de 3 jours

🟠 Échéance demain

🟢 Échéance dans 8 jours

✅ Terminée
15. Détails d'une tâche
Un clic sur une tâche doit ouvrir une fenêtre détaillée.
La fenêtre devra afficher :
titre ;
description ;
projet ;
membre ;
priorité ;
statut ;
tags ;
date de création ;
deadline ;
historique éventuel.
Actions :
Modifier
Terminer
Supprimer
Fermer

16. Historique des tâches
Fonctionnalité avancée.
Chaque tâche peut conserver un historique.
Exemple :
12 août — Statut modifié :
À faire → En cours

12 août — Priorité modifiée :
Moyenne → Haute

13 août — Tâche assignée à :
Fatou

13 août — Statut modifié :
En cours → Terminé

Cela permettra de travailler avec des tableaux d'objets et des événements métier.
17. Notifications
Créer un système de notification interne.
Types :
succès ;
erreur ;
avertissement ;
information.
Exemples :
✓ Projet créé avec succès

✓ Tâche mise à jour

⚠ Cette tâche arrive à échéance demain

✕ Impossible de supprimer le projet

Les notifications doivent disparaître automatiquement après quelques secondes.
18. Initialisation des données
Lors de la première ouverture de l'application, si aucune donnée n'existe, l'application doit créer automatiquement des données de démonstration (fictif).
Exemple :
3 projets
12 tâches
5 membres

Un bouton devra permettre de réinitialiser les données de démonstration.
19. Export des données
L'utilisateur peut exporter toutes ses données.
Le fichier généré devra contenir :
projets ;
tâches ;
membres ;
paramètres ;
historique.
Format :
taskflow-backup-2026-08-13.json ou fichier pdf / excel.
20. Dark Mode
L'application doit proposer :
☀️ Light
🌙 Dark

Le choix doit être sauvegardé dans LocalStorage.
Au prochain chargement, le thème sélectionné doit être automatiquement restauré.
21. Paramètres
La page paramètres devra permettre de configurer :
thème ;
affichage ;
confirmation avant suppression ;
réinitialisation des données ;
export ;
import.
22. Statistiques
Créer une page dédiée aux statistiques.
Afficher :
Tâches
Total
À faire
En cours
En pause
Terminées
En retard

Priorités
Faible
Moyenne
Haute
Urgente

Projets
Afficher la progression de chaque projet.
23. Calcul de progression
La progression d'un projet doit être calculée à partir de ses tâches.
Exemple :
Projet E-commerce

10 tâches
7 terminées

Progression : 70 %

La formule :
tâches terminées / tâches totales × 100

Un projet sans tâche doit afficher :
Aucune tâche

et non NaN.
24. Validation
Tous les formulaires doivent être validés.
Exemples de règles :
Projet
nom obligatoire ;
minimum 3 caractères ;
description facultative ;
deadline valide.
Tâche
titre obligatoire ;
minimum 3 caractères ;
projet obligatoire ;
priorité obligatoire.
Utilisateur
nom obligatoire ;
email valide ;
rôle obligatoire.
25. Responsive Design
L'application doit être utilisable sur :
ordinateur ;
tablette ;
mobile.
Le Kanban devra rester exploitable sur petit écran.
26. Sécurité côté client
Même si l'application fonctionne uniquement côté navigateur, l'apprenant doit éviter les mauvaises pratiques.
Notamment :
éviter l'injection HTML non maîtrisée ;
privilégier textContent lorsque nécessaire ;
valider les données importées ;
gérer les erreurs JSON ;
ne jamais stocker de véritables mots de passe.
27. Architecture finale attendue
TASKFLOW PRO
│
├── index.html
│
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── style.css
│   ├── dashboard.css
│   ├── kanban.css
│   ├── forms.css
│   └── responsive.css
│
├── assets/
│   └── images/
│
└── js/
    │
    ├── app.js
    │
    ├── models/
    │   ├── Entity.js
    │   ├── Task.js
    │   ├── Project.js
    │   └── User.js
    │
    ├── services/
    │   ├── StorageManager.js
    │   ├── TaskService.js
    │   ├── ProjectService.js
    │   ├── UserService.js
    │   └── FakeAPI.js
    │
    ├── controllers/
    │   ├── TaskController.js
    │   ├── ProjectController.js
    │   ├── UserController.js
    │   └── DashboardController.js
    │
    ├── components/
    │   ├── Modal.js
    │   ├── Notification.js
    │   ├── TaskCard.js
    │   ├── ProjectCard.js
    │   ├── UserCard.js
    │   └── Kanban.js
    │
    ├── store/
    │   └── Store.js
    │
    └── utils/
        ├── constants.js
        ├── helpers.js
        ├── validators.js
        ├── dateUtils.js
        └── formatters.js

28. Livrables
L'apprenant devra fournir :
Livrable 1
Le projet complet.
Livrable 2
Un fichier README contenant :
présentation ;
fonctionnalités ;
installation ;
architecture ;
technologies ;
captures d'écran ;
difficultés rencontrées ;
améliorations possibles.
29. Conditions de réussite
Pour valider le projet, l'apprenant doit au minimum :
avoir un CRUD fonctionnel ;
utiliser réellement les classes JavaScript ;
utiliser des modules ES6 ;
utiliser MongoDB ;
implémenter le Kanban ;
implémenter le Drag & Drop ;
gérer les deadlines ;
avoir un Dashboard dynamique ;
gérer les erreurs ;
30. Niveau attendu
Ce projet est considéré comme avancé.
Un apprenant capable de réaliser correctement l'ensemble du cahier des charges doit être capable de :
concevoir une application JavaScript sans framework ;
structurer un projet complexe ;
manipuler efficacement le DOM ;
gérer un état applicatif ;
persister des données ;
construire des fonctionnalités métier ;
gérer les erreurs ;
écrire du JavaScript moderne et modulaire.

NB : TaskFlow Pro doit être considéré comme un projet de synthèse JavaScript : l'apprenant ne doit pas seulement faire fonctionner l'application, mais démontrer qu'il sait concevoir, structurer et maintenir une application JavaScript complexe.


