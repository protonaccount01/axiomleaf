/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIGURATION
 *  Single source of truth for brand name, URLs, social links,
 *  and environment-driven secrets (Blogger API).
 *
 *  Environment variables are read from `.env` (never committed)
 *  or from your hosting provider's dashboard (Cloudflare Pages /
 *  GitHub Actions secrets). All Vite env vars MUST start with
 *  `VITE_` to be exposed to the browser bundle.
 * ─────────────────────────────────────────────────────────────
 */

export const SITE = {
  name: "Axiomleaf",
  tagline: "Free browser tools, honest writing, zero clutter.",
  description:
    "Axiomleaf is a fast, privacy-first platform offering 35+ free online tools that run entirely in your browser, plus in-depth articles on technology, productivity and the web.",
  /** Production URL – used for canonical links, sitemap and Open Graph. */
  url: (import.meta.env.VITE_SITE_URL as string | undefined) ?? "https://axiomleaf.pages.dev",
  /** Default social share image (place your own in /public). */
  ogImage: "/og-image.png",
  locale: "en_US",
  author: "Axiomleaf Team",
  email: "contact@axiomleaf.cc.cd",
  foundedYear: 2024,
  social: {
    github: "https://github.com/a1cva1",
    twitter: "https://x.com/axiomleaf",
  },
} as const;

/**
 * Blogger API v3 configuration.
 * Get a key at https://console.cloud.google.com → APIs & Services → Credentials.
 * IMPORTANT: restrict the key by HTTP referrer (your domain) because
 * any VITE_ variable becomes public inside the compiled JS bundle.
 */
export const BLOGGER = {
  apiKey: (import.meta.env.VITE_BLOGGER_API_KEY as string | undefined) ?? "",
  blogId: (import.meta.env.VITE_BLOGGER_BLOG_ID as string | undefined) ?? "",
  /** Fallback public blog URL shown when API isn't configured. */
  publicUrl: (import.meta.env.VITE_BLOGGER_PUBLIC_URL as string | undefined) ?? "",
  get isConfigured() {
    return Boolean(this.apiKey && this.blogId);
  },
};

/** Primary navigation – edit here and Header/Footer update automatically. */
export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Tools", to: "/tools" },
  { label: "Blog", to: "/blog" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export const LEGAL_LINKS = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms of Service", to: "/terms-of-service" },
  { label: "Disclaimer", to: "/disclaimer" },
  { label: "Contact Us", to: "/contact" },
] as const;
