# Contribuer

Merci de contribuer au projet !

## Avant de modifier le code

- Vérifie que tu travailles sur une branche dédiée.
- Évite de modifier plusieurs comportements sans les documenter.
- Ne commit pas de données personnelles, de cookies, de sessions ou d'identifiants temporaires.

## Tests

Le projet ne possède pas de suite de tests automatisés. Après une modification :

1. recharge l'extension dans `chrome://extensions/` ;
2. teste la navigation vers `/pull` et `/pulls` ;
3. teste les fenêtres privées si la modification touche `background.js` ;
4. vérifie la console du service worker et des content scripts en cas d'erreur.

## Pull Request

Décris :

- le problème rencontré ;
- la solution choisie ;
- les fichiers modifiés ;
- le scénario testé ;
- les éventuelles limitations.
