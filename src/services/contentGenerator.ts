import { GeneratedArticle } from '../types/article';
import { ImageService } from './imageService';
import { articleTemplates, getTemplateById } from './articleTemplates';
import { generateSlug, generateExcerpt, optimizeSEO } from '../utils/contentOptimizer';

const imageService = new ImageService();

// Configuration des modèles d'IA disponibles
export const AI_MODELS = {
  // Modèles gratuits ou économiques
  FREE: {
    name: 'GPT-3.5-turbo',
    provider: 'OpenAI',
    cost: '$0.0015/1K tokens',
    quality: 'Bon',
    features: ['Rédaction', 'SEO', 'Optimisation']
  },
  LOCAL: {
    name: 'Llama 3.2 (Local)',
    provider: 'Ollama',
    cost: 'Gratuit',
    quality: 'Moyen',
    features: ['Rédaction basique', 'Pas de limite']
  },
  GEMINI: {
    name: 'Gemini Pro',
    provider: 'Google',
    cost: 'Gratuit (limité)',
    quality: 'Très bon',
    features: ['Rédaction', 'SEO', 'Multimodal']
  },
  // Modèles payants de qualité
  CLAUDE: {
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    cost: '$3/million tokens',
    quality: 'Excellent',
    features: ['Rédaction premium', 'SEO avancé', 'Analyse']
  },
  GPT4: {
    name: 'GPT-4',
    provider: 'OpenAI',
    cost: '$0.03/1K tokens',
    quality: 'Excellent',
    features: ['Rédaction premium', 'Créativité', 'Analyse']
  }
} as const;

export type AIModelType = keyof typeof AI_MODELS;

export class ContentGenerator {
  async generateArticle(
    topic: string, 
    category: string, 
    wordCount: number = 500, 
    languageTone: string = 'professional',
    templateId?: string
  ): Promise<GeneratedArticle> {
    
    // Sélectionner le template
    let selectedTemplate: any = null;
    if (templateId) {
      selectedTemplate = getTemplateById(templateId);
    }
    
    // Si aucun template spécifique, choisir selon la catégorie
    if (!selectedTemplate) {
      const categoryTemplates = articleTemplates.filter(t => 
        t.category === category || t.category === 'Toutes catégories'
      );
      selectedTemplate = categoryTemplates[0] || articleTemplates[0];
    }
    
    // Générer le contenu selon le template
    let content = this.generateContentFromTemplate(topic, selectedTemplate, wordCount);
    
    // Ajuster le ton du contenu
    content = this.adjustLanguageTone(content, languageTone);
    
    // Ajuster la longueur finale
    content = this.adjustContentLength(content, wordCount);
    
    const title = this.generateTitle(topic, category, languageTone);
    const slug = generateSlug(title);
    const excerpt = generateExcerpt(content);
    const author = 'KHEOPS SET DIGITAL';
    const tags = [topic, category, selectedTemplate.name];
    const keywords = this.generateKeywords(topic, category, selectedTemplate);
    
    // Recherche d'images liées au sujet
    const images = await imageService.searchImages(topic);
    
    // Intégration intelligente des images dans le contenu
    content = this.integrateImagesInContent(content, images, topic);
    
    const { seoTitle, seoDescription } = optimizeSEO(title, excerpt);
    const publishedAt = new Date().toISOString();
    const actualWordCount = content.split(' ').length;
    
    return {
      title,
      slug,
      excerpt,
      content,
      author,
      category,
      tags,
      keywords,
      images,
      seoTitle,
      seoDescription,
      publishedAt,
      wordCount: actualWordCount,
    };
  }

  // Générer le contenu selon le template
  private generateContentFromTemplate(topic: string, template: any, targetWords: number): string {
    const structure = template.structure;
    const style = template.style;
    
    // Remplacer les placeholders dans la structure
    let content = structure
      .replace(/\[TITRE[^\]]*\]/g, topic)
      .replace(/\[SECTION \d+:[^\]]*\]/g, (match) => {
        const sectionName = match.replace(/\[SECTION \d+:\s*([^\]]+)\]/, '$1');
        return `<h2>${sectionName}</h2>`;
      });
    
    // Générer du contenu pour chaque section
    content = this.fillTemplateSections(content, topic, targetWords, style);
    
    return content;
  }

  // Remplir les sections du template avec du contenu
  private fillTemplateSections(content: string, topic: string, targetWords: number, style: string): string {
    const sections = [
      {
        type: 'introduction',
        content: this.generateIntroduction(topic, style)
      },
      {
        type: 'fondamentaux',
        content: this.generateFundamentals(topic, style)
      },
      {
        type: 'methodologie',
        content: this.generateMethodology(topic, style)
      },
      {
        type: 'exemples',
        content: this.generateExamples(topic, style)
      },
      {
        type: 'conseils',
        content: this.generateTips(topic, style)
      },
      {
        type: 'conclusion',
        content: this.generateConclusion(topic, style)
      }
    ];

    let filledContent = content;
    let currentWords = 0;
    const targetWordsPerSection = Math.floor(targetWords / sections.length);

    sections.forEach(section => {
      // Générer plus de contenu pour chaque section
      let sectionContent = section.content;
      const sectionWords = sectionContent.split(' ').length;
      
      // Si la section est trop courte, l'étendre
      if (sectionWords < targetWordsPerSection * 0.8) {
        const additionalWords = Math.floor(targetWordsPerSection * 0.8) - sectionWords;
        const additionalContent = this.generateCustomContent(additionalWords);
        sectionContent += '\n\n' + additionalContent;
      }
      
      // Ajuster la longueur finale de la section
      sectionContent = this.adjustContentLength(sectionContent, targetWordsPerSection);
      
      filledContent = filledContent.replace(
        new RegExp(`<h2>${section.type.charAt(0).toUpperCase() + section.type.slice(1)}</h2>`, 'i'),
        `<h2>${section.type.charAt(0).toUpperCase() + section.type.slice(1)}</h2>\n${sectionContent}`
      );
      currentWords += sectionContent.split(' ').length;
    });

    return filledContent;
  }

  // Générer une introduction
  private generateIntroduction(topic: string, style: string): string {
    const introductions = {
      'professionnel': `<p>Dans le contexte actuel du marché, ${topic} représente un enjeu majeur pour les entreprises qui souhaitent se démarquer. Cet article vous propose une approche structurée et méthodique pour maîtriser ce domaine essentiel.</p>`,
      'amical': `<p>Salut ! Si tu te demandes comment aborder ${topic}, tu es au bon endroit. On va voir ensemble comment faire ça de manière simple et efficace, sans prise de tête !</p>`,
      'autoritaire': `<p>${topic} n'est pas une option, c'est une nécessité absolue. Ceux qui l'ignorent aujourd'hui seront distancés demain. Voici pourquoi et comment agir immédiatement.</p>`,
      'conversationnel': `<p>Hey ! Tu veux savoir comment gérer ${topic} ? Moi aussi, j'ai galéré avec ça au début. Laisse-moi te partager ce que j'ai appris et qui marche vraiment.</p>`,
      'éducatif': `<p>Commençons par comprendre ce qu'est ${topic} et pourquoi c'est important. Nous allons explorer les concepts fondamentaux avant de passer aux applications pratiques.</p>`
    };

    return introductions[style] || introductions['professionnel'];
  }

  // Générer les fondamentaux
  private generateFundamentals(topic: string, style: string): string {
    return `<p>Pour bien comprendre ${topic}, il faut d'abord maîtriser quelques concepts de base. Ces fondations vous permettront de construire une stratégie solide et durable.</p>
    <ul>
      <li><strong>Définition claire</strong> : ${topic} se définit comme l'ensemble des méthodes et techniques permettant d'atteindre vos objectifs.</li>
      <li><strong>Importance stratégique</strong> : Dans un monde en constante évolution, maîtriser ${topic} devient un avantage concurrentiel majeur.</li>
      <li><strong>Impact business</strong> : Une approche bien structurée peut générer des résultats significatifs en termes de performance et de croissance.</li>
    </ul>`;
  }

  // Générer la méthodologie
  private generateMethodology(topic: string, style: string): string {
    return `<p>Voici une méthodologie éprouvée pour réussir en ${topic}. Cette approche en plusieurs étapes vous guidera vers le succès.</p>
    <h3>Étape 1 : Analyse et diagnostic</h3>
    <p>Commencez par évaluer votre situation actuelle. Identifiez vos forces, vos faiblesses et les opportunités qui s'offrent à vous.</p>
    
    <h3>Étape 2 : Définition des objectifs</h3>
    <p>Fixez des objectifs SMART (Spécifiques, Mesurables, Atteignables, Réalistes, Temporels) alignés sur votre vision globale.</p>
    
    <h3>Étape 3 : Planification stratégique</h3>
    <p>Élaborez un plan d'action détaillé avec des échéances précises et des indicateurs de suivi.</p>
    
    <h3>Étape 4 : Mise en œuvre</h3>
    <p>Passez à l'action de manière progressive et méthodique, en ajustant votre approche selon les résultats obtenus.</p>`;
  }

  // Générer des exemples
  private generateExamples(topic: string, style: string): string {
    return `<p>Voici quelques exemples concrets de réussite en ${topic} qui illustrent l'efficacité de cette approche.</p>
    
    <h3>Exemple 1 : PME du secteur technologique</h3>
    <p>Une entreprise de 50 employés a réussi à améliorer ses performances de 40% en appliquant rigoureusement les principes de ${topic}.</p>
    
    <h3>Exemple 2 : Startup en croissance</h3>
    <p>Une startup a doublé son chiffre d'affaires en 6 mois grâce à une stratégie ${topic} bien orchestrée.</p>
    
    <h3>Exemple 3 : Grande entreprise en transformation</h3>
    <p>Une multinationale a réussi sa transformation digitale en s'appuyant sur les meilleures pratiques de ${topic}.</p>`;
  }

  // Générer des conseils
  private generateTips(topic: string, style: string): string {
    return `<p>Voici les conseils d'experts pour maximiser vos chances de succès en ${topic}.</p>
    
    <h3>Conseils pratiques</h3>
    <ul>
      <li><strong>Commencez petit</strong> : Testez vos idées sur des projets pilotes avant de généraliser.</li>
      <li><strong>Mesurez tout</strong> : Définissez des KPIs clairs et suivez-les régulièrement.</li>
      <li><strong>Restez flexible</strong> : Adaptez votre stratégie selon les retours du terrain.</li>
      <li><strong>Formez votre équipe</strong> : Investissez dans la formation pour garantir l'adhésion.</li>
    </ul>
    
    <h3>Erreurs à éviter</h3>
    <ul>
      <li>Ne pas définir d'objectifs clairs dès le départ</li>
      <li>Vouloir aller trop vite sans valider les étapes</li>
      <li>Négliger la communication et l'adhésion des équipes</li>
      <li>Oublier de mesurer et d'ajuster en cours de route</li>
    </ul>`;
  }

  // Générer une conclusion
  private generateConclusion(topic: string, style: string): string {
    return `<p>${topic} n'est pas une destination, mais un voyage continu d'amélioration. En appliquant les principes et méthodes présentés dans cet article, vous vous donnez les meilleures chances de réussir.</p>
    
    <p>N'oubliez pas que le succès dépend de votre capacité à adapter ces concepts à votre contexte spécifique et à persévérer dans l'effort. Commencez dès aujourd'hui et vous verrez les premiers résultats rapidement.</p>
    
    <p>Pour aller plus loin, n'hésitez pas à consulter nos autres ressources sur ${topic} et à partager vos expériences avec notre communauté.</p>`;
  }

  // Générer un titre adapté
  private generateTitle(topic: string, category: string, tone: string): string {
    const titles = {
      'professional': `${topic} : Guide complet et stratégies avancées`,
      'friendly': `${topic} : Tout ce que vous devez savoir simplement`,
      'authoritative': `${topic} : Les secrets des experts révélés`,
      'conversational': `${topic} : Comment j'ai réussi (et vous pouvez aussi)`,
      'educational': `${topic} : Comprendre et maîtriser les fondamentaux`
    };
    
    return titles[tone] || titles['professional'];
  }

  // Générer des mots-clés
  private generateKeywords(topic: string, category: string, template: any): string[] {
    const baseKeywords = [topic, category, 'stratégie', '2025'];
    const templateKeywords = template.features || [];
    const additionalKeywords = ['marketing digital', 'performance', 'optimisation', 'résultats'];
    
    return [...new Set([...baseKeywords, ...templateKeywords, ...additionalKeywords])];
  }

  // Fonction pour ajuster la longueur du contenu selon le nombre de mots demandé
  private adjustContentLength(content: string, targetWordCount: number): string {
    const currentWords = content.split(' ').length;
    
    if (currentWords >= targetWordCount) {
      // Si le contenu est déjà assez long, le tronquer intelligemment
      const words = content.split(' ');
      return words.slice(0, targetWordCount).join(' ') + '...';
    } else {
      // Si le contenu est trop court, l'étendre avec du contenu supplémentaire
      const additionalContent = this.generateAdditionalContent(targetWordCount - currentWords);
      return content + '\n\n' + additionalContent;
    }
  }

  // Fonction pour générer du contenu supplémentaire
  private generateAdditionalContent(additionalWords: number): string {
    const baseSections = [
      '<h3>Points clés à retenir</h3><p>Pour réussir dans ce domaine, il est essentiel de comprendre les fondamentaux et de les appliquer de manière cohérente. La persévérance et l\'adaptation sont des qualités indispensables.</p>',
      '<h3>Conseils pratiques</h3><p>Voici quelques conseils concrets que vous pouvez appliquer dès aujourd\'hui pour améliorer vos résultats. Commencez par les plus simples et progressez étape par étape.</p>',
      '<h3>Étapes suivantes</h3><p>Une fois ces bases maîtrisées, vous pourrez passer à des techniques plus avancées. N\'oubliez pas que l\'apprentissage est un processus continu.</p>',
      '<h3>Ressources utiles</h3><p>Pour approfondir vos connaissances, consultez les ressources recommandées et participez aux communautés spécialisées dans votre domaine d\'activité.</p>',
      '<h3>Analyse approfondie</h3><p>Une analyse détaillée révèle que les entreprises qui réussissent dans ce domaine partagent plusieurs caractéristiques communes. Elles investissent dans la formation continue, adoptent une approche méthodique et restent à l\'écoute des évolutions du marché.</p>',
      '<h3>Stratégies avancées</h3><p>Pour aller au-delà des bases, il est important de développer des stratégies plus sophistiquées. Cela implique une compréhension approfondie des mécanismes sous-jacents et une capacité d\'adaptation constante.</p>',
      '<h3>Études de cas détaillées</h3><p>L\'examen d\'études de cas concrets permet de mieux comprendre les facteurs de succès et les pièges à éviter. Ces exemples pratiques offrent des enseignements précieux pour votre propre approche.</p>',
      '<h3>Méthodologies éprouvées</h3><p>Plusieurs méthodologies ont fait leurs preuves dans ce domaine. Chacune présente des avantages spécifiques et peut être adaptée selon votre contexte particulier et vos objectifs.</p>',
      '<h3>Outils et technologies</h3><p>L\'utilisation d\'outils appropriés peut considérablement améliorer vos résultats. Il est important de choisir des solutions qui correspondent à vos besoins et à votre niveau d\'expertise.</p>',
      '<h3>Mesure et optimisation</h3><p>La mesure des performances est cruciale pour identifier les améliorations possibles. Mettez en place des indicateurs pertinents et analysez régulièrement vos résultats pour optimiser votre approche.</p>',
      '<h3>Gestion des risques</h3><p>Toute stratégie comporte des risques qu\'il faut identifier et gérer. Une approche proactive permet de minimiser les impacts négatifs et de maximiser les chances de succès.</p>',
      '<h3>Collaboration et partenariats</h3><p>La collaboration avec d\'autres acteurs du secteur peut apporter des perspectives nouvelles et des opportunités intéressantes. Les partenariats stratégiques peuvent accélérer votre développement.</p>',
      '<h3>Innovation et créativité</h3><p>L\'innovation est un facteur clé de différenciation dans ce domaine. Cultivez votre créativité et restez ouvert aux nouvelles idées et approches.</p>',
      '<h3>Formation et développement</h3><p>Investir dans la formation continue de votre équipe est essentiel pour maintenir un niveau d\'expertise élevé. Les compétences évoluent rapidement et il faut rester à jour.</p>',
      '<h3>Communication et marketing</h3><p>Une communication efficace est cruciale pour faire connaître votre expertise et attirer les bonnes opportunités. Développez une stratégie de communication cohérente.</p>',
      '<h3>Gestion du temps et de l\'énergie</h3><p>La gestion efficace du temps et de l\'énergie est fondamentale pour maintenir un niveau de performance élevé sur le long terme. Apprenez à prioriser et à déléguer.</p>',
      '<h3>Résolution de problèmes</h3><p>La capacité à résoudre des problèmes complexes est une compétence essentielle. Développez votre esprit d\'analyse et votre créativité pour trouver des solutions innovantes.</p>',
      '<h3>Leadership et influence</h3><p>Le leadership ne se limite pas à la gestion d\'équipe. Il s\'agit aussi d\'influencer positivement votre environnement et de créer un impact durable.</p>',
      '<h3>Développement durable</h3><p>Intégrer les principes du développement durable dans votre approche peut créer de la valeur à long terme et améliorer votre réputation.</p>',
      '<h3>Perspectives d\'avenir</h3><p>Anticiper les évolutions futures permet de se préparer aux changements et de saisir les nouvelles opportunités qui se présentent.</p>'
    ];

    // Sections spécialisées selon le domaine
    const specializedSections = [
      '<h3>Tendances actuelles</h3><p>Les tendances actuelles montrent une évolution rapide des pratiques dans ce secteur. Il est important de rester informé des dernières innovations et de leur impact potentiel sur votre activité.</p>',
      '<h3>Benchmarking et comparaison</h3><p>Le benchmarking permet d\'identifier les meilleures pratiques du secteur et de s\'en inspirer pour améliorer vos propres performances. Analysez les leaders du marché et adaptez leurs stratégies.</p>',
      '<h3>Gestion de la qualité</h3><p>La qualité est un facteur différenciant majeur. Mettez en place des processus de contrôle qualité rigoureux et formez votre équipe aux standards les plus élevés.</p>',
      '<h3>Gestion financière</h3><p>Une gestion financière saine est essentielle pour la pérennité de votre activité. Développez des compétences en analyse financière et en planification budgétaire.</p>',
      '<h3>Gestion des ressources humaines</h3><p>Votre équipe est votre atout le plus précieux. Investissez dans le recrutement, la formation et le développement de vos collaborateurs pour maximiser leur potentiel.</p>'
    ];

    // Combiner toutes les sections
    const allSections = [...baseSections, ...specializedSections];
    
    let result = '';
    let currentWords = 0;
    let sectionIndex = 0;

    // Générer du contenu jusqu'à atteindre le nombre de mots demandé
    while (currentWords < additionalWords && sectionIndex < allSections.length) {
      const section = allSections[sectionIndex];
      const sectionWords = section.split(' ').length;
      
      if (currentWords + sectionWords <= additionalWords) {
        result += section;
        currentWords += sectionWords;
      } else {
        // Si on dépasse, générer du contenu personnalisé pour les mots restants
        const remainingWords = additionalWords - currentWords;
        if (remainingWords > 50) { // Seulement si il reste assez de mots
          const customContent = this.generateCustomContent(remainingWords);
          result += customContent;
        }
        break;
      }
      
      sectionIndex++;
    }

    // Si on n'a pas assez de sections, générer du contenu personnalisé
    if (currentWords < additionalWords) {
      const remainingWords = additionalWords - currentWords;
      const customContent = this.generateCustomContent(remainingWords);
      result += customContent;
    }

    return result;
  }

  // Fonction pour générer du contenu personnalisé selon le nombre de mots restants
  private generateCustomContent(wordCount: number): string {
    const paragraphs = [
      'L\'importance de cette approche ne peut être sous-estimée dans le contexte actuel. Les entreprises qui réussissent comprennent que la maîtrise de ces concepts est essentielle pour maintenir leur avantage concurrentiel.',
      'La mise en œuvre de ces stratégies nécessite une planification minutieuse et une exécution rigoureuse. Chaque étape doit être soigneusement préparée et exécutée avec précision pour maximiser les chances de succès.',
      'L\'évaluation continue des résultats permet d\'identifier les améliorations possibles et d\'ajuster la stratégie en conséquence. Cette approche itérative est fondamentale pour l\'optimisation des performances.',
      'La collaboration avec des experts du domaine peut accélérer considérablement votre progression. Le partage d\'expériences et de bonnes pratiques enrichit votre compréhension et améliore vos résultats.',
      'L\'innovation constante est nécessaire pour rester compétitif dans un environnement en évolution rapide. Encouragez la créativité et l\'expérimentation au sein de votre équipe.',
      'La formation continue de vos collaborateurs est un investissement rentable à long terme. Des compétences actualisées permettent de maintenir un niveau d\'expertise élevé et d\'adapter rapidement aux changements.',
      'La communication efficace avec toutes les parties prenantes est cruciale pour le succès de vos initiatives. Une stratégie de communication claire et cohérente facilite l\'adhésion et la collaboration.',
      'La gestion proactive des risques permet d\'anticiper les difficultés potentielles et de mettre en place des mesures préventives appropriées. Cette approche réduit les impacts négatifs et protège vos investissements.',
      'L\'optimisation des processus internes peut libérer des ressources importantes pour des activités à plus forte valeur ajoutée. Identifiez les goulots d\'étranglement et mettez en place des améliorations continues.',
      'Le développement de partenariats stratégiques peut créer des synergies intéressantes et ouvrir de nouvelles opportunités. Recherchez des collaborations qui complètent vos compétences et renforcent votre positionnement.'
    ];

    let result = '';
    let currentWords = 0;
    let paragraphIndex = 0;

    while (currentWords < wordCount && paragraphIndex < paragraphs.length) {
      const paragraph = paragraphs[paragraphIndex];
      const paragraphWords = paragraph.split(' ').length;
      
      if (currentWords + paragraphWords <= wordCount) {
        result += `<p>${paragraph}</p>`;
        currentWords += paragraphWords;
      } else {
        // Tronquer le paragraphe si nécessaire
        const remainingWords = wordCount - currentWords;
        const words = paragraph.split(' ');
        const truncatedParagraph = words.slice(0, remainingWords).join(' ');
        result += `<p>${truncatedParagraph}...</p>`;
        break;
      }
      
      paragraphIndex++;
    }

    return result;
  }

  // Fonction pour ajuster le ton du langage
  private adjustLanguageTone(content: string, tone: string): string {
    switch (tone) {
      case 'professional':
        // Ton déjà professionnel par défaut
        return content;
        
      case 'friendly':
        // Rendre le ton plus amical
        return content
          .replace(/Il est essentiel/g, 'Il est important')
          .replace(/Il est crucial/g, 'C\'est vraiment utile')
          .replace(/Nous vous recommandons/g, 'On vous conseille')
          .replace(/Il convient de/g, 'C\'est bien de')
          .replace(/Par conséquent/g, 'Du coup')
          .replace(/En effet/g, 'En fait');
          
      case 'authoritative':
        // Rendre le ton plus autoritaire
        return content
          .replace(/Il est important/g, 'Il est crucial')
          .replace(/Nous vous conseillons/g, 'Nous vous enjoignons')
          .replace(/Il est recommandé/g, 'Il est impératif')
          .replace(/Vous pouvez/g, 'Vous devez')
          .replace(/Il est possible de/g, 'Il est nécessaire de');
          
      case 'conversational':
        // Rendre le ton plus conversationnel
        return content
          .replace(/Il est important de/g, 'C\'est important de')
          .replace(/Nous vous recommandons/g, 'On vous dit')
          .replace(/Par conséquent/g, 'Donc')
          .replace(/En effet/g, 'En fait')
          .replace(/Il convient de/g, 'Il faut')
          .replace(/Il est essentiel/g, 'C\'est essentiel');
          
      case 'educational':
        // Rendre le ton plus éducatif
        return content
          .replace(/Il est important/g, 'Il est fondamental')
          .replace(/Nous vous recommandons/g, 'Nous vous enseignons')
          .replace(/Il convient de/g, 'Il est nécessaire de')
          .replace(/Par conséquent/g, 'Par conséquent, nous apprenons que')
          .replace(/En effet/g, 'En effet, comme nous l\'avons vu');
          
      default:
        return content;
    }
  }

  // Fonction pour intégrer intelligemment les images dans le contenu
  private integrateImagesInContent(content: string, images: any[], topic: string): string {
    if (!images || images.length === 0) {
      return content;
    }

    // Diviser le contenu en sections
    const sections = content.split(/(?=<h[1-6]>)/);
    const enhancedSections: string[] = [];
    let imageIndex = 0;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      enhancedSections.push(section);

      // Ajouter une image après chaque section importante (H1, H2)
      if (section.match(/<h[12][^>]*>/) && imageIndex < images.length) {
        const image = images[imageIndex];
        const imageHtml = this.createImageHtml(image, topic, i + 1);
        enhancedSections.push(imageHtml);
        imageIndex++;
      }

      // Ajouter une image au milieu du contenu si c'est une section longue
      if (section.length > 500 && imageIndex < images.length) {
        const words = section.split(' ');
        if (words.length > 100) {
          const midPoint = Math.floor(words.length / 2);
          const firstHalf = words.slice(0, midPoint).join(' ');
          const secondHalf = words.slice(midPoint).join(' ');
          
          const image = images[imageIndex];
          const imageHtml = this.createImageHtml(image, topic, i + 1, 'middle');
          
          enhancedSections[enhancedSections.length - 1] = firstHalf + imageHtml + secondHalf;
          imageIndex++;
        }
      }
    }

    return enhancedSections.join('');
  }

  // Fonction pour créer le HTML d'une image avec style moderne
  private createImageHtml(image: any, topic: string, sectionNumber: number, position: 'top' | 'middle' | 'bottom' = 'top'): string {
    const altText = `${topic} - Section ${sectionNumber}`;
    const caption = image.alt || `Image illustrant ${topic}`;
    
    return `
      <div class="article-image-container my-8">
        <figure class="relative group">
          <img 
            src="${image.url}" 
            alt="${altText}"
            class="w-full h-auto rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div>
          <figcaption class="mt-3 text-sm text-gray-600 text-center italic">
            ${caption}
            ${image.author ? ` - Photo par ${image.author}` : ''}
          </figcaption>
        </figure>
      </div>
    `;
  }

  // Fonction pour ajouter des images de fond pour les sections spéciales
  private addBackgroundImages(content: string, images: any[]): string {
    if (!images || images.length === 0) return content;

    // Ajouter une image de fond pour les sections de points clés
    content = content.replace(
      /(<h[1-6][^>]*>.*?points clés.*?<\/h[1-6]>)/gi,
      (match, heading) => {
        const image = images[0];
        return `
          <div class="relative overflow-hidden rounded-lg mb-6" style="background-image: linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url('${image.url}'); background-size: cover; background-position: center;">
            <div class="p-6">
              ${heading}
            </div>
          </div>
        `;
      }
    );

    return content;
  }
} 