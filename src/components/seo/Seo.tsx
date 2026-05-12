import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import metaData, { RouteMeta } from '@/seo/meta-data';

interface SeoProps {
  /** Page identifier (e.g., 'home', 'services') - will auto-fetch from meta-data.ts */
  page?: string;
  /** Page <title> text (overrides meta-data if provided) */
  title?: string;
  /** Meta description (max ~160 chars) (overrides meta-data if provided) */
  description?: string;
  /** Absolute URL to the preview image (Open Graph / Twitter) (overrides meta-data if provided) */
  image?: string;
  /** Canonical URL for the page (overrides meta-data if provided) */
  url?: string;
  /** og:type, e.g. 'website' or 'article' (overrides meta-data if provided) */
  type?: string;
  /** twitter:card type, defaults to summary_large_image (overrides meta-data if provided) */
  twitterCard?: 'summary' | 'summary_large_image';
  canonical?: string;
}

/**
 * Reusable SEO component generating all standard meta tags (HTML, Open Graph, Twitter).
 * Can auto-fetch metadata from meta-data.ts or use custom props.
 *
 * Usage with auto-fetch:
 *   <Seo page="home" />
 * 
 * Usage with custom props:
 *   <Seo
 *     title="Titre de la page"
 *     description="Description concise de la page."
 *     image="https://example.com/og/image.jpg"
 *     url="https://example.com/ma-page"
 *   />
 */
const Seo: React.FC<SeoProps> = ({
  page,
  title,
  description,
  image,
  url,
  type,
  twitterCard,
  canonical
}) => {
  const location = useLocation();
  
  // Get metadata from central file if page is specified
  let pageMeta: RouteMeta | undefined = undefined;
  if (page) {
    // Try to find by page identifier first
    pageMeta = metaData[`/${page}`] || metaData[page];
  }
  
  // Fallback to path-based lookup if no page meta found
  if (!pageMeta) {
    pageMeta = metaData[location.pathname];
  }

  // Use provided props or fallback to meta-data, then defaults
  const finalTitle = title || pageMeta?.title || 'KHEOPS SET DIGITAL';
  const finalDescription = description || pageMeta?.description || 'Agence web et marketing digital basée à Douala';
  const finalImage = image || pageMeta?.image;
  const finalUrl = url || pageMeta?.canonical || `https://kheopsetdigital.com${location.pathname}`;
  const finalType = type || pageMeta?.type || 'website';
  const finalTwitterCard = twitterCard || pageMeta?.twitterCard || 'summary_large_image';
  const finalCanonical = canonical || pageMeta?.canonical || finalUrl;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {finalCanonical && <link rel="canonical" href={finalCanonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      {finalUrl && <meta property="og:url" content={finalUrl} />}
      <meta property="og:type" content={finalType} />
      {finalImage && <meta property="og:image" content={finalImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content={finalTwitterCard} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      {finalImage && <meta name="twitter:image" content={finalImage} />}
    </Helmet>
  );
};

export default Seo;
