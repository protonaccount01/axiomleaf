/**
 * HOME PAGE
 * Sections: Hero → Stats → Featured tools → Categories → Latest blog posts
 *           → Why Axiomleaf → How it works → FAQ → CTA
 * Every tool and blog post gets a preview here (requirement #11).
 */
import { Link } from "react-router-dom";
import { SEO, faqJsonLd, organizationJsonLd, websiteJsonLd } from "@/components/seo/SEO";
import { AdSlot, FAQ, Section, SectionHeading } from "@/components/ui";
import { ToolCard } from "@/components/tools/ToolCard";
import { PostCard, PostCardSkeleton } from "@/components/blog/PostCard";
import { usePosts } from "@/hooks/usePosts";
import { TOOLS, TOOL_CATEGORIES, featuredTools, toolsByCategory } from "@/tools/registry";
import { BLOGGER, SITE } from "@/config/site";

const HOME_FAQ = [
  { q: "Are all Axiomleaf tools really free?", a: "Yes. Every tool is free to use with no sign-up, no usage limits and no watermarks. The site is supported by unobtrusive advertising." },
  { q: "Is my data safe when I use a tool?", a: "All processing happens inside your browser using JavaScript. Text, images and files you enter are never uploaded to our servers." },
  { q: "Do the tools work offline?", a: "Once the page has loaded, most tools continue to work without an internet connection because they do not call any external API." },
  { q: "How often are new tools added?", a: "We ship new tools and improvements regularly. Have a request? Use the Contact page and tell us what would help you." },
  { q: "Can I use these tools for commercial work?", a: "Absolutely. Use the output in personal, educational or commercial projects without attribution." },
];

const FEATURES = [
  { icon: "⚡", title: "Instant & lightweight", text: "No bloated frameworks or trackers. Pages load in a blink, even on slow connections." },
  { icon: "🔒", title: "Privacy by design", text: "Tools run 100% client-side. Nothing you type or upload leaves your device." },
  { icon: "🆓", title: "Free forever", text: "No accounts, paywalls or usage caps – just open a tool and get to work." },
  { icon: "📱", title: "Works everywhere", text: "Fully responsive and keyboard accessible on phones, tablets and desktops." },
  { icon: "🧭", title: "Thoughtfully explained", text: "Every tool ships with a plain-English guide and FAQ so you always know what it does." },
  { icon: "🌱", title: "Constantly growing", text: "New utilities and articles are added regularly based on reader requests." },
];

export default function Home() {
  const { data: posts, loading, notConfigured, error } = usePosts(3);
  const featured = featuredTools();

  return (
    <>
      <SEO
        title="Home"
        description={SITE.description}
        path="/"
        keywords={["free online tools", "browser tools", "word counter", "json formatter", "password generator", "axiomleaf"]}
        jsonLd={[organizationJsonLd(), websiteJsonLd(), faqJsonLd(HOME_FAQ)]}
      />

      {/* ───── Hero ───── */}
      <section className="relative overflow-hidden">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-leaf-300/30 blur-3xl" />
        <div className="container-x relative py-20 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="badge animate-fade-up">🍃 {TOOLS.length}+ free tools · zero sign-up</span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-ink sm:text-6xl animate-fade-up [animation-delay:80ms]">
              Simple tools. <span className="text-leaf-600">Sharp</span> writing.
              <br className="hidden sm:block" /> Nothing in your way.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-ink/70 animate-fade-up [animation-delay:160ms]">
              Axiomleaf is a fast, privacy-first home for everyday utilities – counters, converters, generators, calculators –
              plus a blog that explains technology without the jargon. Everything runs in your browser. Nothing is tracked.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-up [animation-delay:240ms]">
              <Link to="/tools" className="btn-primary !px-6 !py-3 text-base">
                Browse all tools
              </Link>
              <Link to="/blog" className="btn-ghost !px-6 !py-3 text-base">
                Read the blog
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4 animate-fade-up [animation-delay:320ms]">
            {[
              [`${TOOLS.length}+`, "Free tools"],
              [`${TOOL_CATEGORIES.length}`, "Categories"],
              ["0", "Data collected"],
              ["100%", "Browser-based"],
            ].map(([v, l]) => (
              <div key={l} className="card px-4 py-5 text-center">
                <dt className="order-2 text-xs font-medium text-ink/55">{l}</dt>
                <dd className="text-2xl font-extrabold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ───── Featured tools ───── */}
      <Section className="bg-leaf-50/40 border-y border-ink/5">
        <SectionHeading
          eyebrow="Most popular"
          title="Featured tools"
          description="The utilities our readers reach for every day. Each opens instantly and works entirely offline once loaded."
          align="left"
          action={
            <Link to="/tools" className="btn-ghost">
              View all {TOOLS.length} tools →
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </Section>

      <div className="container-x">
        <AdSlot />
      </div>

      {/* ───── All categories with previews ───── */}
      <Section>
        <SectionHeading
          eyebrow="Everything in one place"
          title="Explore by category"
          description="Every tool on Axiomleaf, grouped so you can find the right one in seconds."
        />
        <div className="space-y-12">
          {TOOL_CATEGORIES.map((cat) => {
            const list = toolsByCategory(cat.slug);
            return (
              <div key={cat.slug}>
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="flex items-center gap-2 text-xl font-bold text-ink">
                      <span aria-hidden="true">{cat.icon}</span> {cat.name}
                      <span className="badge">{list.length}</span>
                    </h3>
                    <p className="mt-1 text-sm text-ink/60">{cat.description}</p>
                  </div>
                  <Link to={`/tools?category=${cat.slug}`} className="whitespace-nowrap text-sm font-semibold text-leaf-700 hover:underline">
                    All {cat.name.toLowerCase()} →
                  </Link>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {list.map((t) => (
                    <li key={t.slug}>
                      <Link
                        to={`/tools/${t.slug}`}
                        className="inline-flex items-center rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-sm font-medium text-ink/80 transition hover:border-leaf-500 hover:bg-leaf-50 hover:text-leaf-800"
                      >
                        {t.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ───── Latest from the blog ───── */}
      <Section className="border-y border-ink/5 bg-ink text-white">
        <div className="[&_h2]:text-white [&_p]:text-white/60">
          <SectionHeading
            eyebrow="Fresh reading"
            title="Latest from the blog"
            description="Clear, practical articles on web technology, productivity and digital life."
            align="left"
            action={
              <Link to="/blog" className="btn bg-white text-ink hover:bg-leaf-100">
                All articles →
              </Link>
            }
          />
        </div>
        {loading && (
          <div className="grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        )}
        {!loading && posts && posts.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
        {!loading && (notConfigured || error || posts?.length === 0) && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-white/80">
              {notConfigured
                ? "The blog feed will appear here once the Blogger API is configured."
                : error ?? "No posts published yet – check back soon."}
            </p>
            {BLOGGER.publicUrl && (
              <a href={BLOGGER.publicUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-leaf-400 hover:underline">
                Visit the blog directly →
              </a>
            )}
          </div>
        )}
      </Section>

      {/* ───── Why Axiomleaf ───── */}
      <Section>
        <SectionHeading eyebrow="Why Axiomleaf" title="Built the way tools should be" description="We started Axiomleaf because most 'free tool' sites are slow, cluttered and quietly harvest your data. This one is different." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6">
              <span className="text-2xl" aria-hidden="true">{f.icon}</span>
              <h3 className="mt-3 font-semibold text-ink">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-ink/65">{f.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ───── About / explanatory copy (important for AdSense) ───── */}
      <Section className="bg-leaf-50/40 border-y border-ink/5">
        <div className="prose-ax mx-auto max-w-3xl">
          <h2 className="!mt-0">What is Axiomleaf?</h2>
          <p>
            Axiomleaf is an independent web platform that combines a growing library of browser-based utilities with a
            thoughtfully written blog. The name reflects our philosophy: an <em>axiom</em> is a self-evident truth, and a{" "}
            <em>leaf</em> is the smallest useful unit of something that grows. We build small, obviously useful things – and
            we keep growing.
          </p>
          <p>
            The tools section covers the tasks people search for every day: counting words in an essay, formatting a
            messy JSON response, generating a strong password, converting kilometres to miles, calculating a loan payment
            or turning a link into a QR code. Instead of sending your input to a server, each tool is a self-contained
            piece of JavaScript that runs on your own device. That makes the tools faster, keeps them working offline and
            means there is simply no database of user data for anyone to leak.
          </p>
          <p>
            The blog, powered by Google's Blogger platform, publishes practical explainers on web development, productivity
            and digital privacy. Articles are written for curious non-experts first, with enough depth that professionals
            still find them worthwhile. Every tool page also includes a short guide and FAQ so you understand not just{" "}
            <em>how</em> to use it but <em>why</em> it works the way it does.
          </p>
          <h3>How to get the most out of the site</h3>
          <ol>
            <li>Bookmark the <Link to="/tools">Tools directory</Link> – the search box filters all {TOOLS.length} tools as you type.</li>
            <li>Browse categories in the footer of any page to discover utilities you didn't know you needed.</li>
            <li>Follow the <Link to="/blog">blog</Link> for new releases and deep dives.</li>
            <li>Missing something? <Link to="/contact">Tell us</Link> – most new tools start as a reader suggestion.</li>
          </ol>
        </div>
      </Section>

      {/* ───── FAQ ───── */}
      <Section>
        <SectionHeading eyebrow="Questions" title="Frequently asked questions" />
        <div className="mx-auto max-w-3xl">
          <FAQ items={HOME_FAQ} />
        </div>
      </Section>

      {/* ───── CTA ───── */}
      <section className="container-x pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-leaf-600 to-leaf-800 px-6 py-14 text-center text-white shadow-glow sm:px-12">
          <div className="bg-grid absolute inset-0 opacity-20" />
          <div className="relative">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Ready to get something done?</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">Pick a tool, paste your input and you're finished – no sign-up, no waiting.</p>
            <Link to="/tools" className="btn mt-7 bg-white text-leaf-800 hover:bg-leaf-50 !px-7 !py-3 text-base">
              Open the tools directory
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
