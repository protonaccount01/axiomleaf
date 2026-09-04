import { Link } from "react-router-dom";
import { getCategory, type Tool } from "@/tools/registry";

/** Compact card used on Home, /tools and related-tools sections. */
export function ToolCard({ tool }: { tool: Tool }) {
  const cat = getCategory(tool.category);
  return (
    <Link
      to={`/tools/${tool.slug}`}
      className="card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:border-leaf-400 hover:shadow-glow"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-50 text-xl" aria-hidden="true">
          {cat?.icon}
        </span>
        <span className="text-[11px] font-medium uppercase tracking-wider text-ink/45">{cat?.name}</span>
      </div>
      <h3 className="mt-4 font-semibold text-ink group-hover:text-leaf-700">{tool.name}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-ink/60">{tool.description}</p>
      <span className="mt-4 text-sm font-semibold text-leaf-700 opacity-0 transition group-hover:opacity-100">Open tool →</span>
    </Link>
  );
}
