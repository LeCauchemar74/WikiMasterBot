# v2.8.3 — isoler l’erreur serveur

Cette version ne prétend pas résoudre une erreur serveur dont la cause est inconnue. Elle ajoute le code HTTP, l’opération et le nombre de cartes au message d’erreur, ainsi que les champs error/message/code renvoyés par le site lorsqu’ils existent.

Le bouton « Tester l’envoi d’une seule carte » propose UNE vraie carte disponible au pseudo saisi, sans contrepartie, puis s’arrête. Il n’accepte pas l’offre, ne réessaie pas un envoi et ne poursuit pas avec le reste de la collection. Il utilise la même identification, amitié et protection contre les doublons que le parcours normal.

Après mise à jour, recharger l’extension puis l’onglet WikiMasters. Si un précédent envoi est indiqué comme incertain, vérifier d’abord les offres envoyées sur le site ; ensuite seulement utiliser le bouton de déblocage manuel.

Si le test fonctionne, comparer avec l’envoi de plusieurs cartes. S’il échoue, transmettre le message complet désormais affiché (exemple : POST /api/trades — HTTP 500 — 1 carte(s) : Erreur serveur). Une réussite manuelle ne prouve pas que le lot automatique, constitué d’autres exemplaires ou de davantage de cartes, sera accepté.
