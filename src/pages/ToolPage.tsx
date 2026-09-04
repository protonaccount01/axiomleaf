/**
 * SINGLE TOOL PAGE  (/tools/:slug)
 * Renders the lazy-loaded tool component followed by the explanatory
 * copy, how-to steps, FAQ (with FAQ schema) and related tools.
 */
import { Suspense } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { SEO, breadcrumbJsonLd, faqJsonLd, softwareAppJsonLd } from "@/components/seo/SEO";
import { AdSlot, Breadcrumbs, FAQ, Spinner } from "@/components/ui";
import { ToolCard } from "@/components/tools/ToolCard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { getCategory, getTool, relatedTools } from "@/tools/registry";

export default function ToolPage() {
  const { slug = "" } = useParams();
  const tool = getTool(slug);
  if (!tool) return <Navigate to="/404" replace />;

  const cat = getCategory(tool.category)!;
  const path = `/tools/${tool.slug}`;
  const Component = tool.component;

  return (
    <>
      <SEO
        title={`${tool.name} – Free Online Tool`}
        description={tool.description}
        path={path}
        keywords={tool.keywords}
        jsonLd={[
          softwareAppJsonLd(tool.name, tool.description, path),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: cat.name, path: `/tools?category=${cat.slug}` },
            { name: tool.name, path },
          ]),
          faqJsonLd(tool.faq),
        ]}
      />

      <div className="border-b border-ink/5 bg-leaf-50/60">
        <div className="container-x py-8 sm:py-10">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Tools", path: "/tools" }, { name: cat.name, path: `/tools?category=${cat.slug}` }, { name: tool.name }]} />
          <div className="mt-4 flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-soft" aria-hidden="true">
              {cat.icon}
            </span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-4xl">{tool.name}</h1>
              <p className="mt-2 max-w-2xl text-ink/70">{tool.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-x py-8 sm:py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0">
            {/* The tool itself */}
            <div className="card p-5 sm:p-7">
              <ErrorBoundary>
                <Suspense fallback={<Spinner label="Loading tool…" />}>
                  <Component key={tool.slug} />
                </Suspense>
              </ErrorBoundary>
            </div>

            <AdSlot />

            {/* Explanatory content */}
            <article className="prose-ax">
              <h2>About the {tool.name}</h2>
              {tool.about.map((p, i) => (
                <p key={i}>{p}</p>
              ))}

              <h2>How to use this tool</h2>
              <ol>
                {tool.howTo.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>

              <h2>Privacy &amp; security</h2>
              <p>
                Like every utility on Axiomleaf, the {tool.name} is implemented in client-side JavaScript. Your input is
                processed in memory on your own device and is never sent to our servers or any third party. You can verify
                this by opening your browser's network panel: no requests are made while you use the tool. Once the page
                has loaded it will even keep working with the internet disconnected.
              </p>
            </article>

            <section className="mt-10">
              <h2 className="mb-4 text-2xl font-bold text-ink">Frequently asked questions</h2>
              <FAQ items={tool.faq} />
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            <AdSlot className="!my-0 min-h-64" label="Advertisement" />
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink/55">Related tools</h2>
              <div className="grid gap-3">
                {relatedTools(tool).map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
              <Link to={`/tools?category=${cat.slug}`} className="mt-4 inline-block text-sm font-semibold text-leaf-700 hover:underline">
                All {cat.name.toLowerCase()} →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
