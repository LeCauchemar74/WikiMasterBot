# Changelog

## [3.0.0] - 2026-09-28

### Ajouté
- Balise de prix dynamique directement sous chaque carte de la collection.
- Affichage progressif du prix moyen du marché carte par carte.
- Jusqu’à 3 requêtes marché exécutées en parallèle.
- Nouvelle tentative au rechargement pour les cartes marquées « Prix temporairement indisponible ».

### Modifié
- Bridge React isolé dans un content script MAIN pour récupérer les UUID des cartes.
- Cache local des prix conservé pendant 90 minutes.
- Nouvelle tentative après erreurs réseau, 429 et 5xx.
- Suppression des sorties console émises par l’extension.

## [2.8.0] - 2026-09-28

### Ajouté
- Prix moyen du marché sur les cartes visibles de `/collection`.
- Bridge MAIN world pour récupérer les UUID React des cartes.
- Cache local de 90 minutes et requêtes espacées.
- Section « Prix du marché » et bouton de vidage du cache dans le popup.

### Modifié
- Version du manifeste portée à 2.8.0.
- Documentation mise à jour.

# Changelog

## [2.7.0] - 2026-09-25

### Modifié
- Simplification de l'initialisation d'une fenêtre privée.
- Suppression du double mécanisme `windows.onCreated` / `tabs.onCreated` utilisé précédemment.
- Réutilisation d'un onglet `/signup` existant.
- Suppression des doublons `/signup` dans la même fenêtre privée.
- Conservation de WikiMasters comme onglet actif.

### Ajouté
- Bouton du popup pour fermer toutes les fenêtres privées.

## [2.6.0]

- Ajout de la fonction de fermeture de toutes les fenêtres privées via l'API `chrome.windows`.

## [2.5.0]

- Fiabilisation de l'initialisation de la fenêtre privée.
- Gestion plus robuste du premier onglet et de l'ordre d'ouverture.

## [2.4.0]

- Réorganisation de l'ouverture des onglets privés.

## Versions précédentes

- Amélioration progressive de la détection SPA, des timers, de la navigation `/pull` → `/pulls`, de la lecture de 10MinuteMail et de la gestion de l'inscription.
