import puppeteer from 'puppeteer';
import fs from 'fs';

const pages = [
  '/',
  '/services',
  '/apropos',
  '/contact',
  '/boutique',
  '/mentions-legales',
  '/politique-de-confidentialite',
  '/conditions-generales-de-vente'
];

// Détection automatique du port Vite
function detectVitePort() {
  // 1. Vérifier la variable d'environnement PORT
  if (process.env.PORT) return process.env.PORT;
  // 2. Vérifier si Vite a écrit le port dans un fichier .vite-port (optionnel)
  if (fs.existsSync('.vite-port')) {
    return fs.readFileSync('.vite-port', 'utf-8').trim();
  }
  // 3. Fallback sur 8080 puis 8081
  return 8081;
}

const port = detectVitePort();

async function checkSeo() {
  console.log(`🚀 Démarrage de l'analyse SEO sur le port ${port}...\n`);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920x1080'
    ]
  });
  
  try {
    for (const page of pages) {
      console.log(`\n📄 Analyse de la page: ${page}`);
      const url = `https://localhost:${port}${page}`;
      
      const pageInstance = await browser.newPage();
      
      // Configuration de la page
      await pageInstance.setViewport({ width: 1920, height: 1080 });
      await pageInstance.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
      
      // Ignorer les erreurs HTTPS
      await pageInstance.setBypassCSP(true);
      
      try {
        await pageInstance.goto(url, { 
          waitUntil: 'networkidle0',
          timeout: 30000 // 30 secondes de timeout
        });
        
        // Attendre que le titre soit présent (signe que Helmet a injecté les balises)
        await pageInstance.waitForSelector('title', { timeout: 5000 });
        // Attendre un délai supplémentaire pour le rendu complet
        await new Promise(r => setTimeout(r, 1000));

        // Vérifier la présence de la balise canonical
        const canonicalHref = await pageInstance.evaluate(() => {
          const link = document.querySelector('link[rel="canonical"]');
          return link ? link.getAttribute('href') : null;
        });

        if (!canonicalHref) {
          console.error(`❌ Balise canonical absente sur ${url}`);
        } else {
          console.log(`Canonical: ${canonicalHref}`);
        }

        // Vérifier les images
        const images = await pageInstance.evaluate(() => {
          return Array.from(document.querySelectorAll('img')).map(img => ({
            src: img.src,
            alt: img.alt,
            width: img.width,
            height: img.height,
            loading: img.loading,
            isVisible: img.offsetParent !== null
          }));
        });

        console.log('\nImages trouvées:');
        if (images.length === 0) {
          console.warn('⚠️ Aucune image trouvée sur la page');
        } else {
          images.forEach((img, index) => {
            console.log(`\nImage ${index + 1}:`);
            console.log(`- Source: ${img.src}`);
            console.log(`- Alt: ${img.alt || '⚠️ Alt manquant'}`);
            console.log(`- Dimensions: ${img.width}x${img.height}`);
            console.log(`- Lazy loading: ${img.loading || 'non défini'}`);
            console.log(`- Visible: ${img.isVisible ? '✅' : '❌'}`);
          });
        }
        
        // Récupération des métadonnées
        const metadata = await pageInstance.evaluate(() => {
          const getMetaContent = (name) => {
            const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
            return meta ? meta.getAttribute('content') : null;
          };
          
          return {
            title: document.title,
            description: getMetaContent('description'),
            keywords: getMetaContent('keywords'),
            ogTitle: getMetaContent('og:title'),
            ogDescription: getMetaContent('og:description'),
            ogImage: getMetaContent('og:image'),
            twitterTitle: getMetaContent('twitter:title'),
            twitterDescription: getMetaContent('twitter:description'),
            twitterImage: getMetaContent('twitter:image'),
            canonical: getMetaContent('canonical'),
            h1: document.querySelector('h1')?.textContent,
            images: Array.from(document.images).map(img => ({
              src: img.src,
              alt: img.alt
            }))
          };
        });
        
        // Affichage des résultats
        console.log('\nRésultats:');
        console.log('----------');
        
        console.log('\nMétadonnées:');
        console.log(`Titre: ${metadata.title}`);
        console.log(`Description: ${metadata.description}`);
        console.log(`Mots-clés: ${metadata.keywords}`);
        
        console.log('\nOpen Graph:');
        console.log(`Titre: ${metadata.ogTitle}`);
        console.log(`Description: ${metadata.ogDescription}`);
        console.log(`Image: ${metadata.ogImage}`);
        
        console.log('\nTwitter Card:');
        console.log(`Titre: ${metadata.twitterTitle}`);
        console.log(`Description: ${metadata.twitterDescription}`);
        console.log(`Image: ${metadata.twitterImage}`);
        
        console.log('\nAutres:');
        console.log(`URL Canonique: ${metadata.canonical}`);
        console.log(`H1: ${metadata.h1}`);
        
        // Vérification des images
        const imagesWithoutAlt = metadata.images.filter(img => !img.alt);
        if (imagesWithoutAlt.length > 0) {
          console.log('\n⚠️ Images sans attribut alt:');
          imagesWithoutAlt.forEach(img => {
            console.log(`- ${img.src}`);
          });
        }
        
        // Vérifications de base
        const issues = [];
        
        if (!metadata.title) issues.push('❌ Titre manquant');
        if (!metadata.description) issues.push('❌ Description meta manquante');
        if (!metadata.ogTitle) issues.push('❌ Titre Open Graph manquant');
        if (!metadata.ogDescription) issues.push('❌ Description Open Graph manquante');
        if (!metadata.ogImage) issues.push('❌ Image Open Graph manquante');
        if (!metadata.h1) issues.push('❌ Balise H1 manquante');
        
        if (issues.length > 0) {
          console.log('\n⚠️ Problèmes détectés:');
          issues.forEach(issue => console.log(issue));
        } else {
          console.log('\n✅ Aucun problème majeur détecté');
        }
        
      } catch (error) {
        console.error(`❌ Erreur lors de l'analyse de ${url}:`, error.message);
      }
      
      await pageInstance.close();
      console.log('\n' + '='.repeat(50));
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse:', error);
  } finally {
    await browser.close();
  }
}

checkSeo(); 