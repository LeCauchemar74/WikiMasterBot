# Correctif v2.8.1

L’ouverture via Ctrl + Maj + N et la lecture des mails étaient identiques à celles de la v2.7. Cette version corrige une course au chargement : l’adresse et le code OTP n’étaient envoyés qu’une fois, même si WikiMasters n’était pas prêt. Désormais, la boîte mail réessaie jusqu’à ce que le script WikiMasters confirme le remplissage. Les envois simultanés et les répétitions après confirmation sont évités.

Le popup affiche maintenant si l’accès en navigation privée est autorisé.

## Installation du correctif

1. Extraire le ZIP. Remplacer les fichiers du dossier déjà chargé, puis cliquer sur Recharger dans chrome://extensions ou edge://extensions. Si un autre dossier est chargé comme nouvelle extension, désactiver l’ancienne version.
2. Dans Détails, activer « Autoriser en navigation privée » pour cette extension.
3. Ouvrir une NOUVELLE fenêtre privée avec Ctrl + Maj + N. Une fenêtre déjà ouverte avant le chargement de l’extension ne déclenche pas l’événement de création.
4. Les onglets 10MinuteMail et WikiMasters /signup doivent apparaître. L’adresse et le code sont transmis seulement dans la même fenêtre.

Ne laisser qu’une seule version de Pack Hunter active. La validation anti-robot reste manuelle.

Validation : neuf tests simulés réussis (trois sur ouverture/transfert d’adresse et OTP, six sur les échanges) et syntaxe vérifiée. La création réelle de compte n’a pas été exécutée. Ce correctif résout le défaut identifié dans le code ; l’origine exacte du blocage signalé dépend encore de l’étape où il survient.
