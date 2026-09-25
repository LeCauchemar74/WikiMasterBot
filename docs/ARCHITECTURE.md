# Architecture

## `manifest.json`

Déclare l'extension Manifest V3, les permissions, les domaines autorisés, le service worker et les content scripts.

## `background.js`

Responsabilités :

- détecter les nouvelles fenêtres privées ;
- initialiser les onglets 10MinuteMail / WikiMasters ;
- éviter les doublons d'onglets `/signup` ;
- fermer les fenêtres privées lorsqu'une action explicite du popup le demande ;
- relayer les messages entre 10MinuteMail et les pages WikiMasters de la même fenêtre.

## `content.js`

Responsabilités côté WikiMasters :

- détecter le domaine et la route courante ;
- surveiller les transitions SPA ;
- gérer le passage `/pull` → `/pulls` ;
- piloter la progression des paquets ;
- détecter une carte légendaire ;
- gérer le popup / overlay et les réglages ;
- traiter le remplissage de l'inscription et du code de vérification transmis par le service worker.

## `email.js`

Responsabilités côté 10MinuteMail :

- détecter l'adresse temporaire ;
- détecter les nouveaux messages ;
- rechercher un message WikiMasters ;
- extraire le code de vérification ;
- envoyer les données au service worker.

## `popup.js`

Responsabilités :

- afficher l'état courant ;
- activer / désactiver l'automatisation ;
- sauvegarder les timers ;
- réinitialiser les réglages ;
- demander la fermeture des fenêtres privées.
