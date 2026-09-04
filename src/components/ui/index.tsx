/**
 * Shared, presentational UI primitives used across all pages.
 * Keep these small and dependency-free.
 */
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

/* ───────────── Logo ───────────── */
export function Logo({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-bold tracking-tight text-ink", className)}>
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect width="48" height="48" rx="12" fill="#0b0f0d" />
        <path
          d="M14 33c0-11 7-18 20-19-1 13-8 20-20 19Z"
          fill="#22c55e"
        />
        <path d="M14 33c5-6 10-11 17-15" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span>
        Axiom<span className="text-leaf-600">leaf</span>
      </span>
    </span>
  );
}

/* ───────────── Section wrapper ───────────── */
export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-14 sm:py-20", className)}>
      <div className="container-x">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start sm:flex-row sm:items-end sm:justify-between",
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <span className="badge mb-3">{eyebrow}</span>}
        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h2>
        {description && <p className="mt-3 text-base leading-7 text-ink/65">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/* ───────────── Page hero ───────────── */
export function PageHero({
  title,
  description,
  eyebrow,
  children,
}: {
  title: string;
  description: string;
  eyebrow?: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden border-b border-ink/5 bg-leaf-50/60">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="container-x relative py-14 sm:py-20">
        {eyebrow && <span className="badge mb-4">{eyebrow}</span>}
        <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-ink/70 sm:text-lg">{description}</p>
        {children}
      </div>
    </div>
  );
}

/* ───────────── Breadcrumbs ───────────── */
export function Breadcrumbs({ items }: { items: { name: string; path?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink/60">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {it.path ? (
              <Link to={it.path} className="hover:text-leaf-700">
                {it.name}
              </Link>
            ) : (
              <span className="font-medium text-ink">{it.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ───────────── FAQ accordion (native <details>) ───────────── */
export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white">
      {items.map((f) => (
        <details key={f.q} className="group px-5 py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
            {f.q}
            <span className="text-leaf-600 transition group-open:rotate-45" aria-hidden="true">
              +
            </span>
          </summary>
          <p className="mt-3 text-sm leading-6 text-ink/70">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/* ───────────── Ad slot placeholder ─────────────
   Replace the inner markup with your AdSense <ins> tag once approved.
   Kept as a component so every page has consistent, labelled slots. */
export function AdSlot({ className, label = "Advertisement" }: { className?: string; label?: string }) {
  return (
    <aside
      aria-label={label}
      className={cn(
        "my-8 flex min-h-24 items-center justify-center rounded-xl border border-dashed border-ink/15 bg-ink/[0.02] text-xs uppercase tracking-wider text-ink/40",
        className,
      )}
    >
      {label}
    </aside>
  );
}

/* ───────────── Empty / loading states ───────────── */
export function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-16 text-sm text-ink/60">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-leaf-200 border-t-leaf-600" />
      {label}
    </div>
  );
}

export function Callout({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warn" }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 text-sm leading-6",
        tone === "info" ? "border-leaf-200 bg-leaf-50 text-leaf-900" : "border-amber-200 bg-amber-50 text-amber-900",
      )}
    >
      {children}
    </div>
  );
}
