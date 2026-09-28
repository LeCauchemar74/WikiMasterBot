# v2.8.2 — diagnostic du changement de destinataire

- Le popup conserve les erreurs de lancement au lieu de les écraser au rafraîchissement suivant.
- La recherche affiche le pseudo utilisé. Les espaces au début et à la fin sont retirés.
- Un envoi incertain indique son précédent destinataire lorsqu’il est connu. Changer de pseudo ne supprime pas cette protection.
- Si toutes les cartes sont déjà engagées, le statut explique qu’il faut consulter les offres envoyées. Aucune offre n’est annulée automatiquement.
- La lecture du pseudo mémorisé n’écrase plus une saisie commencée pendant l’ouverture du popup.

Si la première offre est en attente, ses cartes ne peuvent pas être offertes à nouveau. Pour changer leur destinataire, annuler manuellement l’ancienne offre dans Échanges → Envoyées, puis relancer. Si elle a été acceptée, les cartes ont déjà quitté le compte donneur.

Installation : remplacer les fichiers du dossier chargé, recharger l’extension dans edge://extensions, puis recharger l’onglet WikiMasters. Garder une seule version active et conserver l’autorisation InPrivate.

Les tests sont simulés. Ce correctif améliore les diagnostics ; sans le message d’erreur affiché chez l’utilisateur, la cause exacte de son blocage n’est pas confirmée.
