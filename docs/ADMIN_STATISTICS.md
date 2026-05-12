# Statistiques du Tableau de Bord - Administration

## Vue d'ensemble

Le tableau de bord d'administration affiche des statistiques en temps réel sur la gestion des articles, avec des métriques essentielles et pratiques pour le suivi quotidien.

## Métriques disponibles

### 1. Total Articles
- **Description** : Nombre total d'articles dans le système
- **Calcul** : Somme de tous les articles (tous statuts confondus)
- **Couleur** : Bleu (gradient bleu-indigo)
- **Utilité** : Vue d'ensemble de la production de contenu

### 2. Publiés
- **Description** : Articles actuellement visibles sur le site
- **Calcul** : Articles avec le statut "published"
- **Couleur** : Vert (gradient vert-émeraude)
- **Utilité** : Contenu actuellement accessible aux visiteurs

### 3. Brouillons
- **Description** : Articles en cours de rédaction
- **Calcul** : Articles avec le statut "draft"
- **Couleur** : Jaune (gradient jaune-ambre)
- **Utilité** : Travail en cours et contenu en préparation

### 4. Archivés
- **Description** : Articles conservés mais non visibles
- **Calcul** : Articles avec le statut "archived"
- **Couleur** : Orange (gradient orange-rouge)
- **Utilité** : Contenu historique et articles obsolètes

### 5. Corbeille
- **Description** : Articles supprimés mais récupérables
- **Calcul** : Articles avec le statut "trash"
- **Couleur** : Rouge (gradient rouge-rose)
- **Utilité** : Articles en attente de suppression définitive

## Mise à jour en temps réel

### Déclencheurs de mise à jour
- **Changement d'onglet** : Les statistiques se mettent à jour automatiquement
- **Actions sur les articles** : Publication, archivage, suppression, etc.
- **Import/Export** : Après modification de la base de données
- **Restauration** : Après récupération depuis la corbeille

### Synchronisation
- Les statistiques sont synchronisées entre le tableau de bord et le générateur d'articles
- Mise à jour instantanée sans rechargement de page
- Cohérence garantie entre tous les composants

## Interprétation des métriques

### Indicateurs de performance
- **Beaucoup de brouillons** : Travail en cours important
- **Peu d'articles publiés** : Contenu en préparation
- **Corbeille pleine** : Nettoyage nécessaire
- **Archives importantes** : Gestion active de l'obsolescence

### Recommandations
- **Maintenir un équilibre** entre articles publiés et brouillons
- **Archiver régulièrement** les articles obsolètes
- **Vider la corbeille** périodiquement
- **Surveiller les tendances** sur le long terme

## Responsive Design

### Affichage mobile
- Grille adaptative : 1 colonne sur mobile, 2 sur tablette, 3 sur desktop, 5 sur grand écran
- Cartes compactes avec informations essentielles
- Navigation tactile optimisée

### Affichage desktop
- Vue d'ensemble complète avec toutes les métriques
- Gradients colorés pour une identification rapide
- Espacement optimisé pour la lisibilité

## Intégration technique

### Composants impliqués
- `Admin.tsx` : Tableau de bord principal
- `ArticleGeneratorTest.tsx` : Générateur d'articles
- `articleManager.ts` : Gestionnaire de données

### Flux de données
1. `articleManager.getStats()` : Récupération des statistiques
2. `updateStats()` : Mise à jour de l'état
3. `onStatsUpdate()` : Callback de synchronisation
4. Rendu automatique des composants

### Performance
- Calculs optimisés sans impact sur les performances
- Mise à jour conditionnelle uniquement si nécessaire
- Cache local pour éviter les recalculs inutiles 