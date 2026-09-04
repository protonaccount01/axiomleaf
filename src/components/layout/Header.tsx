import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { NAV_LINKS } from "@/config/site";
import { Logo } from "@/components/ui";
import { cn } from "@/utils/cn";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-white/85 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" aria-label="Axiomleaf home" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3.5 py-2 text-sm font-medium transition",
                  isActive ? "bg-leaf-50 text-leaf-800" : "text-ink/70 hover:bg-ink/5 hover:text-ink",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/tools" className="btn-primary ml-3 !py-2">
            Explore Tools
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink/10 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation"
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav id="mobile-nav" className="border-t border-ink/5 bg-white md:hidden" aria-label="Mobile">
          <div className="container-x flex flex-col py-2">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium",
                    isActive ? "bg-leaf-50 text-leaf-800" : "text-ink/80 hover:bg-ink/5",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
