import { Link } from "react-router-dom";
import { LEGAL_LINKS, NAV_LINKS, SITE } from "@/config/site";
import { Logo } from "@/components/ui";
import { TOOL_CATEGORIES } from "@/tools/registry";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-ink/5 bg-ink text-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo className="text-white [&_span>span]:text-leaf-400" />
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">{SITE.description}</p>
          <div className="mt-5 flex gap-3">
            <a
              href={SITE.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/70 hover:border-leaf-400 hover:text-white"
            >
              GitHub
            </a>
            <a
              href={SITE.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/70 hover:border-leaf-400 hover:text-white"
            >
              X / Twitter
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-leaf-400">Navigate</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-white/70 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-leaf-400">Tool categories</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {TOOL_CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link to={`/tools?category=${c.slug}`} className="text-white/70 hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-xs text-white/50 sm:flex-row">
          <p>
            © {SITE.foundedYear}–{year} {SITE.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
