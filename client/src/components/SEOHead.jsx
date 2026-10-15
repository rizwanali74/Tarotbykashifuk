import { useEffect } from 'react';

/**
 * SEOHead - Dynamic SEO metadata, OpenGraph, Twitter Cards, and JSON-LD structured data.
 * Tailored for high-ranking UK, London, and international Tarot & Vedic Astrology search terms.
 */
export default function SEOHead({
  title = "Tarot By Kashif ✦ Best Tarot Reader & Vedic Astrologer London UK | Sacred Readings",
  description = "Experience accurate tarot readings, authentic Vedic astrology (Jyotish), numerology, and deep spiritual healing with Master Kashif. 12+ years experience serving London, UK and worldwide.",
  keywords = "best tarot reader uk, tarot reader london, psychic reading london, vedic astrology london, spiritual healing uk, best psychic in london, online tarot reading uk, trusted vedic astrologer london, jyotish chart reading, love and relationship tarot uk, chakra healing london, tarot by kashif",
  canonicalUrl = "https://tarotbykashifuk.com",
  ogImage = "/images/tarot-card.jpg",
  ogType = "website",
  schemaType = "ProfessionalService"
}) {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // Helper to update or create meta tags
    const setMetaTag = (attr, key, content) => {
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'author', 'Master Kashif');
    setMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    // 3. OpenGraph Tags
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', canonicalUrl || window.location.href);
    setMetaTag('property', 'og:image', window.location.origin + ogImage);
    setMetaTag('property', 'og:site_name', 'Tarot By Kashif UK');
    setMetaTag('property', 'og:locale', 'en_GB');

    // 4. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', window.location.origin + ogImage);

    // 5. Canonical Link Tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl || window.location.href);

    // 6. JSON-LD Structured Data (Schema.org)
    const schemaId = 'schema-json-ld-tarot';
    let scriptTag = document.getElementById(schemaId);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = schemaId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": schemaType,
      "name": "Tarot By Kashif UK",
      "alternateName": ["Tarot By Kashif", "Kashif Spiritual Sanctuary"],
      "image": window.location.origin + ogImage,
      "url": "https://tarotbykashifuk.com",
      "telephone": "+447400000000",
      "priceRange": "£35 - £169",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "London",
        "addressRegion": "Greater London",
        "addressCountry": "GB"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 51.5074,
        "longitude": -0.1278
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "09:00",
        "closes": "22:00"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "1520"
      },
      "founder": {
        "@type": "Person",
        "name": "Master Kashif",
        "jobTitle": "Master Tarot Reader, Vedic Astrologer & Spiritual Healer",
        "knowsAbout": [
          "Tarot Card Reading",
          "Vedic Astrology (Jyotish)",
          "Numerology",
          "Spiritual Healing",
          "Love and Relationship Guidance"
        ]
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Spiritual Consultation Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Tarot Card Reading",
              "description": "Comprehensive spiritual tarot card reading covering love, career, and life choices."
            },
            "price": "65",
            "priceCurrency": "GBP"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Complete Spiritual Guidance Package",
              "description": "All-in-one sacred bundle combining Tarot, Vedic Astrology, and Numerology."
            },
            "price": "169",
            "priceCurrency": "GBP"
          }
        ]
      }
    };

    scriptTag.text = JSON.stringify(structuredData);
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, schemaType]);

  return null;
}
