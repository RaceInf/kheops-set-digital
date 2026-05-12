import React from 'react';
import { Helmet } from 'react-helmet-async';
import { GeneratedArticle } from '../../types/article';

interface Props {
  article: GeneratedArticle;
  url: string;
}

export default function ArticleSeo({ article, url }: Props) {
  const image = article.images[0]?.url;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.seoTitle,
    description: article.seoDescription,
    image: image,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    mainEntityOfPage: url,
  };
  return (
    <Helmet>
      <title>{article.seoTitle}</title>
      <meta name="description" content={article.seoDescription} />
      {/* Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={article.seoTitle} />
      <meta property="og:description" content={article.seoDescription} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:url" content={url} />
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={article.seoTitle} />
      <meta name="twitter:description" content={article.seoDescription} />
      {image && <meta name="twitter:image" content={image} />}
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
} 