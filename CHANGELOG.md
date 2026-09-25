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
