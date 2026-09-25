# Installation

## 1. Télécharger le projet

Clone le dépôt :

```bash
git clone <URL_DU_REPO>
cd WikiMasters-PackHunter
```

Ou télécharge le dépôt au format ZIP depuis GitHub.

## 2. Charger l'extension

Dans Chrome, Chromium, Brave ou un navigateur compatible Chromium :

```text
chrome://extensions/
```

Active :

> Mode développeur

Puis :

> Charger l'extension non empaquetée

Sélectionne le dossier contenant `manifest.json`.

## 3. Navigation privée

Pour utiliser le workflow avec 10MinuteMail et les fenêtres privées, ouvre les détails de l'extension et active :

> Autoriser en navigation privée

## 4. Vérifier le chargement

Ouvre le popup de l'extension et vérifie qu'il détecte la page active.

Sur WikiMasters :

- `/pull` : étape de démarrage / vérification manuelle ;
- `/pulls` : automatisation des paquets.

## 5. Recharger après modification

Après chaque changement du code :

1. retourne sur `chrome://extensions/` ;
2. clique sur **Recharger** ;
3. recharge la page du site seulement si nécessaire pour repartir d'un état propre.
