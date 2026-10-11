#!/usr/bin/env node
/**
 *  Generates public/sitemap.xml from the static route list + tool registry.
 *
 * Usage: node scripts/generate-sitemap.mjs
 * Run it whenever you add a tool or page, then commit the result.
 * (Blog posts live on Blogger, which publishes its own sitemap – submit
 *  both sitemaps in Google Search Console.)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SITE_URL = process.env.VITE_SITE_URL?.replace(/\/$/, "") || "https://axiomleaf.pages.dev";

// Static pages: [path, changefreq, priority]
const STATIC = [
  ["/", "daily", "1.0"],
  ["/tools", "weekly", "0.9"],
  ["/blog", "daily", "0.9"],
  ["/about", "monthly", "0.5"],
  ["/contact", "monthly", "0.5"],
  ["/privacy-policy", "yearly", "0.3"],
  ["/terms-of-service", "yearly", "0.3"],
  ["/disclaimer", "yearly", "0.3"],
];

// Extract tool slugs and category slugs from the registry without importing TSX.
const registry = readFileSync(resolve(root, "src/tools/registry.tsx"), "utf8");
const toolSlugs = [...registry.matchAll(/^\s*slug:\s*"([a-z0-9-]+)"/gm)].map((m) => m[1]);
const categorySlugs = [...registry.matchAll(/\{\s*slug:\s*"([a-z]+)",\s*name:/g)].map((m) => m[1]);

const today = new Date().toISOString().slice(0, 10);
const url = (loc, freq, prio) =>
  `  <url>\n    <loc>${SITE_URL}${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${prio}</priority>\n  </url>`;

const entries = [
  ...STATIC.map(([p, f, pr]) => url(p, f, pr)),
  ...categorySlugs.map((c) => url(`/tools?category=${c}`, "weekly", "0.7")),
  ...toolSlugs.map((s) => url(`/tools/${s}`, "monthly", "0.8")),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
writeFileSync(resolve(root, "public/sitemap.xml"), xml.replace(/&/g, "&amp;"));
writeFileSync(
  resolve(root, "public/robots.txt"),
  `# Axiomleaf – ${SITE_URL}\nUser-agent: *\nAllow: /\nDisallow: /404\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
);
console.log(`✔ sitemap.xml written with ${entries.length} URLs (${toolSlugs.length} tools)`);
