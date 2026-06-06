export const generateMetadata = ({
  title,
  description,
  keywords = [],
  url = '',
  image = '/og-image.jpg',
  type = 'website',
  locale = 'en',
  author = {},
}) => {
  const siteName = 'Fellini164';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = 'Modern React application with enterprise-level architecture';

  return {
    // Basic Meta Tags
    title: fullTitle,
    description: description || defaultDescription,
    keywords: keywords.join(', '),

    // Canonical URL
    canonical: url,

    // Open Graph (Facebook, LinkedIn)
    openGraph: {
      type,
      locale,
      url,
      title: fullTitle,
      description: description || defaultDescription,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description || defaultDescription,
      image,
      creator: author.twitter || '@fellini164',
    },

    // Additional Meta
    viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
    robots: 'index, follow',
    author: author.name || 'Fellini164 Team',
  };
};

/**
 * Generate structured data (JSON-LD) for better search engine understanding
 * @param {string} type - Schema type (Organization, WebSite, Article, Product, etc.)
 * @param {Object} data - Structured data
 * @returns {Object} JSON-LD script object
 */
export const generateStructuredData = (type, data) => {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  switch (type) {
    case 'Organization':
      return {
        ...baseData,
        name: data.name || 'Fellini164',
        url: data.url || 'https://fellini164.com',
        logo: data.logo || '/logo.png',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: data.phone,
          contactType: 'customer support',
          email: data.email,
        },
        sameAs: data.socialLinks || [],
      };

    case 'WebSite':
      return {
        ...baseData,
        name: data.name || 'Fellini164',
        url: data.url || 'https://fellini164.com',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${data.url}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      };

    case 'Article':
      return {
        ...baseData,
        headline: data.title,
        description: data.description,
        image: data.image,
        datePublished: data.publishedDate,
        dateModified: data.modifiedDate || data.publishedDate,
        author: {
          '@type': 'Person',
          name: data.author,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Fellini164',
          logo: {
            '@type': 'ImageObject',
            url: '/logo.png',
          },
        },
      };

    case 'Product':
      return {
        ...baseData,
        name: data.name,
        image: data.images || [],
        description: data.description,
        offers: {
          '@type': 'Offer',
          price: data.price,
          priceCurrency: data.currency || 'USD',
          availability: data.availability || 'https://schema.org/InStock',
        },
      };

    case 'BreadcrumbList':
      return {
        ...baseData,
        itemListElement: data.items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      };

    default:
      return { ...baseData, ...data };
  }
};

/**
 * Generate language alternate tags for multi-language support
 * @param {string} basePath - Base path without language prefix
 * @param {string[]} languages - Available languages
 * @returns {Array} Array of alternate link objects
 */
export const generateLanguageAlternates = (basePath, languages = ['en', 'fr']) => {
  return languages.map((lang) => ({
    hrefLang: lang,
    href: `/${lang}${basePath}`,
  }));
};

/**
 * Generate meta tags for Twitter Card
 * @param {Object} config - Twitter card configuration
 * @returns {Array} Array of meta tag objects
 */
export const generateTwitterCardTags = ({
  card = 'summary_large_image',
  site = '@fellini164',
  creator = '@fellini164',
  title,
  description,
  image,
}) => [
  { name: 'twitter:card', content: card },
  { name: 'twitter:site', content: site },
  { name: 'twitter:creator', content: creator },
  { name: 'twitter:title', content: title },
  { name: 'twitter:description', content: description },
  { name: 'twitter:image', content: image },
];

/**
 * Generate Open Graph meta tags
 * @param {Object} config - Open Graph configuration
 * @returns {Array} Array of meta tag objects
 */
export const generateOpenGraphTags = ({
  type = 'website',
  url,
  title,
  description,
  image,
  siteName = 'Fellini164',
  locale = 'en_US',
}) => [
  { property: 'og:type', content: type },
  { property: 'og:url', content: url },
  { property: 'og:title', content: title },
  { property: 'og:description', content: description },
  { property: 'og:image', content: image },
  { property: 'og:site_name', content: siteName },
  { property: 'og:locale', content: locale },
];

/**
 * Update document head with meta tags dynamically
 * @param {Object} metadata - Metadata configuration
 */
export const updateDocumentMeta = (metadata) => {
  // Update title
  if (metadata.title) {
    document.title = metadata.title;
  }

  // Update or create meta tags
  const updateMetaTag = (selector, content) => {
    let element = document.querySelector(selector);
    if (!element) {
      element = document.createElement('meta');
      const [attr, value] = selector.match(/\[(.*?)="(.*?)"\]/)?.slice(1) || [];
      if (attr && value) {
        element.setAttribute(attr, value);
      }
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // Basic meta tags
  if (metadata.description) {
    updateMetaTag('meta[name="description"]', metadata.description);
  }
  if (metadata.keywords) {
    updateMetaTag('meta[name="keywords"]', metadata.keywords);
  }

  // Open Graph tags
  if (metadata.openGraph) {
    const og = metadata.openGraph;
    updateMetaTag('meta[property="og:type"]', og.type);
    updateMetaTag('meta[property="og:title"]', og.title);
    updateMetaTag('meta[property="og:description"]', og.description);
    updateMetaTag('meta[property="og:url"]', og.url);
    if (og.images?.[0]?.url) {
      updateMetaTag('meta[property="og:image"]', og.images[0].url);
    }
  }

  // Twitter tags
  if (metadata.twitter) {
    const tw = metadata.twitter;
    updateMetaTag('meta[name="twitter:card"]', tw.card);
    updateMetaTag('meta[name="twitter:title"]', tw.title);
    updateMetaTag('meta[name="twitter:description"]', tw.description);
    updateMetaTag('meta[name="twitter:image"]', tw.image);
  }
};

/**
 * Inject JSON-LD structured data into document head
 * @param {Object} structuredData - JSON-LD data
 */
export const injectStructuredData = (structuredData) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(structuredData);

  // Remove existing JSON-LD of the same type
  const existing = document.querySelector(
    `script[type="application/ld+json"][data-type="${structuredData['@type']}"]`
  );
  if (existing) {
    existing.remove();
  }

  script.setAttribute('data-type', structuredData['@type']);
  document.head.appendChild(script);
};

export default {
  generateMetadata,
  generateStructuredData,
  generateLanguageAlternates,
  generateTwitterCardTags,
  generateOpenGraphTags,
  updateDocumentMeta,
  injectStructuredData,
};
