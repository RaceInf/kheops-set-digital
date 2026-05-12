export interface ArticleTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  structure: string;
  style: string;
  targetLength: number;
  features: string[];
}

export const articleTemplates: ArticleTemplate[] = [
  {
    id: 'guide-complet',
    name: 'Guide Complet',
    description: 'Guide détaillé avec étapes pratiques et exemples concrets',
    category: 'Toutes catégories',
    structure: `
# [TITRE PRINCIPAL]

## Introduction
- Contexte et importance du sujet
- Objectifs de l'article
- Ce que le lecteur va apprendre

## [SECTION 1: Fondamentaux]
- Définitions claires
- Concepts de base
- Exemples concrets

## [SECTION 2: Méthodologie]
- Étapes détaillées
- Processus étape par étape
- Conseils pratiques

## [SECTION 3: Cas d'usage]
- Exemples réels
- Études de cas
- Résultats obtenus

## [SECTION 4: Bonnes pratiques]
- Conseils d'experts
- Erreurs à éviter
- Recommandations

## Conclusion
- Résumé des points clés
- Prochaines étapes
- Call-to-action

## Ressources additionnelles
- Liens utiles
- Outils recommandés
- Lectures complémentaires
    `,
    style: 'professionnel, pédagogique, structuré',
    targetLength: 2500,
    features: ['étapes détaillées', 'exemples concrets', 'ressources']
  },

  {
    id: 'analyse-tendances',
    name: 'Analyse de Tendances',
    description: 'Article d\'analyse avec données récentes et perspectives futures',
    category: 'Marketing Digital, Technologie, E-commerce',
    structure: `
# [TITRE: Tendances actuelles]

## Introduction
- État actuel du marché
- Pourquoi cette tendance est importante
- Objectif de l'analyse

## [SECTION 1: Données du marché]
- Statistiques récentes
- Évolution des chiffres
- Comparaisons temporelles

## [SECTION 2: Facteurs de croissance]
- Causes principales
- Éléments déclencheurs
- Conditions favorables

## [SECTION 3: Impact sur l'industrie]
- Changements observés
- Adaptations nécessaires
- Opportunités créées

## [SECTION 4: Perspectives futures]
- Prévisions à court terme
- Scénarios possibles
- Recommandations stratégiques

## Conclusion
- Synthèse des insights
- Actions recommandées
- Veille continue
    `,
    style: 'analytique, factuel, prospectif',
    targetLength: 2000,
    features: ['données chiffrées', 'analyse', 'prévisions']
  },

  {
    id: 'tutoriel-pratique',
    name: 'Tutoriel Pratique',
    description: 'Guide pratique avec captures d\'écran et instructions détaillées',
    category: 'Technologie, Design, Outils',
    structure: `
# [TITRE: Comment faire...]

## Introduction
- Objectif du tutoriel
- Prérequis nécessaires
- Temps estimé

## [SECTION 1: Préparation]
- Outils nécessaires
- Configuration requise
- Préparatifs

## [SECTION 2: Étapes détaillées]
### Étape 1: [Description]
- Instructions précises
- Captures d'écran
- Points d'attention

### Étape 2: [Description]
- Instructions précises
- Captures d'écran
- Points d'attention

### Étape 3: [Description]
- Instructions précises
- Captures d'écran
- Points d'attention

## [SECTION 3: Résultat final]
- Ce qui doit être obtenu
- Vérifications
- Tests

## [SECTION 4: Dépannage]
- Problèmes courants
- Solutions
- Ressources d'aide

## Conclusion
- Récapitulatif
- Prochaines étapes
- Partage d'expérience
    `,
    style: 'pratique, détaillé, visuel',
    targetLength: 1800,
    features: ['étapes numérotées', 'captures d\'écran', 'dépannage']
  },

  {
    id: 'comparaison-outils',
    name: 'Comparaison d\'Outils',
    description: 'Analyse comparative d\'outils ou solutions',
    category: 'Outils, Technologie, Marketing',
    structure: `
# [TITRE: Comparaison complète]

## Introduction
- Contexte de la comparaison
- Critères d'évaluation
- Objectif de l'analyse

## [SECTION 1: Présentation des outils]
### Outil A
- Description générale
- Fonctionnalités principales
- Public cible

### Outil B
- Description générale
- Fonctionnalités principales
- Public cible

### Outil C
- Description générale
- Fonctionnalités principales
- Public cible

## [SECTION 2: Critères de comparaison]
### Prix et plans
- Comparaison tarifaire
- Valeur ajoutée
- ROI

### Fonctionnalités
- Tableau comparatif
- Points forts/faibles
- Cas d'usage

### Performance
- Vitesse
- Fiabilité
- Support

## [SECTION 3: Recommandations]
- Pour quel profil
- Scénarios d'usage
- Choix recommandé

## Conclusion
- Synthèse
- Recommandation finale
- Ressources
    `,
    style: 'objectif, comparatif, factuel',
    targetLength: 2200,
    features: ['tableau comparatif', 'critères', 'recommandations']
  },

  {
    id: 'etude-cas',
    name: 'Étude de Cas',
    description: 'Analyse détaillée d\'un cas concret avec résultats',
    category: 'Marketing, E-commerce, Stratégie',
    structure: `
# [TITRE: Étude de cas - Entreprise]

## Introduction
- Présentation du contexte
- Défis rencontrés
- Objectifs fixés

## [SECTION 1: Contexte et défis]
- Situation initiale
- Problèmes identifiés
- Enjeux business

## [SECTION 2: Stratégie mise en place]
- Approche choisie
- Méthodologie
- Plan d'action

## [SECTION 3: Implémentation]
- Étapes de réalisation
- Outils utilisés
- Obstacles rencontrés

## [SECTION 4: Résultats obtenus]
- Métriques avant/après
- Impact business
- ROI calculé

## [SECTION 5: Leçons apprises]
- Facteurs de succès
- Erreurs à éviter
- Recommandations

## Conclusion
- Synthèse des résultats
- Applicabilité
- Prochaines étapes
    `,
    style: 'narratif, factuel, instructif',
    targetLength: 2000,
    features: ['métriques', 'résultats', 'leçons apprises']
  },

  {
    id: 'newsletter-engageante',
    name: 'Newsletter Engageante',
    description: 'Article optimisé pour l\'engagement et le partage',
    category: 'Toutes catégories',
    structure: `
# [TITRE accrocheur]

## Hook d'ouverture
- Question provocante
- Statistique surprenante
- Histoire personnelle

## [SECTION 1: Le problème]
- Identification du défi
- Impact sur le lecteur
- Urgence d'agir

## [SECTION 2: La solution]
- Approche proposée
- Méthode éprouvée
- Preuves sociales

## [SECTION 3: Action concrète]
- Étapes immédiates
- Outils gratuits
- Ressources

## [SECTION 4: Inspiration]
- Exemples de succès
- Témoignages
- Motivation

## Call-to-action
- Action spécifique
- Bénéfice immédiat
- Urgence

## Partage social
- Invitation au partage
- Questions de discussion
- Engagement communautaire
    `,
    style: 'engageant, conversationnel, actionnable',
    targetLength: 1500,
    features: ['hook', 'call-to-action', 'partage social']
  },

  {
    id: 'expert-insights',
    name: 'Insights d\'Expert',
    description: 'Article basé sur l\'expertise et l\'expérience',
    category: 'Toutes catégories',
    structure: `
# [TITRE: Perspective d'expert]

## Introduction personnelle
- Expérience de l'expert
- Crédibilité établie
- Angle unique

## [SECTION 1: Observations du terrain]
- Tendances observées
- Changements notés
- Signaux faibles

## [SECTION 2: Analyse approfondie]
- Causes profondes
- Mécanismes en jeu
- Implications

## [SECTION 3: Prédictions]
- Évolutions probables
- Scénarios possibles
- Timing estimé

## [SECTION 4: Conseils d'expert]
- Recommandations
- Actions prioritaires
- Investissements

## [SECTION 5: Questions ouvertes]
- Défis non résolus
- Débats en cours
- Recherches futures

## Conclusion
- Synthèse personnelle
- Vision d'avenir
- Invitation au dialogue
    `,
    style: 'expert, réflexif, prospectif',
    targetLength: 1800,
    features: ['expertise', 'prédictions', 'questions ouvertes']
  }
];

export const getTemplatesByCategory = (category: string): ArticleTemplate[] => {
  return articleTemplates.filter(template => 
    template.category === category || template.category === 'Toutes catégories'
  );
};

export const getTemplateById = (id: string): ArticleTemplate | undefined => {
  return articleTemplates.find(template => template.id === id);
};

export const getDefaultTemplate = (): ArticleTemplate => {
  return articleTemplates[0]; // Guide Complet
}; 