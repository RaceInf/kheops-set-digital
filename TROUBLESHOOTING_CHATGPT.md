# 🔧 Dépannage - Erreur de Connexion ChatGPT

## Problèmes de Connexion

### 1. Erreur "Clé API invalide"
**Symptômes :** Message d'erreur indiquant que la clé API est invalide
**Solutions :**
- Vérifiez que votre clé API commence par "sk-"
- Assurez-vous qu'elle fait au moins 20 caractères
- Vérifiez qu'elle n'a pas d'espaces avant ou après
- Testez votre clé sur [OpenAI Playground](https://platform.openai.com/playground)

### 2. Erreur "Accès refusé" (403)
**Symptômes :** Erreur 403 lors du test de connexion
**Solutions :**
- Vérifiez que votre compte OpenAI a des crédits disponibles
- Assurez-vous que votre clé API a les bonnes permissions
- Vérifiez que votre compte n'est pas suspendu

### 3. Erreur "Limite de taux atteinte" (429)
**Symptômes :** Erreur 429 lors de la génération
**Solutions :**
- Attendez quelques minutes avant de réessayer
- Vérifiez votre quota d'utilisation sur OpenAI
- Considérez passer à un plan payant si vous dépassez les limites

### 4. Erreur de réseau
**Symptômes :** Erreur de connexion ou timeout
**Solutions :**
- Vérifiez votre connexion internet
- Désactivez temporairement votre VPN si vous en utilisez un
- Vérifiez que les domaines OpenAI ne sont pas bloqués

## Problèmes de Longueur d'Articles

### 1. Article trop court
**Symptômes :** L'article généré fait moins de mots que demandé (ex: 2600 mots au lieu de 3000)
**Solutions automatiques :**
- Le système régénère automatiquement l'article si il fait moins de 90% de la longueur demandée
- Utilisez le bouton "Régénérer (plus long)" pour forcer une nouvelle génération
- Le système demande 500 mots supplémentaires lors de la régénération

**Solutions manuelles :**
- Augmentez la longueur cible de 500-1000 mots
- Choisissez le mode "Approfondi" pour plus de détails
- Ajoutez des options comme "Inclure des images" et "Optimisation SEO"
- Utilisez un template plus détaillé comme "Guide Complet"

### 2. Instructions pour ChatGPT améliorées
Le système utilise maintenant des instructions plus strictes :
- Calcul automatique du nombre de tokens cible
- Instructions répétées sur la longueur requise
- Avertissements que l'article sera rejeté s'il est trop court
- Demande de développer chaque section en détail

### 3. Modes de génération recommandés
- **Standard :** Pour des articles de 1500-2500 mots
- **Approfondi :** Pour des articles de 2500-4000 mots avec plus de détails
- **Recherche Web :** Pour des articles avec des données récentes

## Problèmes de Contenu

### 1. Contenu non structuré
**Symptômes :** L'article n'a pas de structure claire
**Solutions :**
- Vérifiez que le template est bien sélectionné
- Utilisez des templates avec une structure définie
- Ajoutez l'option "Optimisation SEO" pour une meilleure structure

### 2. Contenu hors sujet
**Symptômes :** L'article ne correspond pas au sujet demandé
**Solutions :**
- Soyez plus spécifique dans le sujet
- Choisissez une catégorie appropriée
- Utilisez le mode "Recherche Web" pour des informations plus précises

### 3. Erreurs de parsing JSON
**Symptômes :** Erreur lors de l'affichage de l'article
**Solutions :**
- Régénérez l'article
- Vérifiez que le sujet n'est pas trop complexe
- Utilisez un template plus simple

## Optimisation des Performances

### 1. Réduction du temps de génération
- Utilisez des sujets plus spécifiques
- Choisissez des catégories appropriées
- Évitez les sujets trop larges ou vagues

### 2. Amélioration de la qualité
- Utilisez le mode "Approfondi" pour des articles de qualité
- Activez l'optimisation SEO
- Choisissez des templates adaptés à votre contenu

## Logs et Débogage

### 1. Console du navigateur
Ouvrez les outils de développement (F12) et regardez la console pour :
- Voir les tentatives de génération
- Identifier les erreurs spécifiques
- Vérifier les ratios de longueur

### 2. Messages d'état
Le système affiche maintenant :
- Statut de génération en temps réel
- Ratio de longueur (mots générés / mots demandés)
- Avertissements si l'article est trop court
- Bouton de régénération automatique

## Configuration Recommandée

### Pour des articles de 3000+ mots :
1. Mode : "Approfondi"
2. Template : "Guide Complet" ou "Analyse de Tendances"
3. Longueur cible : 3500-4000 mots (pour compenser)
4. Options : Toutes activées (Images + SEO)

### Pour des articles rapides :
1. Mode : "Standard"
2. Template : "Tutoriel Pratique"
3. Longueur cible : 1500-2000 mots
4. Options : Selon vos besoins

## Support

Si vous rencontrez des problèmes persistants :
1. Vérifiez ce guide de dépannage
2. Consultez les logs dans la console
3. Testez avec des sujets plus simples
4. Vérifiez votre compte OpenAI

---

**Note :** Ce système utilise l'API OpenAI GPT-4 et nécessite une clé API valide avec des crédits disponibles. 