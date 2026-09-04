/**
 * SEO component – dependency-free replacement for react-helmet.
 *
 * On every route change it updates:
 *   • <title>
 *   • <meta name="description">, keywords, robots
 *   • Canonical <link>
 *   • Open Graph + Twitter Card tags
 *   • Optional JSON-LD structured data (schema.org)
 *
 * Usage:
 *   <SEO title="Word Counter" description="..." path="/tools/word-counter" jsonLd={{...}} />
 */
import { useEffect } from "react";
import { SITE } from "@/config/site";

export interface SEOProps {
  title: string;
  description: string;
  /** Route path starting with "/" – combined with SITE.url for canonical. */
  path: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function SEO({
  title,
  description,
  path,
  keywords,
  image,
  type = "website",
  noIndex = false,
  jsonLd,
}: SEOProps) {
  useEffect(() => {
    const fullTitle = path === "/" ? `${SITE.name} – ${SITE.tagline}` : `${title} | ${SITE.name}`;
    const url = `${SITE.url}${path}`;
    const img = `${SITE.url}${image ?? SITE.ogImage}`;

    document.title = fullTitle;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    if (keywords?.length) upsertMeta("name", "keywords", keywords.join(", "));
    upsertLink("canonical", url);

    upsertMeta("property", "og:site_name", SITE.name);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", img);
    upsertMeta("property", "og:locale", SITE.locale);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", img);

    // JSON-LD structured data
    const id = "ax-jsonld";
    document.getElementById(id)?.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = id;
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, path, keywords, image, type, noIndex, jsonLd]);

  return null;
}

/* ───────────── JSON-LD helpers ───────────── */

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/logo.svg`,
  email: SITE.email,
  sameAs: Object.values(SITE.social),
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE.url}/tools?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: `${SITE.url}${it.path}`,
  })),
});

export const faqJsonLd = (faq: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const softwareAppJsonLd = (name: string, description: string, path: string) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name,
  description,
  url: `${SITE.url}${path}`,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any (Web Browser)",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
});
