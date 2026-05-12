interface Chapter {
  id: string;
  title: string;
  level: number;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface Author {
  name: string;
  role: string;
  imageUrl: string;
}

export interface Ebook {
  id: string;
  title: string;
  isFeatured?: boolean;
  subtitle: string;
  description: string;
  fullDescription: string;
  price: number;
  originalPrice?: number;
  isOnSale?: boolean;
  imageUrl: string;
  purchaseUrl: string;
  images: string[];
  features: string[];
  publishedDate: string;
  pages: number;
  language: string;
  format: string[];
  category: string;
  tableOfContents: Chapter[];
  faq: FAQItem[];
  author: Author;
}

export const ebooks: Ebook[] = [
  {
    id: "community-manager-de-choc",
    title: "Devenir un CM de Choc (2025)",
    isFeatured: true,
    subtitle: "Les secrets des pros du marketing digital pour maîtriser les réseaux sociaux",
    description: "Devenez le stratège digital qui convertit une simple discussion en stratégie de croissance imparable.",
    fullDescription: "Le rôle de Community Manager est devenu CRUCIAL pour toute entreprise voulant briller en ligne. Mais face à un domaine en constante évolution, comment devenir un véritable professionnel aguerri et faire la différence ? Cet ouvrage exclusif, issu de la série 'Les Secrets des Pros du Marketing Digital', vous livre TOUS les secrets et conseils des meilleurs experts pour exceller dans ce métier passionnant.\n\nCe guide complet vous accompagne étape par étape : des fondations du métier (définir votre rôle unique, maîtriser les compétences clés indispensables, choisir l'arsenal d'outils qui décuplent votre efficacité) à la gestion stratégique des réseaux sociaux (sélectionner les plateformes gagnantes, créer du contenu qui captive VRAIMENT votre audience, mesurer vos succès pour mieux les répliquer). Vous apprendrez à tisser des liens forts et authentiques avec vos utilisateurs : répondre avec brio aux messages et commentaires, désamorcer les crises comme un pro, collaborer intelligemment avec les influenceurs et organiser des événements qui marquent les esprits. Devenez un expert de la veille stratégique et de la gestion de l'e-réputation, en surveillant votre environnement digital et en protégeant activement l'image de votre marque. Enfin, adoptez les bonnes pratiques qui fonctionnent et anticipez les tendances pour toujours avoir une longueur d'avance.\n\nQue vous soyez un débutant aspirant à lancer votre carrière ou un professionnel expérimenté cherchant à perfectionner vos méthodes, ce livre regorge de conseils pratiques, d'exemples concrets et de stratégies immédiatement applicables. Ne soyez plus un simple gestionnaire de page, transformez-vous en un Community Manager de Choc, bâtissez des communautés vibrantes et faites exploser votre visibilité (et celle de vos clients) sur les réseaux !",
    price: 12900,
    originalPrice: 39900,
    isOnSale: true,
    imageUrl: "/images/ebooks/community-manager-de-choc.jpg",
    purchaseUrl: "https://selar.com/5v4704",
    images: [
      "/images/ebooks/community-manager-de-choc.jpg"
    ],
    features: [
      "Définir votre rôle et vos missions clés",
      "Créer du contenu qui engage et convertit",
      "Animer et fédérer votre communauté",
      "Mesurer vos résultats et optimiser vos actions",
      "Gérer les bad buzz et situations délicates"
    ],
    publishedDate: "2024-09-15",
    pages: 70,
    language: "Français",
    format: ["PDF"],
    category: "Marketing Digital",
    tableOfContents: [
      { id: "chap1", title: "Les bases du Community Management", level: 1 },
      { id: "chap1-1", title: "Qu'est-ce qu'un Community Manager ?", level: 2 },
      { id: "chap1-2", title: "Les compétences nécessaires", level: 2 },
      { id: "chap1-3", title: "Les outils du Community Manager", level: 2 },
      { id: "chap1-4", title: "Les différentes missions du Community Manager", level: 2 },
      
      { id: "chap2", title: "La gestion des réseaux sociaux", level: 1 },
      { id: "chap2-1", title: "Choisir les bons réseaux sociaux", level: 2 },
      { id: "chap2-2", title: "Créer et animer une communauté en ligne", level: 2 },
      { id: "chap2-3", title: "Planifier et publier du contenu", level: 2 },
      { id: "chap2-4", title: "Analyser les performances et mesurer l'engagement", level: 2 },
      
      { id: "chap3", title: "La relation avec les utilisateurs", level: 1 },
      { id: "chap3-1", title: "Gérer les commentaires et les messages", level: 2 },
      { id: "chap3-2", title: "Répondre aux questions et aux plaintes", level: 2 },
      { id: "chap3-3", title: "Créer des interactions et favoriser l'engagement", level: 2 },
      { id: "chap3-4", title: "Gérer les crises et les situations délicates", level: 2 },
      { id: "chap3-5", title: "Collaborer avec les influenceurs et les ambassadeurs", level: 2 },
      { id: "chap3-6", title: "Organiser des événements et des concours", level: 2 },
      
      { id: "chap4", title: "La veille et l'e-réputation", level: 1 },
      { id: "chap4-1", title: "Effectuer une veille stratégique", level: 2 },
      { id: "chap4-2", title: "Surveiller et gérer l'e-réputation", level: 2 },
      { id: "chap4-3", title: "Réagir aux avis et aux commentaires négatifs", level: 2 },
      { id: "chap4-4", title: "Utiliser les outils de monitoring et d'analyse", level: 2 },
      
      { id: "chap5", title: "Les bonnes pratiques et les tendances", level: 1 },
      { id: "chap5-1", title: "Respecter les règles et les bonnes pratiques", level: 2 },
      { id: "chap5-2", title: "Adapter sa stratégie aux tendances du moment", level: 2 },
      { id: "chap5-3", title: "Utiliser les nouvelles fonctionnalités des réseaux sociaux", level: 2 },
      { id: "chap5-4", title: "Se former et se tenir informé des évolutions du métier", level: 2 }
    ],
    faq: [
      { 
        question: "Quelle est la différence entre un Community Manager et un Social Media Manager ?", 
        answer: "Le Community Manager se concentre sur l'animation et la modération des communautés en ligne, tandis que le Social Media Manager gère la stratégie globale des réseaux sociaux. Ce guide vous aide à maîtriser ces deux aspects complémentaires pour une présence en ligne optimale."
      },
      { 
        question: "Combien de temps par jour dois-je consacrer à la gestion de mes communautés ?", 
        answer: "Cela dépend de la taille de votre communauté et de vos objectifs. En moyenne, prévoyez entre 1h et 4h par jour. Le guide fournit des méthodes pour optimiser votre temps et automatiser certaines tâches récurrentes."
      },
      { 
        question: "Quels sont les outils essentiels pour un Community Manager débutant ?", 
        answer: "Les outils varient selon vos besoins, mais nous recommandons de commencer avec un outil de programmation de contenu (comme Hootsuite ou Buffer), un outil de création graphique (comme Canva) et un outil d'analyse (comme Google Analytics). Le guide détaille les meilleurs outils gratuits et payants."
      },
      { 
        question: "Comment gérer efficacement une crise sur les réseaux sociaux ?", 
        answer: "La clé est de réagir rapidement, avec transparence et professionnalisme. Le guide propose une méthodologie en 5 étapes pour gérer les crises, avec des exemples concrets et des modèles de réponses."
      },
      { 
        question: "Comment mesurer le succès de ma stratégie de community management ?", 
        answer: "Au-delà des likes et des partages, il est essentiel de suivre des indicateurs comme le taux d'engagement, la portée organique et le sentiment des commentaires. Le guide inclut des tableaux de bord clés en main et des méthodes d'analyse avancées."
      },
      { 
        question: "Puis-je appliquer ces méthodes à n'importe quel secteur d'activité ?", 
        answer: "Absolument ! Les principes fondamentaux du community management s'appliquent à tous les secteurs. Le guide inclut des études de cas variées (B2B, B2C, associations) pour s'adapter à votre contexte spécifique."
      },
      { 
        question: "Comment rester à jour avec les évolutions des algorithmes des réseaux sociaux ?", 
        answer: "Les algorithmes évoluent constamment, mais les fondamentaux du contenu de qualité restent. Le guide vous apprend à développer une veille efficace et à vous adapter rapidement aux changements, avec des ressources pour rester informé en temps réel."
      }
    ],
    author: {
      name: "Opportun Aby",
      role: "Expert en Stratégies Digitales",
      imageUrl: "/images/team/aby-opportun.jpg"
    }
  },
  {
    id: "la-methodologie-de-la-vente",
    title: "La Méthodologie de la Vente (2025)",
    subtitle: "Techniques éprouvées pour vendre avec succès",
    description: "Maîtrisez l'art de la vente avec des méthodes qui ont fait leurs preuves pour booster vos ventes rapidement.",
    fullDescription: "Découvrez les secrets des meilleurs vendeurs et apprenez à appliquer des méthodes éprouvées pour augmenter votre taux de conversion. Ce guide complet vous dévoile les techniques qui fonctionnent vraiment dans le monde de la vente moderne.\n\nDe la prospection à la conclusion de vente, en passant par la gestion des objections, vous maîtriserez chaque étape du processus commercial. Apprenez à créer un lien de confiance avec vos clients, à mettre en valeur vos produits ou services, et à conclure davantage de ventes avec succès.",
    price: 19022,
    originalPrice: 32099,
    isOnSale: true,
    imageUrl: "/images/ebooks/la-methodologie-de-la-vente.jpg",
    images: [
      "/images/ebooks/la-methodologie-de-la-vente.jpg"
    ],
    purchaseUrl: "https://selar.com/j7n004",
    features: [
      "Comment trouver des prospects qualifiés",
      "Comment comprendre les besoins clients",
      "Comment négocier et gérer les objections",
      "Comment conclure vos ventes efficacement",
      "Comment fidéliser sur le long terme"
    ],
    publishedDate: "2023-12-05",
    pages: 41,
    language: "Français",
    format: ["PDF"],
    category: "communication",
    tableOfContents: [
      { id: "chap1", title: "Introduction à la vente", level: 1 },
      { id: "chap1-1", title: "Les fondamentaux de la vente", level: 2 },
      { id: "chap1-2", title: "Les différents types de vente", level: 2 },
      { id: "chap1-3", title: "Les étapes du processus de vente", level: 2 },
      { id: "chap1-4", title: "Les compétences essentielles du vendeur", level: 2 },
      
      { id: "chap2", title: "La prospection", level: 1 },
      { id: "chap2-1", title: "La recherche de prospects", level: 2 },
      { id: "chap2-2", title: "La qualification des prospects", level: 2 },
      { id: "chap2-3", title: "Les techniques de prospection", level: 2 },
      { id: "chap2-4", title: "La gestion des leads", level: 2 },
      
      { id: "chap3", title: "La découverte des besoins", level: 1 },
      { id: "chap3-1", title: "L'écoute active", level: 2 },
      { id: "chap3-2", title: "Les questions ouvertes et fermées", level: 2 },
      { id: "chap3-3", title: "L'analyse des besoins du client", level: 2 },
      { id: "chap3-4", title: "La création de valeur", level: 2 },
      { id: "chap3-5", title: "La proposition de solutions", level: 2 },
      
      { id: "chap4", title: "La négociation", level: 1 },
      { id: "chap4-1", title: "Les principes de la négociation", level: 2 },
      { id: "chap4-2", title: "Les techniques de négociation", level: 2 },
      { id: "chap4-3", title: "La gestion des concessions", level: 2 },
      { id: "chap4-4", title: "La conclusion de la vente", level: 2 },
      
      { id: "chap5", title: "Le suivi et la fidélisation", level: 1 },
      { id: "chap5-1", title: "Le suivi après la vente", level: 2 },
      { id: "chap5-2", title: "La gestion de la relation client", level: 2 },
      { id: "chap5-3", title: "La fidélisation des clients", level: 2 },
      { id: "chap5-4", title: "La gestion des réclamations", level: 2 },
      { id: "chap5-5", title: "Le développement du portefeuille client", level: 2 }
    ],
    faq: [
      { 
        question: "À qui s'adresse cet ouvrage sur les techniques de vente ?", 
        answer: "Ce livre s'adresse à tous les professionnels de la vente, qu'ils soient débutants ou expérimentés, ainsi qu'aux entrepreneurs qui souhaitent améliorer leurs compétences commerciales. Les techniques enseignées sont applicables dans tous les secteurs d'activité."
      },
      { 
        question: "Quelle est la différence entre ce livre et d'autres ouvrages sur la vente ?", 
        answer: "Contrairement à de nombreux livres théoriques, cet ouvrage se concentre sur des méthodes pratiques et éprouvées, avec des exemples concrets et des stratégies immédiatement applicables. Il couvre l'ensemble du processus de vente, de la prospection à la fidélisation client."
      },
      { 
        question: "Combien de temps faut-il pour voir des résultats après avoir appliqué ces méthodes ?", 
        answer: "Les premiers résultats peuvent être observés dès les premières semaines d'application, notamment en termes d'amélioration de la qualité des échanges avec les clients. Une maîtrise complète des techniques peut prendre quelques mois de pratique régulière."
      },
      { 
        question: "Est-ce que ces techniques fonctionnent pour la vente en ligne ?", 
        answer: "Absolument. Bien que certaines techniques soient présentées dans un contexte de vente en face-à-face, les principes fondamentaux de la vente restent les mêmes. Nous fournissons également des conseils spécifiques pour adapter ces méthodes aux canaux digitaux."
      },
      { 
        question: "Y a-t-il des exercices pratiques inclus ?", 
        answer: "Oui, chaque chapitre se termine par des exercices pratiques et des études de cas concrets pour vous aider à appliquer immédiatement les concepts appris. Ces exercices sont conçus pour renforcer votre apprentissage par la pratique."
      },
      { 
        question: "Puis-je utiliser ces techniques pour vendre n'importe quel type de produit ou service ?", 
        answer: "Tout à fait. Les principes enseignés sont universels et s'appliquent à tous les types de produits et services, qu'il s'agisse de biens de consommation courante, de services professionnels ou de produits haut de gamme. Les techniques sont adaptables à différents secteurs d'activité."
      },
      { 
        question: "Comment puis-je gérer les objections difficiles des clients ?", 
        answer: "L'ouvrage consacre un chapitre complet à la gestion des objections, avec des techniques éprouvées pour transformer les objections en opportunités. Vous apprendrez à identifier les véritables préoccupations des clients et à y répondre de manière convaincante."
      }
    ],
    author: {
      name: "Opportun Aby",
      role: "Expert en Stratégies Digitales",
      imageUrl: "/images/team/aby-opportun.jpg"
    }
  },
  {
    id: "vendre-avec-0f",
    title: "Comment vendre avec 0 FCFA en 2025",
    subtitle: "Lancez votre business sans budget publicitaire !",
    description: "Tu souhaites te lancer dans la vente, mais tu manques de site web, de budget conséquent ou de compétences techniques ? Ce guide est fait pour toi !\n\nAvec \"Vendre sur Facebook & WhatsApp avec 0 FCFA\", découvre comment démarrer ta business uniquement avec ton téléphone, même si tu pars de zéro. Apprends des méthodes efficaces adaptées au marché africain, simples et concrètes.\n\nDans ce guide pratique, tu verras comment :\n- Attirer l’attention grâce aux mots justes.\n- Lancer des conversations captivantes sur WhatsApp.\n- Trouver des produits gagnants.\n- Rassurer les clients et les convaincre sans pression.\n- Encaisser ton argent facilement et en toute sécurité.\n\nPas de discours inutiles, juste des stratégies efficaces, et surtout, 0 FCFA pour démarrer.",
    fullDescription: "Tu souhaites te lancer dans la vente, mais tu manques de site web, de budget conséquent ou de compétences techniques ? Ce guide est fait pour toi !\n\nAvec \"Vendre sur Facebook & WhatsApp avec 0 FCFA\", découvre comment démarrer ta business uniquement avec ton téléphone, même si tu pars de zéro. Apprends des méthodes efficaces adaptées au marché africain, simples et concrètes.\n\nDans ce guide pratique, tu verras comment :\n- Attirer l’attention grâce aux mots justes.\n- Lancer des conversations captivantes sur WhatsApp.\n- Trouver des produits gagnants.\n- Rassurer les clients et les convaincre sans pression.\n- Encaisser ton argent facilement et en toute sécurité.\n\nPas de discours inutiles, juste des stratégies efficaces, et surtout, 0 FCFA pour démarrer.",
    price: 3998,
    originalPrice: 8900,
    isOnSale: true,
    imageUrl: "/images/ebooks/VENDRE-AVEC-0F - Grande.jpeg",
    purchaseUrl: "https://kheopsetdigital.mychariow.com/prd_76rk3h/checkout",
    images: ["/images/ebooks/VENDRE-AVEC-0F - Grande.jpeg"],
    features: [
      "Lancer ton activité sans site web ni budget pub",
      "Créer des publications Facebook qui attirent et vendent",
      "Convertir les curieux en clients sur WhatsApp",
      "Choisir des produits faciles à vendre en Afrique",
      "Organiser ton business même si tu es débutant(e)"
    ],
    publishedDate: "2025-07-24",
    pages: 79,
    language: "Français",
    format: ["PDF"],
    category: "Marketing Digital",
    tableOfContents: [
      { id: "chap1", title: "La réalité du digital en Afrique", level: 1 },
      { id: "chap1-1", title: "Pourquoi vendre en ligne aujourd'hui est une urgence", level: 2 },
      { id: "chap1-2", title: "Le comportement d'achat des consommateurs africains", level: 2 },
      { id: "chap1-3", title: "Pourquoi WhatsApp et Facebook sont les 'marchés modernes' les plus puissants", level: 2 },
      { id: "chap1-4", title: "Ce que tes clients veulent vraiment... et ce qu'ils ne disent jamais", level: 2 },
      
      { id: "chap2", title: "Construire une offre irrésistible", level: 1 },
      { id: "chap2-1", title: "Choisir quoi vendre (produit, service ou digital)", level: 2 },
      { id: "chap2-2", title: "Définir ton client idéal (avatar simple et efficace)", level: 2 },
      { id: "chap2-3", title: "Transformer un produit banal en offre attirante", level: 2 },
      { id: "chap2-4", title: "Fixer un prix juste et motivant", level: 2 },
      
      { id: "chap3", title: "Préparer ta boutique Facebook et WhatsApp (sans site web)", level: 1 },
      { id: "chap3-1", title: "Transformer ton profil Facebook personnel en boutique professionnelle", level: 2 },
      { id: "chap3-2", title: "Structurer ton compte WhatsApp Business comme une vraie boutique", level: 2 },
      { id: "chap3-3", title: "Créer ton mini-système de vente entre Facebook et WhatsApp", level: 2 },
      
      { id: "chap4", title: "Attirer tes premiers clients sans pub (méthode gratuite et efficace)", level: 1 },
      { id: "chap4-1", title: "L'effet réseau : vendre autour de toi sans être lourd", level: 2 },
      { id: "chap4-2", title: "Créer des publications simples qui captent l'attention", level: 2 },
      { id: "chap4-3", title: "Comment utiliser les témoignages et avis clients pour vendre sans parler", level: 2 },
      { id: "chap4-4", title: "Le pouvoir des statuts WhatsApp + Stories Facebook", level: 2 },
      
      { id: "chap5", title: "Lancer ta première offre magnétique", level: 1 },
      { id: "chap5-1", title: "Identifier le problème central à résoudre pour ton client idéal", level: 2 },
      { id: "chap5-2", title: "Créer une promesse claire, spécifique et désirable", level: 2 },
      { id: "chap5-3", title: "Fixer un prix qui attire sans te dévaloriser", level: 2 },
      { id: "chap5-4", title: "Créer un effet d'urgence et de rareté (sans manipuler)", level: 2 },
      { id: "chap5-5", title: "Annoncer et présenter ton offre (structure de message prête)", level: 2 },
      
      { id: "chap6", title: "Répondre aux objections & conclure la vente sur WhatsApp", level: 1 },
      { id: "chap6-1", title: "Comprendre pourquoi les gens n'achètent pas tout de suite", level: 2 },
      { id: "chap6-2", title: "Les 5 objections les plus fréquentes (et comment y répondre)", level: 2 },
      { id: "chap6-3", title: "Script WhatsApp prêt-à-l'emploi pour convertir naturellement", level: 2 },
      
      { id: "chap7", title: "Fidéliser & transformer ses premiers clients en ambassadeurs", level: 1 },
      { id: "chap7-1", title: "Surprendre positivement dès la livraison", level: 2 },
      { id: "chap7-2", title: "Faire un bon suivi (sans devenir collant)", level: 2 },
      { id: "chap7-3", title: "Obtenir des témoignages et les utiliser pour vendre plus facilement", level: 2 },
      { id: "chap7-4", title: "Proposer une seconde offre ou relancer sans être lourd", level: 2 },
      
      { id: "chap8", title: "Booster tes ventes avec la publicité Facebook", level: 1 },
      { id: "chap8-1", title: "Quand lancer une pub (et quand attendre)", level: 2 },
      { id: "chap8-2", title: "Faire une pub facile sans site web", level: 2 },
      { id: "chap8-3", title: "Ciblage local et booster un post rentable", level: 2 },
      
      { id: "chap9", title: "Livraisons et paiements simplifiés", level: 1 },
      { id: "chap9-1", title: "Les méthodes de paiement locales qui rassurent", level: 2 },
      { id: "chap9-2", title: "Organiser les livraisons sans perdre la tête", level: 2 },
      { id: "chap9-3", title: "Être perçu comme un pro (même sans boutique physique)", level: 2 }
    ],
    faq: [
      { question: "Est-ce que ce guide est adapté si je débute complètement ?", answer: "Oui, il a été conçu pour les débutants, même ceux qui ne savent pas encore ce qu’ils veulent vendre." },
      { question: "Est-ce que j’ai besoin d’un site web ou d’une boutique en ligne ?", answer: "Non, le but du guide est justement de te montrer comment vendre sans site web." },
      { question: "Quels outils faut-il pour appliquer les stratégies ?", answer: "Juste ton smartphone, une connexion Internet, Facebook et WhatsApp. Rien de plus." },
      { question: "Est-ce que ça marche au Cameroun / en Afrique francophone ?", answer: "Oui ! Toutes les stratégies sont pensées pour notre contexte local (Cameroun, Côte d’Ivoire, Sénégal, RDC…)." },
      { question: "Est-ce qu’il y a un accompagnement ou une communauté après ?", answer: "Oui, tu auras mes contacts pour poser tes questions et partager tes résultats." }
    ],
    author: {
      name: "Opportun Aby",
      role: "Expert en Stratégies Digitales",
      imageUrl: "/images/team/aby-opportun.jpg"
    }
  }
];
