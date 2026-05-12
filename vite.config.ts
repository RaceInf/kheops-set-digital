import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import mkcert from 'vite-plugin-mkcert';
// vite-plugin-prerender is published as CommonJS which causes "require is not defined" in pure ESM.
// Use Node's createRequire to load it safely in an ESM context.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createRequire } from 'module';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const vitePrerender = require('vite-plugin-prerender');
import metaData from './src/seo/meta-data';
import sitemap from 'vite-plugin-sitemap';

// Configuration de base pour Vite
const enablePrerender = process.env.PRERENDER === 'true';
const puppeteerExecutable = process.env.PUPPETEER_EXECUTABLE_PATH || require('puppeteer').executablePath();
const config = {
  server: {
    host: '::',
    port: 8080,
    https: {
      // Configuration vide pour permettre à mkcert de générer les certificats
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    }
  },
  plugins: [
    react(),
    mkcert(),
    sitemap({
        hostname: 'https://kheopsetdigital.com',
        dynamicRoutes: Object.keys(metaData),
      }),
      ...(enablePrerender ? [
        vitePrerender({
          staticDir: path.join(__dirname, 'dist'),
          routes: Object.keys(metaData).filter(route => 
            !['/admin', '/404', '/blog/post', '/services/detail', '/ebook', '/services/formulaire-de-souscription'].includes(route)
          ),
          rendererOptions: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
          },
          maxConcurrentRoutes: 1, // Rendus séquentiels pour plus de stabilité
          postProcess: (context: any) => {
            const meta = (metaData as Record<string, any>)[context.route];
            if (!meta) return context;
            let html = context.html;
            html = html.replace(/<title>(.*?)<\/title>/i, `<title>${meta.title}</title>`);
            const canonical = meta.canonical ?? meta.url ?? `https://kheopsetdigital.com${context.route}`;
            const tags = [
              `<meta name="description" content="${meta.description}">`,
              `<link rel="canonical" href="${canonical}">`,
              `<meta property="og:title" content="${meta.title}">`,
              `<meta property="og:description" content="${meta.description}">`,
              `<meta property="og:url" content="${canonical}">`,
              `<meta property="og:type" content="${meta.type ?? 'website'}">`,
              meta.image ? `<meta property="og:image" content="${meta.image}">` : '',
              `<meta name="twitter:card" content="${meta.twitterCard ?? 'summary_large_image'}">`,
              `<meta name="twitter:title" content="${meta.title}">`,
              `<meta name="twitter:description" content="${meta.description}">`,
              meta.image ? `<meta name="twitter:image" content="${meta.image}">` : '',
            ].filter(Boolean).join('\n      ');
            html = html.replace('</head>', `  ${tags}\n</head>`);
            context.html = html;
            return context;
          },
        })
      ] : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor';
            }
            return 'vendor';
          }
        },
      },
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig(config);
