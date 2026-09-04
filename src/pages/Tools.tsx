/**
 * TOOLS DIRECTORY  (/tools)
 * Search + category filter over the registry. Category can be pre-selected
 * with ?category=<slug>, and search with ?q=<term> (used by sitelinks search).
 */
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SEO, breadcrumbJsonLd } from "@/components/seo/SEO";
import { AdSlot, FAQ, PageHero, Section } from "@/components/ui";
import { ToolCard } from "@/components/tools/ToolCard";
import { TOOLS, TOOL_CATEGORIES, type CategorySlug } from "@/tools/registry";
import { cn } from "@/utils/cn";

const TOOLS_FAQ = [
  { q: "Do I need to create an account?", a: "No. Every tool is available instantly without registration." },
  { q: "Where is my data processed?", a: "Entirely in your browser. Inputs are never transmitted to Axiomleaf or any third party." },
  { q: "Can I request a new tool?", a: "Yes – send your idea via the Contact page. Popular requests are prioritised." },
  { q: "Do the tools work on mobile?", a: "Yes, every tool is responsive and touch-friendly." },
];

export default function Tools() {
  const [params, setParams] = useSearchParams();
  const category = (params.get("category") ?? "all") as CategorySlug | "all";
  const [query, setQuery] = useState(params.get("q") ?? "");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter(
      (t) =>
        (category === "all" || t.category === category) &&
        (!q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.keywords.some((k) => k.includes(q))),
    );
  }, [category, query]);

  const setCategory = (c: string) => {
    const next = new URLSearchParams(params);
    if (c === "all") next.delete("category");
    else next.set("category", c);
    setParams(next, { replace: true });
  };

  const activeCat = TOOL_CATEGORIES.find((c) => c.slug === category);

  return (
    <>
      <SEO
        title={activeCat ? `${activeCat.name} – Free Online Tools` : "Free Online Tools"}
        description={
          activeCat
            ? `${activeCat.description} Browse ${list.length} free ${activeCat.name.toLowerCase()} that run in your browser.`
            : `Browse ${TOOLS.length} free browser-based tools: text utilities, developer tools, converters, generators, calculators and more. No sign-up, no uploads.`
        }
        path={activeCat ? `/tools?category=${activeCat.slug}` : "/tools"}
        keywords={["free online tools", "web tools", "browser utilities", ...TOOL_CATEGORIES.map((c) => c.name.toLowerCase())]}
        jsonLd={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Tools", path: "/tools" }])}
      />

      <PageHero
        eyebrow={`${TOOLS.length} tools · always free`}
        title="Free Online Tools"
        description="Fast, private utilities that run entirely in your browser. Search by name or pick a category to get started."
      >
        <div className="mt-8 max-w-xl">
          <label className="sr-only" htmlFor="tool-search">
            Search tools
          </label>
          <div className="relative">
            <svg className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-ink/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              id="tool-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search e.g. json, password, bmi…"
              className="input !rounded-2xl !py-3.5 !pl-12 text-base shadow-soft"
              autoComplete="off"
            />
          </div>
        </div>
      </PageHero>

      <Section className="!pt-8">
        {/* Category filter chips */}
        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
          {[{ slug: "all", name: "All tools", icon: "🍃" }, ...TOOL_CATEGORIES].map((c) => (
            <button
              key={c.slug}
              type="button"
              role="tab"
              aria-selected={category === c.slug}
              onClick={() => setCategory(c.slug)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition",
                category === c.slug ? "border-ink bg-ink text-white" : "border-ink/10 bg-white text-ink/75 hover:border-leaf-500 hover:text-leaf-800",
              )}
            >
              <span aria-hidden="true">{c.icon}</span> {c.name}
            </button>
          ))}
        </div>

        <p className="mb-5 text-sm text-ink/55" aria-live="polite">
          Showing {list.length} of {TOOLS.length} tools
        </p>

        {list.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center text-ink/60">
            No tools match "{query}". Try another keyword or{" "}
            <button type="button" className="font-semibold text-leaf-700 underline" onClick={() => { setQuery(""); setCategory("all"); }}>
              reset the filters
            </button>
            .
          </div>
        )}

        <AdSlot />

        {/* Explanatory copy */}
        <div className="prose-ax mx-auto mt-8 max-w-3xl">
          <h2>About the Axiomleaf tool collection</h2>
          <p>
            This directory contains every utility we have published, organised into {TOOL_CATEGORIES.length} categories.{" "}
            <strong>Text tools</strong> help you count, clean and transform writing. <strong>Developer tools</strong> format
            and decode the data structures programmers work with daily. <strong>Converters</strong> move values between
            colour models, measurement units, time formats and number bases. <strong>Generators</strong> create passwords,
            QR codes, CSS snippets and palettes. <strong>Calculators</strong> handle percentages, loans, dates and health
            metrics, and <strong>Utilities</strong> round things out with timers, a notepad and device diagnostics.
          </p>
          <p>
            Each tool is deliberately small and focused. We resist adding options that most people never use, because a
            simpler tool is faster to learn and less likely to produce a surprising result. Where a decision does matter –
            such as case sensitivity when removing duplicates or the unit system in the BMI calculator – you will find a
            clearly labelled toggle.
          </p>
          <p>
            Because all computation happens locally, you can safely paste confidential material: contracts into the word
            counter, API responses containing tokens into the JSON formatter, or unreleased artwork into the image
            encoder. There is no upload step and no server-side log.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <h2 className="mb-4 text-2xl font-bold text-ink">Frequently asked questions</h2>
          <FAQ items={TOOLS_FAQ} />
        </div>
      </Section>
    </>
  );
}
