import type { ReactNode } from "react";
import { SEO, breadcrumbJsonLd } from "@/components/seo/SEO";
import { Breadcrumbs } from "@/components/ui";

/** Shared shell for Privacy / Terms / Disclaimer pages. */
export function LegalLayout({
  title,
  description,
  path,
  updated,
  children,
}: {
  title: string;
  description: string;
  path: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <SEO title={title} description={description} path={path} jsonLd={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: title, path }])} />
      <div className="border-b border-ink/5 bg-leaf-50/60">
        <div className="container-x max-w-3xl py-12">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: title }]} />
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-ink/55">Last updated: {updated}</p>
        </div>
      </div>
      <div className="container-x max-w-3xl py-10">
        <article className="prose-ax">{children}</article>
      </div>
    </>
  );
}
