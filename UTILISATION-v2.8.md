# WikiMasters Pack Hunter v2.8

## Installation

Décompresse l’archive. Dans chrome://extensions (ou edge://extensions), active le mode développeur puis « Charger l’extension non empaquetée » et sélectionne le dossier. Désactive l’ancienne version pour éviter deux automatismes simultanés. Autorise l’extension en navigation privée si nécessaire. Recharge les onglets WikiMasters déjà ouverts.

## Donner les cartes

1. Depuis l’onglet connecté au compte qui DONNE les cartes, ouvre le popup.
2. Saisis le pseudo exact du destinataire et clique « Ajouter en ami puis proposer les cartes ». Les packs sont arrêtés dans cet onglet.
3. Accepte toi-même la demande sur le compte destinataire, dans une autre session. Une amitié déjà acceptée passe directement à l’envoi.
4. L’extension vérifie l’acceptation toutes les 5 secondes puis propose toutes les cartes disponibles, sans aucune carte ni monnaie demandée. Aucune monnaie n’est offerte non plus.
5. Accepte toi-même les offres sur le compte destinataire. Le script ne les accepte pas.

Le popup peut être fermé pendant l’attente. Garde l’onglet source ouvert, sans le recharger ni changer de compte. L’attente expire après 30 minutes. Après un rechargement ou une fermeture, il faut relancer ; aucune reprise automatique.

## Limites et erreurs

- Toutes les pages de collection sont lues. Les cartes déjà engagées dans une offre en attente sont exclues et comptées dans le résultat.
- Au plus 100 cartes par offre, conformément à l’interface. Les exemplaires d’un même type restent groupés. Plus de 100 exemplaires d’un seul type nécessitent un traitement manuel ; aucun envoi n’est alors effectué par cette exécution.
- Un verrou empêche les exécutions concurrentes entre onglets du même domaine et de la même session. Utilise un seul onglet source ; ne lance pas simultanément depuis les domaines avec et sans www.
- Arrêter empêche les prochains envois, sans retirer une offre ou une requête déjà partie.
- Aucun envoi n’est réessayé automatiquement. Après une erreur, vérifie Échanges → Envoyées puis clique « Envoi vérifié sur le site — débloquer » avant de relancer. Les cartes encore engagées seront exclues.
- Les restrictions et erreurs du site sont affichées, sans contournement.
- Le pseudo est mémorisé localement. Aucun mot de passe n’est demandé ; les requêtes utilisent la session de l’onglet.

## Validation

Formats de requêtes identifiés dans les scripts associés à WikiMasters.htm et WikiMasters2.htm. Six tests locaux simulés passent : attente d’acceptation et offre sans contrepartie, pagination/lots, exclusion des cartes engagées, réponse perdue sans réessai, interruption/propriétaire, regroupement des doublons. Syntaxe JavaScript vérifiée. Aucun échange réel ni test dans une extension installée n’a été effectué : la compatibilité en session connectée reste à vérifier.

Les fonctions existantes de la version 2.7 sont conservées. README.md décrit ces fonctions historiques.
