# Gestion des Articles - Interface d'Administration

## Vue d'ensemble

L'interface d'administration des articles offre une gestion complète du cycle de vie des articles, de la génération à la publication, en passant par l'archivage et la corbeille.

## Fonctionnalités principales

### 1. Génération d'Articles
- **Génération automatique** : Création d'articles via IA avec titre et catégorie
- **Sélection d'images** : Intégration d'images depuis Pexels, Pixabay et Unsplash
- **Aperçu en temps réel** : Visualisation du contenu généré
- **Mode HTML/Text** : Basculement entre affichage formaté et code HTML brut

### 2. Gestion des Statuts

#### Brouillons
- Articles en cours de rédaction
- Actions disponibles :
  - **Publier** : Passer en statut "publié"
  - **Modifier** : Éditer le contenu
  - **Supprimer** : Suppression définitive

#### Articles Publiés
- Articles visibles sur le site
- Actions disponibles :
  - **Modifier** : Éditer le contenu
  - **Archiver** : Déplacer vers les archives
  - **Corbeille** : Déplacer vers la corbeille

#### Archives
- Articles archivés (non visibles mais conservés)
- Actions disponibles :
  - **Aperçu** : Visualiser le contenu
  - **Désarchiver** : Remettre en statut "publié"
  - **Corbeille** : Déplacer vers la corbeille

#### Corbeille
- Articles supprimés (récupérables)
- Actions disponibles :
  - **Aperçu** : Visualiser le contenu
  - **Restaurer** : Remettre en statut "brouillon"
  - **Supprimer définitivement** : Suppression irréversible
  - **Vider la corbeille** : Supprimer tous les articles de la corbeille

### 3. Fonctionnalités avancées

#### Recherche
- Recherche dans le titre, catégorie, extrait et tags
- Filtrage par statut automatique selon l'onglet actif

#### Statistiques
- Compteurs en temps réel pour chaque statut
- Affichage dans l'en-tête de l'interface

#### Export/Import
- **Export** : Sauvegarde de tous les articles au format JSON
- **Import** : Restauration d'articles depuis un fichier JSON

#### Aperçu rapide
- Modal pour visualiser rapidement un article
- Affichage des métadonnées SEO
- Accès direct à la modification

## Workflow recommandé

1. **Création** : Générer un article avec l'IA
2. **Édition** : Modifier et enrichir le contenu
3. **Images** : Sélectionner des images pertinentes
4. **Sauvegarde** : Enregistrer en brouillon
5. **Révision** : Aperçu et finalisation
6. **Publication** : Publier l'article
7. **Suivi** : Archiver ou supprimer selon les besoins

## Bonnes pratiques

### Gestion des statuts
- Utiliser les **brouillons** pour les articles en cours
- **Publier** uniquement les articles finalisés
- **Archiver** les articles obsolètes plutôt que les supprimer
- Vérifier la **corbeille** avant suppression définitive

### Organisation
- Utiliser des **catégories** cohérentes
- Ajouter des **tags** pertinents
- Optimiser les **métadonnées SEO**
- Sauvegarder régulièrement avec l'**export**

### Performance
- Limiter le nombre d'images par article
- Optimiser les images avant import
- Nettoyer régulièrement la corbeille
- Archiver les anciens articles

## Sécurité

- Les suppressions définitives sont irréversibles
- Confirmation requise pour les actions critiques
- Sauvegarde automatique dans le localStorage
- Export recommandé pour les sauvegardes importantes

## Support

En cas de problème :
1. Vérifier la console du navigateur
2. Essayer de rafraîchir la page
3. Vérifier l'espace de stockage
4. Utiliser l'export pour sauvegarder les données 