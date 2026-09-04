# 🍃 Axiomleaf

> Free, privacy-first browser tools + a Blogger-powered blog. Built with **React 19, TypeScript, Vite 7 and Tailwind CSS v4**. No backend, no database, no tracking – deployable for free on Cloudflare Pages or GitHub Pages.

**Live URL:** https://axiomleaf.qzz.io  **Repo:** https://github.com/a1cva1/axioml

---

## Table of contents

1. [What this project is](#1-what-this-project-is)
2. [Tech stack & why](#2-tech-stack--why)
3. [Folder structure (what lives where)](#3-folder-structure-what-lives-where)
4. [How the pieces connect (data flow)](#4-how-the-pieces-connect-data-flow)
5. [Local development](#5-local-development)
6. [Environment variables & the Blogger API](#6-environment-variables--the-blogger-api)
7. [Deploying – Cloudflare Pages (recommended)](#7-deploying--cloudflare-pages-recommended)
8. [Deploying – GitHub Pages](#8-deploying--github-pages)
9. [Adding / editing a tool](#9-adding--editing-a-tool)
10. [Adding a new page](#10-adding-a-new-page)
11. [SEO system](#11-seo-system)
12. [Security model](#12-security-model)
13. [Google AdSense](#13-google-adsense)
14. [Design system (colours, classes)](#14-design-system-colours-classes)
15. [Scripts reference](#15-scripts-reference)
16. [Troubleshooting / debugging guide](#16-troubleshooting--debugging-guide)
17. [Roadmap ideas](#17-roadmap-ideas)

---

## 1. What this project is

Axiomleaf is a **static single-page application (SPA)**:

| Area | Route(s) | Description |
| --- | --- | --- |
| Home | `/` | Hero, featured tools, every category with every tool linked, latest 3 blog posts, "why us", long-form explanation, FAQ, CTA |
| Tools directory | `/tools`, `/tools?category=<slug>`, `/tools?q=<term>` | Searchable, filterable list of all **49 tools** |
| Tool page | `/tools/<slug>` | The interactive tool + "About", "How to use", "Privacy", FAQ (with FAQ schema), related tools, ad slots |
| Blog list | `/blog` | Posts fetched from the Blogger API v3, paginated ("Load more") |
| Blog post | `/blog/<postId>` | Sanitised article HTML, share button, "keep reading", tool previews |
| About | `/about` | Story, values, tech & security overview |
| Contact | `/contact` | Mailto-based form (no backend), FAQ |
| Legal | `/privacy-policy`, `/terms-of-service`, `/disclaimer` | AdSense-friendly legal pages |
| 404 | anything else | Friendly not-found page with tool suggestions |

**Every tool runs 100 % in the browser.** There is no server code anywhere in this repo.

---

## 2. Tech stack & why

| Package | Purpose |
| --- | --- |
| `react` 19 + `react-dom` | UI |
| `react-router-dom` 7 | Client-side routing (`createBrowserRouter`) |
| `typescript` | Type safety – `npx tsc --noEmit` must pass |
| `vite` 7 + `@vitejs/plugin-react` | Dev server & bundler |
| `tailwindcss` 4 + `@tailwindcss/vite` | Styling. **Bundled at build time – no CDN** (requirement #4) |
| `dompurify` | Sanitises Blogger HTML + Markdown/regex previews before `dangerouslySetInnerHTML` |
| `qrcode` | Renders QR codes to a `<canvas>` (QR Code Generator tool) |
| `clsx` + `tailwind-merge` | `cn()` helper for conditional classes |
| `vite-plugin-singlefile` | *(pre-installed in this template)* inlines JS/CSS into one `index.html`. See [§16](#16-troubleshooting--debugging-guide) if you prefer code-splitting. |

No fonts, icons, analytics or scripts are loaded from third-party CDNs. Icons are emoji + inline SVG.

---

## 3. Folder structure (what lives where)

```
axioml/
├── index.html                  # HTML shell: default meta tags, security metas, AdSense slot comment
├── vite.config.ts              # Vite config (alias "@" → src/)
├── tsconfig.json
├── package.json
├── .env.example                # Copy to .env – documents every env var
├── .gitignore                  # ignores .env, node_modules, dist
├── README.md                   # ← you are here
│
├── .github/workflows/
│   └── deploy-github-pages.yml # CI: build + deploy to GitHub Pages on push to main
│
├── scripts/
│   └── generate-sitemap.mjs    # Builds public/sitemap.xml from routes + tool registry
│
├── public/                     # Copied verbatim into dist/
│   ├── _headers                # Cloudflare Pages security headers (CSP, HSTS, …)
│   ├── _redirects              # Cloudflare Pages SPA rewrite  (/* → /index.html 200)
│   ├── 404.html                # GitHub Pages SPA fallback (stores path → redirects to /)
│   ├── robots.txt
│   ├── sitemap.xml             # Generated – do not hand-edit
│   ├── site.webmanifest        # PWA manifest
│   ├── favicon.svg, logo.svg, apple-touch-icon.png, og-image.png
│
└── src/
    ├── main.tsx                # React entry; restores GitHub-Pages redirect path
    ├── App.tsx                 # Mounts <RouterProvider> inside an ErrorBoundary
    ├── router.tsx              # ★ ROUTE TABLE – all pages are lazy-loaded here
    ├── index.css               # Tailwind import + @theme design tokens + component classes
    ├── vite-env.d.ts           # Types for import.meta.env.VITE_*
    │
    ├── config/
    │   └── site.ts             # ★ Brand name, URL, email, socials, nav links, Blogger env config
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Layout.tsx      # Page shell: skip-link, Header, <Outlet/>, Footer, scroll-to-top
    │   │   ├── Header.tsx      # Sticky nav (desktop + mobile menu) – reads NAV_LINKS
    │   │   └── Footer.tsx      # Footer – reads NAV_LINKS, LEGAL_LINKS, TOOL_CATEGORIES
    │   ├── seo/
    │   │   └── SEO.tsx         # ★ <SEO/> component (title/meta/canonical/OG/JSON-LD) + schema helpers
    │   ├── ui/
    │   │   └── index.tsx       # Logo, Section, SectionHeading, PageHero, Breadcrumbs, FAQ, AdSlot, Spinner, Callout
    │   ├── blog/
    │   │   └── PostCard.tsx    # Blog card + skeleton
    │   ├── tools/
    │   │   └── ToolCard.tsx    # Tool card
    │   └── ErrorBoundary.tsx   # Catches render errors (used app-wide and per-tool)
    │
    ├── hooks/
    │   └── usePosts.ts         # usePosts(n, label) / usePost(id) – loading/error state around the Blogger service
    │
    ├── services/
    │   └── blogger.ts          # ★ Blogger API v3 client: fetchPosts / fetchPost / searchPosts, DOMPurify sanitising, 5-min cache
    │
    ├── pages/                  # One file per route
    │   ├── Home.tsx
    │   ├── Tools.tsx           # directory with search + category chips
    │   ├── ToolPage.tsx        # renders a tool from the registry by :slug
    │   ├── Blog.tsx
    │   ├── BlogPost.tsx
    │   ├── About.tsx
    │   ├── Contact.tsx
    │   ├── NotFound.tsx
    │   └── legal/
    │       ├── LegalLayout.tsx # shared shell for the 3 legal pages
    │       ├── PrivacyPolicy.tsx
    │       ├── TermsOfService.tsx
    │       └── Disclaimer.tsx
    │
    ├── tools/
    │   ├── registry.tsx        # ★★ THE TOOL REGISTRY – metadata, SEO copy, FAQ, lazy component for all 49 tools
    │   ├── shared/ToolUI.tsx   # Field, Input, TextArea, Select, CopyButton, Result, Stat, Row, Actions, downloadText()
    │   ├── text/index.tsx      # 9 tools  (WordCounter, CaseConverter, LoremIpsum, …)
    │   ├── developer/index.tsx # 10 tools (JsonFormatter, Base64Tool, RegexTester, JwtDecoder, HashGenerator, …)
    │   ├── converters/index.tsx# 8 tools  (ColorConverter, UnitConverter, TimestampConverter, CsvJson, …)
    │   ├── generators/index.tsx# 7 tools  (PasswordGenerator, QrGenerator, GradientGenerator, MetaTagGenerator, …)
    │   ├── calculators/index.tsx# 8 tools (PercentageCalculator, BmiCalculator, LoanCalculator, AgeCalculator, …)
    │   └── utilities/index.tsx # 7 tools  (Stopwatch, CountdownTimer, ImageToBase64, TextToSpeech, Notepad, …)
    │
    └── utils/
        └── cn.ts               # cn() = clsx + tailwind-merge
```

★ = files you will edit most often.

---

## 4. How the pieces connect (data flow)

```
index.html ─▶ src/main.tsx ─▶ App.tsx ─▶ router.tsx ─▶ Layout.tsx (Header/Footer)
                                                          └─▶ <Outlet/> = the page component
```

### Tools
```
tools/registry.tsx  (array of Tool objects)
   ├─▶ pages/Home.tsx        featuredTools(), toolsByCategory()  → previews of EVERY tool
   ├─▶ pages/Tools.tsx       TOOLS filtered by ?category and search box
   ├─▶ pages/ToolPage.tsx    getTool(slug) → renders tool.component (React.lazy) + tool.about/howTo/faq
   ├─▶ components/layout/Footer.tsx   TOOL_CATEGORIES links
   └─▶ scripts/generate-sitemap.mjs   regex-reads slugs → sitemap.xml
```
Each `Tool.component` is `lazy(() => import("./<category>"))`, so the code for a category is only evaluated when a tool from it is opened.

### Blog
```
config/site.ts (BLOGGER.apiKey / blogId from env)
   └─▶ services/blogger.ts  fetch → normalise → DOMPurify.sanitize → cache
         └─▶ hooks/usePosts.ts  { data, loading, error, notConfigured, loadMore }
               ├─▶ pages/Home.tsx      usePosts(3)  → 3 latest cards
               ├─▶ pages/Blog.tsx      usePosts(9)  → grid + Load more
               └─▶ pages/BlogPost.tsx  usePost(id)  → article
```
If the env vars are missing, `BloggerNotConfigured` is thrown and the pages show a friendly setup notice instead of crashing.

### SEO
Every page renders `<SEO title description path keywords jsonLd/>` (`components/seo/SEO.tsx`). On mount it rewrites `<title>`, description, robots, canonical, Open Graph, Twitter tags and injects a `<script type="application/ld+json">`.

---

## 5. Local development

```bash
# Requirements: Node 20+ and npm
npm install                 # install dependencies
cp .env.example .env        # then fill in the Blogger values (optional for dev)
npm run dev                 # http://localhost:5173
npm run build               # production build → dist/
npm run preview             # serve dist/ locally
npx tsc --noEmit            # type-check only
node scripts/generate-sitemap.mjs   # regenerate public/sitemap.xml
```

---

## 6. Environment variables & the Blogger API

All variables are read in **`src/config/site.ts`** and typed in **`src/vite-env.d.ts`**.

| Variable | Required | Example | Used for |
| --- | --- | --- | --- |
| `VITE_SITE_URL` | recommended | `https://axiomleaf.qzz.io` | canonical URLs, OG tags, sitemap |
| `VITE_BLOGGER_API_KEY` | for blog | `AIzaSy…` | Blogger API v3 requests |
| `VITE_BLOGGER_BLOG_ID` | for blog | `1234567890123456789` | which blog to read |
| `VITE_BLOGGER_PUBLIC_URL` | optional | `https://yourblog.blogspot.com` | fallback link when API not configured |

### Getting the Blogger credentials (step by step)

1. **Blog ID** – open https://www.blogger.com, select your blog; the dashboard URL contains `blogID=1234…`. That number is the ID.
2. **API key** – go to https://console.cloud.google.com → create/select a project → *APIs & Services → Library* → enable **Blogger API v3** → *Credentials → Create credentials → API key*.
3. **Restrict the key (IMPORTANT).** Because Vite embeds `VITE_*` values in the public JS bundle, anyone can read the key. Make it harmless:
   - *Application restrictions* → **HTTP referrers** → add `https://axiomleaf.qzz.io/*` (and `http://localhost:5173/*` for dev).
   - *API restrictions* → **Restrict key** → only *Blogger API v3*.
4. The blog must be **public** (Blogger → Settings → Permissions → Reader access: Public).
5. Put the values in `.env` locally, and in your host's environment variables for production (see §7/§8). **Never commit `.env`** – it is git-ignored.

The service reads only *live* posts (`status=live`), 9 per page, with images and bodies; the raw HTML passes through DOMPurify (scripts, iframes, forms, styles removed).

---

## 7. Deploying – Cloudflare Pages (recommended)

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → select `a1cva1/axioml`.
2. Build settings:
   - Framework preset: **Vite**
   - Build command: `node scripts/generate-sitemap.mjs && npm run build`
   - Build output directory: `dist`
   - Node version: add env var `NODE_VERSION = 20`
3. **Environment variables** (Settings → Environment variables → Production): add `VITE_SITE_URL`, `VITE_BLOGGER_API_KEY`, `VITE_BLOGGER_BLOG_ID` (mark the key as *encrypted/secret*).
4. Deploy. Add your custom domain under *Custom domains*.
5. `public/_redirects` makes deep links work and `public/_headers` applies the security headers automatically – nothing else to configure.
6. Optional hardening in Cloudflare: *SSL/TLS → Full (strict)*, *Always Use HTTPS*, *HSTS*, *Bot Fight Mode*, *WAF managed rules*, *Web Analytics* (cookie-free).

Every push to `main` triggers a new deployment.

---

## 8. Deploying – GitHub Pages

The workflow **`.github/workflows/deploy-github-pages.yml`** is already included.

1. Repo → *Settings → Pages* → Source: **GitHub Actions**.
2. Repo → *Settings → Secrets and variables → Actions*:
   - Secrets: `VITE_BLOGGER_API_KEY`, `VITE_BLOGGER_BLOG_ID`
   - Variables: `VITE_SITE_URL`, optionally `VITE_BLOGGER_PUBLIC_URL`
3. Push to `main` → the action builds and publishes `dist/`.
4. For a custom domain add a `public/CNAME` file containing `axiomleaf.qzz.io` and configure DNS.

Deep links on GitHub Pages work through `public/404.html` + the restore logic in `src/main.tsx` (the "spa-github-pages" technique). GitHub Pages **ignores `_headers`** – put Cloudflare (proxy mode) in front of it to get the security headers, or rely on the `<meta>` fallbacks in `index.html`.

---

## 9. Adding / editing a tool

1. **Write the component** in the matching category file, e.g. `src/tools/text/index.tsx`:
   ```tsx
   export function MyTool() {
     const [v, setV] = useState("");
     return <TextArea value={v} onChange={setV} />;
   }
   ```
   Use the primitives from `src/tools/shared/ToolUI.tsx` for a consistent look. Components take **no props**.
2. **Register it** in `src/tools/registry.tsx` – copy an existing entry:
   ```ts
   {
     slug: "my-tool",                 // URL: /tools/my-tool (unique, lowercase, hyphens)
     name: "My Tool",
     category: "text",                // one of TOOL_CATEGORIES slugs
     description: "One sentence for cards & meta description.",
     keywords: ["…"],
     about: ["Paragraph 1…", "Paragraph 2…"],   // shown on the page – keep it original & helpful (AdSense!)
     howTo: ["Step 1", "Step 2", "Step 3"],
     faq: [{ q: "…", a: "…" }, …],                // rendered + emitted as FAQPage schema
     component: T("MyTool"),          // T/D/C/G/K/U = lazy loader for each category file
     featured: false,                 // true → appears in Home "Featured tools"
   }
   ```
3. Run `node scripts/generate-sitemap.mjs` and commit.

That's it – Home, /tools, footer, sitemap and the tool page all update automatically.

**New category?** Add it to `TOOL_CATEGORIES`, extend the `CategorySlug` type, create `src/tools/<slug>/index.tsx` and a loader like `const X = (name) => lazy(() => import("./<slug>")…)`.

---

## 10. Adding a new page

1. Create `src/pages/MyPage.tsx`. Render `<SEO … />` first, then content. Use `PageHero`, `Section`, `AdSlot`, `FAQ` from `@/components/ui`.
2. Add a lazy import + route in **`src/router.tsx`**.
3. Add a link in `NAV_LINKS` or `LEGAL_LINKS` (`src/config/site.ts`) if it should appear in the header/footer.
4. Add the path to the `STATIC` array in `scripts/generate-sitemap.mjs` and regenerate.

---

## 11. SEO system

- **Per-route meta** via `<SEO/>` – title pattern `Page | Axiomleaf`, description, keywords, robots, canonical, OG/Twitter, `og:type=article` for posts.
- **Structured data (JSON-LD)** helpers in `SEO.tsx`: `organizationJsonLd`, `websiteJsonLd` (with SearchAction → `/tools?q=`), `breadcrumbJsonLd`, `faqJsonLd`, `softwareAppJsonLd`; `BlogPosting` is built inline in `BlogPost.tsx`.
- **Semantic HTML**: single `<h1>` per page, `<article>`, `<nav aria-label>`, `<time dateTime>`, breadcrumbs, skip link.
- **`public/sitemap.xml`** (generated) + **`public/robots.txt`**. Submit the sitemap in Google Search Console; Blogger publishes its own sitemap for post URLs – submit that too.
- **Content depth**: every page – including each tool page – contains original explanatory paragraphs, how-to steps and FAQs (requirement #6).
- **Performance**: no external fonts/scripts, lazy routes, `loading="lazy"` images, prefers-reduced-motion respected.

> Because this is a client-rendered SPA, Google renders the JS to index it (this works well for Googlebot). If you later want pre-rendered HTML for every route, add `vite-plugin-prerender` or migrate to a static generator – the component structure already supports it.

---

## 12. Security model

| Layer | What | Where |
| --- | --- | --- |
| No backend | Nothing to breach – static files only | – |
| Client-side processing | Tool inputs never leave the browser | all `src/tools/*` |
| HTML sanitising | `DOMPurify.sanitize()` on Blogger content, Markdown preview, regex highlighter | `services/blogger.ts`, `tools/developer` |
| Content-Security-Policy, HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, COOP | Edge headers | `public/_headers` |
| Fallback metas (nosniff, referrer, permissions) | For hosts that ignore `_headers` | `index.html` |
| External links | `rel="noopener noreferrer"` everywhere | Footer, Contact, PostCard |
| Secrets | `.env` git-ignored; API key must be referrer-restricted | `.env.example`, §6 |
| Input validation | Blog post ids checked with `/^\d+$/`; file uploads type & size checked; regex errors caught | `blogger.ts`, `utilities/index.tsx` |
| Error isolation | `ErrorBoundary` around app and each tool | `components/ErrorBoundary.tsx` |
| Dependencies | Only 4 runtime libs, pinned in `package-lock.json`; run `npm audit` periodically | – |
| No CDN | Tailwind/React are compiled into the bundle (requirement #4) | `vite.config.ts` |

**CSP note:** `script-src` includes `'unsafe-inline'` only because `vite-plugin-singlefile` inlines the JS bundle. If you remove that plugin (§16) you can remove `'unsafe-inline'` from `script-src` for a stricter policy. The AdSense origins are already whitelisted.

---

## 13. Google AdSense

1. Apply once the site has been live for a few weeks with the blog populated.
2. After approval, paste the AdSense loader `<script>` into `index.html` where the comment says so.
3. Replace the placeholder markup inside **`AdSlot`** (`src/components/ui/index.tsx`) with your `<ins class="adsbygoogle">` unit. Every page already has slots in sensible positions (after hero content, in the sidebar, between article and FAQ).
4. Keep the legal pages (`/privacy-policy`, `/terms-of-service`, `/disclaimer`) – AdSense reviewers look for them. Update the email/contact details in `src/config/site.ts`.
5. Add `ads.txt` to `public/` once Google gives you the line (`google.com, pub-XXXX, DIRECT, f08c47fec0942fa0`).

---

## 14. Design system (colours, classes)

Defined in **`src/index.css`** with Tailwind v4 `@theme`:

- **Brand palette** – `leaf-50 … leaf-900` (greens, primary `leaf-600 #16a34a`), `ink` (`#0b0f0d` near-black), `ink-soft`, `ink-muted`, plain white backgrounds. Green + white + black as required.
- **Component classes** – `.container-x`, `.card`, `.input`, `.textarea`, `.btn`, `.btn-primary`, `.btn-dark`, `.btn-ghost`, `.badge`, `.prose-ax` (article typography), `.bg-grid`, `.animate-fade-up`.
- **Shadows** – `shadow-soft`, `shadow-glow`.
- Logo is inline SVG in `components/ui/index.tsx` (`<Logo/>`) and duplicated as `public/favicon.svg` / `logo.svg`.

---

## 15. Scripts reference

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-checks via Vite/esbuild and outputs `dist/` |
| `npm run preview` | Serves `dist/` |
| `node scripts/generate-sitemap.mjs` | Regenerates `public/sitemap.xml` (respects `VITE_SITE_URL`) |
| `npx tsc --noEmit` | Strict type-check |

---

## 16. Troubleshooting / debugging guide

| Symptom | Likely cause / fix |
| --- | --- |
| Blog shows "Blog feed not configured" | `VITE_BLOGGER_API_KEY` / `VITE_BLOGGER_BLOG_ID` missing at **build time**. Env vars are baked in during `npm run build` – set them on the host and redeploy. |
| Blog error "API key rejected (403)" | Referrer restriction doesn't match your domain, Blogger API not enabled in the Cloud project, or blog is private. |
| Deep link (e.g. `/tools/word-counter`) 404s | Cloudflare: make sure `_redirects` is in `dist/`. GitHub Pages: `404.html` must be deployed; check `sessionStorage` logic in `main.tsx`. |
| Tool page blank / error box | The component name in `registry.tsx` (`T("WordCounter")`) must exactly match the exported function name in the category file. Open DevTools console. |
| Build error "Cannot apply unknown utility class" | Tailwind v4 does not allow `@apply` of custom classes; use raw utilities inside `@layer components`. |
| Large single `index.html` (~600 kB) | `vite-plugin-singlefile` inlines everything. To enable code-splitting & long-term caching, remove `viteSingleFile()` from `plugins` in `vite.config.ts`; the lazy imports already exist so chunks will split automatically. Then drop `'unsafe-inline'` from `script-src` in `_headers`. |
| Styles missing in production | Ensure `src/index.css` is imported in `main.tsx` and classes are not built dynamically from strings Tailwind can't see. |
| TypeScript error on `import.meta.env` | Add the variable to `src/vite-env.d.ts`. |
| Sitemap missing a tool | Run `node scripts/generate-sitemap.mjs` after editing the registry. |

Debug checklist for AI assistants: start at `src/router.tsx` (which page), then the page file in `src/pages/`, then the data source (`src/tools/registry.tsx` or `src/services/blogger.ts`). Shared UI lives in `src/components/ui/index.tsx` and `src/tools/shared/ToolUI.tsx`.

---

## 17. Roadmap ideas

- Pre-rendering each route to static HTML for even better SEO
- More tools: JSON→CSV, image compressor/resizer (canvas), file hash, diff checker, colour contrast checker
- Dark mode toggle (tokens already centralised in `index.css`)
- Blog label filtering and search UI (service functions already exist)
- `ads.txt` + consent management once AdSense is approved

---

Made with 🍃 by Axiomleaf. Licensed for personal use; third-party packages retain their own licences.
