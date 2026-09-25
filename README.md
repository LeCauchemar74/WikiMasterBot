# WikiMasters Pack Hunter

Extension Chrome (Manifest V3) pour assister la navigation et l'ouverture de paquets sur [WikiMasters](https://www.wiki-masters.com/).

> **État du projet : expérimental**
>
> Le projet est conçu pour un usage local et personnel. La vérification affichée sur `/pull` reste une **action manuelle** : l'extension n'essaie pas de contourner une protection anti-bot ou une vérification de type CAPTCHA/Turnstile.

![Chrome](https://img.shields.io/badge/Chrome-Manifest%20V3-4285F4?logo=googlechrome&logoColor=white)
![Version](https://img.shields.io/badge/version-2.7.0-orange)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Fonctionnalités

### Automatisation des paquets
- Détection de la route WikiMasters `/pulls`.
- Détection des transitions SPA/Next.js sans rechargement manuel.
- Détection de la page `/pull` comme étape de démarrage après la vérification manuelle.
- Ouverture et progression entre les cartes selon les délais configurés.
- Détection d'une carte légendaire et arrêt de l'automatisation lorsqu'une légendaire est trouvée.
- Affichage de l'état et du nombre de paquets parcourus dans le popup.

### Gestion des fenêtres privées
- Détection de la création d'une fenêtre privée.
- Initialisation d'un onglet 10MinuteMail et d'un onglet WikiMasters.
- WikiMasters `/signup` est placé au premier plan.
- Protection contre la création de plusieurs onglets `/signup` dans la même fenêtre privée.
- Bouton dans le popup pour fermer toutes les fenêtres privées ouvertes par Chrome.

### Inscription / adresse temporaire / code de vérification
- Lecture de l'adresse générée par 10MinuteMail.
- Transmission de l'adresse à l'onglet WikiMasters `/signup` de la même fenêtre.
- Pré-remplissage des champs d'inscription pris en charge par la page.
- Détection des messages WikiMasters arrivant dans 10MinuteMail.
- Extraction du code de vérification et transmission à WikiMasters.
- Soumission du bouton de vérification lorsque le formulaire est effectivement prêt.

## 🧩 Architecture

Le projet est volontairement simple :

```text
WikiMasters Pack Hunter/
├── manifest.json       # Configuration de l'extension Chrome
├── background.js       # Service worker : fenêtres privées, messages et onglets
├── content.js          # Logique WikiMasters : routes, packs, cartes, inscription
├── email.js            # Lecture de 10MinuteMail et récupération du code
├── popup.html          # Interface du popup
├── popup.js            # Logique du popup et réglages
├── popup.css           # Style du popup
└── README.md
```

Pour une description plus détaillée, voir [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## 🚀 Installation

### Installation locale dans Chrome / Chromium / Brave / Edge

1. Télécharge ou clone ce dépôt.
2. Ouvre `chrome://extensions/`.
3. Active **Mode développeur**.
4. Clique sur **Charger l'extension non empaquetée**.
5. Sélectionne le dossier du projet, celui contenant `manifest.json`.
6. Ouvre les détails de l'extension et active **Autoriser en navigation privée** si tu utilises la partie fenêtre privée.

Guide pas à pas : [`docs/INSTALLATION.md`](docs/INSTALLATION.md).

## ⚙️ Réglages

Le popup permet d'ajuster les temporisations suivantes :

| Réglage | Valeur par défaut |
|---|---:|
| Détection / polling | 120 ms |
| Après ouverture d'un pack | 250 ms |
| Entre les cartes | 180 ms |
| Réessai / attente | 500 ms |
| Changement de page | 150 ms |
| Lecture des mails | 500 ms |
| Avant remplissage du code | 150 ms |
| Avant remplissage de l'inscription | 150 ms |
| Avant vérification de l'inscription | 150 ms |
| Vérification du bouton d'inscription | 75 ms |
| Temps maximum d'attente du bouton | 15 000 ms |
| Avant clic sur « Vérifier et continuer » | 150 ms |

Les valeurs sont enregistrées avec `chrome.storage.local`.

## 🔐 Permissions demandées

Le `manifest.json` demande :

- `storage` : enregistrer les réglages locaux de l'extension ;
- `windows` : gérer les fenêtres privées utilisées par l'extension ;
- accès aux domaines `wiki-masters.com`, `www.wiki-masters.com` et `10minutemail.com` : exécuter les content scripts et communiquer avec les pages concernées.

Le projet n'utilise pas de serveur externe propre à l'extension pour stocker les données du navigateur.

## 🧪 Développement

Le projet est une extension Chrome **Manifest V3** sans étape de compilation : les fichiers JavaScript, HTML et CSS sont chargés directement par le navigateur.

Pour modifier le code :

```bash
git clone <URL_DU_REPO>
cd WikiMasters-PackHunter
```

Puis recharge l'extension depuis `chrome://extensions/` après chaque modification.

Voir [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) pour la méthode de test et de débogage.

## 🗺️ Flux général

```text
Ouverture d'une fenêtre privée
          │
          ├── 10MinuteMail
          │
          └── WikiMasters /signup
                    │
                    └── inscription / vérification
                              │
                              ▼
                         WikiMasters /pull
                              │
                        vérification manuelle
                              │
                              ▼
                         WikiMasters /pulls
                              │
                    ouverture des paquets
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
       carte légendaire                  aucune légendaire
              │                               │
              ▼                               ▼
             STOP                     poursuite du cycle
```

## ⚠️ Limitations

- Le fonctionnement dépend de la structure HTML et du comportement JavaScript de WikiMasters et de 10MinuteMail ; une modification de ces sites peut casser certains sélecteurs.
- La route `/pull` demande une validation manuelle. Cette étape n'est pas contournée par l'extension.
- Une extension Chrome installée en mode développeur peut afficher des avertissements liés aux permissions et au mode développeur.
- Le projet n'inclut pas de système de build, de publication Chrome Web Store ou de télémétrie.

## 🐛 Problèmes connus / diagnostic rapide

### L'extension ne se lance pas après une navigation vers `/pulls`
Vérifie que l'extension est bien activée dans `chrome://extensions/` et recharge l'extension. La version actuelle installe la surveillance de navigation très tôt (`document_start`) et surveille aussi les transitions SPA.

### L'onglet WikiMasters apparaît plusieurs fois
Vérifie qu'une seule copie de l'extension est installée/activée. Le service worker de la version 2.7 protège également l'initialisation de la fenêtre privée contre les doublons de `/signup`.

### Le code 10MinuteMail n'arrive pas dans WikiMasters
Vérifie que les deux onglets sont dans la **même fenêtre** et que l'accès en navigation privée est autorisé pour l'extension.

## 📦 Version

Version actuelle : **2.7.0**

Historique synthétique :
- `v2.4` : amélioration de l'initialisation des onglets privés ;
- `v2.5` : fiabilisation de l'ouverture de la fenêtre privée ;
- `v2.6` : ajout de la fermeture des fenêtres privées depuis le popup ;
- `v2.7` : suppression du double déclenchement de création d'onglet et protection contre les doublons `/signup`.

Voir [`CHANGELOG.md`](CHANGELOG.md) pour l'historique détaillé.

## 🤝 Contribution

Les contributions sont les bienvenues pour améliorer la stabilité des sélecteurs, la détection des routes SPA, l'interface du popup et la documentation.

Merci de lire [`CONTRIBUTING.md`](CONTRIBUTING.md) avant d'ouvrir une Pull Request.

## 📄 Licence

Ce projet est distribué sous licence MIT. Voir [`LICENSE`](LICENSE).
