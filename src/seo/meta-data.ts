// Central registry of metadata for prerendering and SEO
// Key: URL path (must match routes used in vite-plugin-prerender)
// Values: meta tags used by the <Seo> helper component or directly by Helmet

export interface RouteMeta {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: string; // e.g. 'website', 'article'
  twitterCard?: 'summary' | 'summary_large_image';
}

const baseUrl = 'https://kheopsetdigital.com';

const metaData: Record<string, RouteMeta> = {
  '/': {
    title: 'Agence Web & Marketing Digital à Douala | KHEOPS SET DIGITAL',
    description: "Agence web et marketing digital basée à Douala : sites vitrines & e-commerce, SEO, branding et stratégie pour accélérer votre croissance.",
    canonical: baseUrl + '/',
    image: baseUrl + '/images/og/home.jpg',
    type: 'website',
    twitterCard: 'summary_large_image',
  },
  '/services': {
    title: 'Services Digitaux : Site Web, SEO, Branding | KHEOPS SET DIGITAL',
    description: "Conception de sites e-commerce, optimisation SEO, identité visuelle, contenus et stratégie digitale sur-mesure.",
    canonical: baseUrl + '/services',
    image: baseUrl + '/images/og/services.jpg',
    type: 'website',
    twitterCard: 'summary_large_image',
  },
  '/boutique': {
    title: 'eBooks & Templates Marketing | KHEOPS SET DIGITAL',
    description: "Téléchargez nos eBooks, check-lists et templates pour booster votre visibilité et vos ventes en ligne.",
    canonical: baseUrl + '/boutique',
    image: baseUrl + '/images/og/boutique.jpg',
    type: 'website',
    twitterCard: 'summary_large_image',
  },
  '/apropos': {
    title: 'À propos | KHEOPS SET DIGITAL',
    description: "Découvrez la vision, l'équipe et les valeurs de KHEOPS SET DIGITAL.",
    canonical: baseUrl + '/apropos',
    image: baseUrl + '/images/og/apropos.jpg',
    type: 'website',
    twitterCard: 'summary_large_image',
  },
  '/blog': {
    title: 'Blog | KHEOPS SET DIGITAL',
    description: "Articles, guides et tutoriels SEO, web design et marketing digital pour faire décoller votre projet.",
    canonical: baseUrl + '/blog',
    image: baseUrl + '/images/og/blog.jpg',
    type: 'website',
    twitterCard: 'summary_large_image',
  },
  '/kheopscope': {
    title: 'Kheopscope | Blog Marketing Digital & Tendances Tech | KHEOPS SET DIGITAL',
    description: "Votre observatoire digital pour explorer les tendances, innovations et insights du marketing digital, IA et technologies émergentes en Afrique.",
    canonical: baseUrl + '/kheopscope',
    image: baseUrl + '/images/og/kheopscope.jpg',
    type: 'website',
    twitterCard: 'summary_large_image',
  },
  // Articles Kheopscope
  '/kheopscope/tendances-marketing-digital-afrique-2025': {
    title: 'Les 5 tendances du marketing digital qui dominent 2025 en Afrique | Kheopscope',
    description: "L'Afrique redéfinit les codes du marketing mondial. Découvrez les 5 tendances incontournables : IA adaptée, mobile-only, social commerce, hyper-localisation et tech frugale.",
    canonical: baseUrl + '/kheopscope/tendances-marketing-digital-afrique-2025',
    image: baseUrl + '/images/articles/les-5-tendances-marketing-digital-afrique-2025.jpg',
    type: 'article',
    twitterCard: 'summary_large_image',
  },
  '/kheopscope/strategie-facebook-2025': {
    title: 'Comment convertir efficacement : stratégie de contenu Facebook 2025 | Kheopscope',
    description: "En 2025, les contenus Facebook doivent convertir. Découvrez les stratégies data-driven et les techniques avancées pour maximiser vos conversions sur la plateforme.",
    canonical: baseUrl + '/kheopscope/strategie-facebook-2025',
    image: baseUrl + '/images/articles/strategie-facebook-2025.jpg',
    type: 'article',
    twitterCard: 'summary_large_image',
  },
  '/kheopscope/avenir-intelligence-artificielle': {
    title: "L'avenir de l'intelligence artificielle : révolution technologique 2025 | Kheopscope",
    description: "Explorez les innovations IA qui façonnent notre avenir : apprentissage automatique, traitement du langage naturel et applications révolutionnaires dans tous les secteurs.",
    canonical: baseUrl + '/kheopscope/avenir-intelligence-artificielle',
    image: baseUrl + '/images/articles/robot-futuriste.jpg',
    type: 'article',
    twitterCard: 'summary_large_image',
  },
  '/kheopscope/instagram-reels-vs-tiktok': {
    title: 'Instagram Reels vs TikTok : quelle plateforme choisir pour votre business ? | Kheopscope',
    description: 'Comparatif complet 2025 entre Instagram Reels et TikTok : stratégie, audience, ROI. Découvrez quelle plateforme est la plus rentable pour votre entreprise et comment maximiser votre présence vidéo.',
    canonical: baseUrl + '/kheopscope/instagram-reels-vs-tiktok',
    image: baseUrl + '/images/articles/chatgpt-image-3-juil-2025-16-31-16.jpg',
    type: 'article',
    twitterCard: 'summary_large_image',
  },
  '/contact': {
    title: 'Contact | KHEOPS SET DIGITAL',
    description: "Discutons de votre projet digital : demande de devis ou accompagnement personnalisé.",
    canonical: baseUrl + '/contact',
    image: baseUrl + '/images/og/contact.jpg',
    type: 'website',
    twitterCard: 'summary_large_image',
  },
  '/services/formulaire-de-souscription': {
    title: 'Souscription | KHEOPS SET DIGITAL',
    description: "Obtenez un devis personnalisé en ligne pour nos prestations digitales.",
    canonical: baseUrl + '/services/formulaire-de-souscription',
    image: baseUrl + '/images/og/subscribe.jpg',
    type: 'website',
    twitterCard: 'summary_large_image',
  },
  '/mentions-legales': {
    title: 'Mentions légales | KHEOPS SET DIGITAL',
    description: "Informations légales du site KHEOPS SET DIGITAL.",
    canonical: baseUrl + '/mentions-legales',
    image: baseUrl + '/images/og/legal.jpg',
    type: 'website',
    twitterCard: 'summary_large_image',
  },
  '/politique-de-confidentialite': {
    title: 'Politique de confidentialité | KHEOPS SET DIGITAL',
    description: "Notre politique de protection des données personnelles.",
    canonical: baseUrl + '/politique-de-confidentialite',
    image: baseUrl + '/images/og/privacy.jpg',
    type: 'website',
    twitterCard: 'summary_large_image',
  },
  '/conditions-generales-de-vente': {
    title: 'Conditions générales de vente | KHEOPS SET DIGITAL',
    description: "Termes et conditions de nos prestations.",
    canonical: baseUrl + '/conditions-generales-de-vente',
    image: baseUrl + '/images/og/cgv.jpg',
    type: 'website',
    twitterCard: 'summary_large_image',
  },
  '/services/community-management': {
    title: 'Community Management | KHEOPS SET DIGITAL',
    description: "Gestion de communauté et réseaux sociaux pour accroître votre visibilité et l'engagement de votre audience.",
    canonical: baseUrl + '/services/community-management',
    image: baseUrl + '/images/og/community-management.jpg',
    type: 'service',
    twitterCard: 'summary_large_image',
  },
  '/services/creation-sites-web': {
    title: 'Création de Sites Web | KHEOPS SET DIGITAL',
    description: "Sites vitrines et e-commerce performants, conçus pour convertir vos visiteurs en clients.",
    canonical: baseUrl + '/services/creation-sites-web',
    image: baseUrl + '/images/og/site-web.jpg',
    type: 'service',
    twitterCard: 'summary_large_image',
  },
  '/services/identite-visuelle': {
    title: 'Identité Visuelle | KHEOPS SET DIGITAL',
    description: "Logos et chartes graphiques mémorables pour renforcer votre image de marque.",
    canonical: baseUrl + '/services/identite-visuelle',
    image: baseUrl + '/images/og/identite-visuelle.jpg',
    type: 'service',
    twitterCard: 'summary_large_image',
  },
  '/services/strategie-digitale': {
    title: 'Stratégie Digitale | KHEOPS SET DIGITAL',
    description: "Feuilles de route stratégiques pour aligner vos actions en ligne avec vos objectifs business.",
    canonical: baseUrl + '/services/strategie-digitale',
    image: baseUrl + '/images/og/strategie-digitale.jpg',
    type: 'service',
    twitterCard: 'summary_large_image',
  },
  '/services/social-media-marketing': {
    title: 'Social Media Marketing | KHEOPS SET DIGITAL',
    description: "Campagnes publicitaires ciblées pour augmenter votre visibilité et vos conversions.",
    canonical: baseUrl + '/services/social-media-marketing',
    image: baseUrl + '/images/og/social-media.jpg',
    type: 'service',
    twitterCard: 'summary_large_image',
  },
  '/services/referencement-seo': {
    title: 'Référencement SEO | KHEOPS SET DIGITAL',
    description: "Optimisation technique et contenu pour améliorer votre positionnement sur Google et attirer un trafic qualifié.",
    canonical: baseUrl + '/services/referencement-seo',
    image: baseUrl + '/images/og/referencement-seo.jpg',
    type: 'service',
    twitterCard: 'summary_large_image',
  },
  '/boutique/community-manager-de-choc': {
    title: 'Devenir un CM de Choc | eBook KHEOPS SET DIGITAL',
    description: "Devenez le stratège digital qui convertit une simple discussion en stratégie de croissance imparable.",
    canonical: baseUrl + '/boutique/community-manager-de-choc',
    image: baseUrl + '/images/og/community-manager-de-choc.jpg',
    type: 'formation',
    twitterCard: 'summary_large_image',
  },
  '/boutique/la-methodologie-de-la-vente': {
    title: 'La Méthodologie de la Vente | eBook KHEOPS SET DIGITAL',
    description: "Maîtrisez l'art de la vente avec des méthodes qui ont fait leurs preuves pour booster vos ventes rapidement.",
    canonical: baseUrl + '/boutique/la-methodologie-de-la-vente',
    image: baseUrl + '/images/og/la-methodologie-de-la-vente.jpg',
    type: 'formation',
    twitterCard: 'summary_large_image',
  },
  '/boutique/vendre-avec-0f': {
    title: 'Vendre sur Facebook & WhatsApp avec 0 FCFA (2025) | eBook KHEOPS SET DIGITAL',
    description: 'Comment j’ai généré mes premières ventes sans site web, juste avec mon téléphone – et comment tu peux faire pareil.',
    canonical: baseUrl + '/boutique/vendre-avec-0f',
    image: baseUrl + '/images/ebooks/VENDRE-AVEC-0F - Grande.jpeg',
    type: 'product',
    twitterCard: 'summary_large_image',
  },
  '/kheopscope/marketing-influence-afrique-francophone-guide-complet': {
    title: "Marketing d'Influence en Afrique Francophone : Guide Complet 2025 | Kheopscope",
    description: "Guide complet pour réussir vos campagnes d'influence marketing en Afrique francophone. Méthode BAOBAB, micro-influenceurs, ROI et stratégies locales adaptées aux PME africaines.",
    canonical: baseUrl + '/kheopscope/marketing-influence-afrique-francophone-guide-complet',
    image: baseUrl + '/images/articles/marketingdinf.jpg',
    type: 'article',
    twitterCard: 'summary_large_image',
  },
  '/kheopscope/profil-ou-page-facebook-2025-guide-ultime-vendre-cameroun': {
    title: 'Profil ou Page Facebook en 2025 : La Stratégie Gagnante pour vendre au Cameroun',
    description: "Confus(e) par le débat 'Profil vs Page' au Cameroun ? Découvrez LA stratégie gagnante pour utiliser les deux et transformer enfin votre visibilité en ventes.",
    canonical: baseUrl + '/kheopscope/profil-ou-page-facebook-2025-guide-ultime-vendre-cameroun',
    image: baseUrl + '/images/articles/profil_pers_ou_page_pro.jpg',
    type: 'article',
    twitterCard: 'summary_large_image',
  },
  '/kheopscope/comment-repondre-cest-trop-cher-whatsapp': {
    title: "Comment Répondre à 'C'est Trop Cher' sur WhatsApp | KHEOPS SET DIGITAL",
    description: "Découvrez des stratégies efficaces pour répondre à l'objection 'c'est trop cher' sur WhatsApp et conclure plus de ventes. Guide pratique pour les entrepreneurs.",
    canonical: baseUrl + '/kheopscope/comment-repondre-cest-trop-cher-whatsapp',
    image: baseUrl + '/images/articles/Tropcher.jpeg',
    type: 'article',
    twitterCard: 'summary_large_image',
  },
  // Pages supplémentaires
  '/admin': {
    title: 'Administration | KHEOPS SET DIGITAL',
    description: "Interface d'administration KHEOPS SET DIGITAL.",
    canonical: baseUrl + '/admin',
    type: 'website',
    twitterCard: 'summary',
  },
  '/404': {
    title: 'Page non trouvée | KHEOPS SET DIGITAL',
    description: "La page que vous recherchez n'existe pas.",
    canonical: baseUrl + '/404',
    type: 'website',
    twitterCard: 'summary',
  },
  // Pages de blog (génériques)
  '/blog/post': {
    title: 'Article de blog | KHEOPS SET DIGITAL',
    description: "Article de blog sur le marketing digital et le développement web.",
    canonical: baseUrl + '/blog/post',
    type: 'article',
    twitterCard: 'summary_large_image',
  },
  // Pages de services détaillées (génériques)
  '/services/detail': {
    title: 'Détail du service | KHEOPS SET DIGITAL',
    description: "Découvrez nos services de marketing digital et développement web.",
    canonical: baseUrl + '/services/detail',
    type: 'service',
    twitterCard: 'summary_large_image',
  },
  // Page de détail ebook (générique)
  '/ebook': {
    title: 'Détail eBook | KHEOPS SET DIGITAL',
    description: "Découvrez nos eBooks et formations en marketing digital.",
    canonical: baseUrl + '/ebook',
    type: 'formation',
    twitterCard: 'summary_large_image',
  },
};

export default metaData;
