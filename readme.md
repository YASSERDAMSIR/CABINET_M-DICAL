# 🏥 Application de Gestion des Soins à Domicile & Indemnités

Une application web moderne, fluide et responsive, conçue pour un **Cabinet Médical** afin d'assurer le suivi des soins à domicile prodigués par les infirmiers, ainsi que le calcul automatisé de leurs indemnités kilométriques et primes de pénibilité par le Major (Admin).

---

## 🛠️ Technologies Utilisées

* **HTML5 & CSS3** : Structure sémantique et design moderne inspiré par des palettes médicales épurées (utilisation de variables CSS, flexbox et grid).
* **JavaScript (ES6+)** : Logique métier dynamique, manipulation du DOM, et gestion du cycle de vie des sessions.
* **Node.js & Express.js** : Création d'API REST dynamiques pour la gestion du backend.
* **File System (FS)** : Persistance des données via des fichiers JSON locaux (`users.json` et `soins.json`).
* **FontAwesome (v6.4.0)** : Bibliothèque d'icônes vectorielles pour enrichir l'expérience utilisateur visuelle.

---

## 📂 Structure du Projet

```text
├── data/
│   ├── soins.json    # Base de données locale des soins
│   └── users.json    # Base de données locale des utilisateurs
├── public/
│   ├── index.html    # Page d'authentification (Connexion / Inscription)
│   ├── agent.html    # Interface Infirmier : CRUD complet des fiches de soins
│   ├── admin.html    # Interface Major (Admin) : Calcul des indemnités & KPIs
│   └── style.css     # Feuille de style globale
├── package.json      # Dépendances du projet Node.js
└── server.js         # Serveur Express et APIs Backend
```

## ⚖️ Logique Métier & Règles de Calcul
L'application intègre de façon automatisée les calculs administratifs définis par la gestion du cabinet :

1 - Forfait de Base : Fixé par défaut à 1500.00 DH et modifiable directement depuis l'interface d'analyse de l'administrateur.

2 - Seuil Kilométrique Plafond : Un seuil quotidien de 20 Km / Jour est établi pour la facturation des trajets.

3 - Indemnité Kilométrique Supplémentaire : Chaque kilomètre dépassant le seuil quotidien de 20 Km est rémunéré à hauteur de 2.00 DH / Km.

4 - Prime de Pénibilité : Tout soin dont la durée stricte dépasse 30 minutes (calculée dynamiquement via la différence entre l'heure de début et l'heure de fin) donne droit à une prime fixe de 10.00 DH.

Total Indemnite=Forfait Base+(Km Supp×2)+(Nombre de Soins Penibles×10)

## 🚀 Fonctionnalités Clés
🔒 1. Système d'Authentification Intégré (index.html)
-Bascule d'affichage : Passage dynamique et fluide entre le formulaire de connexion et d'inscription.

-Gestion des Rôles : Redirection automatique selon le privilège du compte (admin vers admin.html et infirmier vers agent.html).

-Sécurisation des routes : Vérification systématique de l'état de la session locale (activeUser). Toute tentative d'accès non autorisé redirige vers l'accueil.

🩺 2. Espace Infirmier / Agent (agent.html)
-CRUD Complet : Ajout, modification visuelle et suppression des fiches de soins.

-Side-Panel Animé : Formulaire de saisie ergonomique glissant depuis la droite pour une expérience utilisateur moderne.

-Calcul de Durée Synchrone : Transformation automatique des horaires saisis en format lisible (ex: 1h15min).

📊 3. Espace Admin / Major (admin.html)
-Filtre Temporel : Analyse globale de l'ensemble des données indexée par mois d'activité (YYYY-MM).

-Grid de Statistique (KPIs) : Rappel visuel des constantes réglementaires et des seuils du cabinet.

-Rapport de Synthèse Extensible : Tableau croisé affichant la distance totale, les dépassements réels de kilomètres, le nombre de soins pénibles et le détail transparent de la rémunération pour chaque infirmier.

## ⚙️ Installation et Lancement

1 - Téléchargez les fichiers du projet dans votre répertoire local.

2 - Exécutez `npm install` dans votre terminal pour installer les dépendances.

3 - Lancez le serveur avec `node server.js` ou `npm start`.

4 - Accédez à l'application via `http://localhost:3000`.

5 - Assurez-vous d'avoir l'image de fond configurée dans votre fichier CSS (`Gemini_Generated_Image_4x185j4x185j4x18 (1).png`) présente pour préserver l'identité visuelle de la page d'accueil.

6 - Comptes de test pré-configurés :
 
    1 _ Admin / Major : Identifiant : Major | Mot de passe : admin2026

    2 _ Infirmier : Identifiant : Yasmine | Mot de passe : yas123 
