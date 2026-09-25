# Développement et débogage

## Recharger le projet

Le projet n'a pas de bundler ni de compilation. Les fichiers sont directement interprétés par le navigateur.

Après une modification :

```text
chrome://extensions/ → Recharger
```

## Déboguer le service worker

Dans `chrome://extensions/`, ouvre :

> Service worker → Inspecter

Les messages du fichier `background.js` sont visibles dans cette console.

## Déboguer `content.js`

Sur une page WikiMasters :

1. ouvre les DevTools (`F12`) ;
2. onglet **Console** ;
3. filtre éventuellement sur `WikiMasters Pack Hunter`.

## Vérifier les routes

Le comportement principal dépend notamment de :

```text
/pull
/pulls
/signup
```

Le script surveille les transitions SPA pour éviter de dépendre d'un rechargement manuel.

## Déboguer 10MinuteMail

Sur `https://10minutemail.com/` :

- vérifie que `#mail_address` contient bien une adresse ;
- vérifie que les messages apparaissent dans `.mail_message` ;
- vérifie que le contenu du message est disponible dans `.message_bottom`.
