import { Link } from "react-router-dom";
import { SEO } from "@/components/seo/SEO";
import { ToolCard } from "@/components/tools/ToolCard";
import { featuredTools } from "@/tools/registry";

export default function NotFound() {
  return (
    <>
      <SEO title="Page not found" description="The page you were looking for does not exist." path="/404" noIndex />
      <div className="container-x py-24 text-center">
        <p className="text-7xl">🍂</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-ink/65">The link may be broken or the page may have moved. Try one of the tools below or head back home.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="btn-primary">Go home</Link>
          <Link to="/tools" className="btn-ghost">Browse tools</Link>
        </div>
        <div className="mx-auto mt-14 grid max-w-4xl gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
          {featuredTools().slice(0, 4).map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </div>
    </>
  );
}
