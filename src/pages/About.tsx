import { Link } from "react-router-dom";
import { SEO, breadcrumbJsonLd, organizationJsonLd } from "@/components/seo/SEO";
import { AdSlot, PageHero, Section } from "@/components/ui";
import { SITE } from "@/config/site";
import { TOOLS } from "@/tools/registry";

const VALUES = [
  { title: "Privacy is the default", text: "We design every feature so that it works without collecting data. If a tool would require uploading your file to work, we build it differently or not at all." },
  { title: "Speed is a feature", text: "The whole site is a single lightweight bundle with no third-party fonts, trackers or heavy frameworks. It should feel instant on a mid-range phone." },
  { title: "Explain, don't just execute", text: "Every tool page includes a plain-English guide and FAQ. Understanding why something works makes you better at using it." },
  { title: "Open and honest", text: "The site is funded by clearly labelled advertising. We never sell data, hide affiliate links or nag you to sign up." },
];

export default function About() {
  return (
    <>
      <SEO
        title="About Axiomleaf"
        description={`Learn who is behind ${SITE.name}, why we build privacy-first browser tools, and the principles that guide the project.`}
        path="/about"
        keywords={["about axiomleaf", "free tools website", "privacy first tools"]}
        jsonLd={[organizationJsonLd(), breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])]}
      />
      <PageHero eyebrow="About" title="Small tools, honestly made" description="Axiomleaf is an independent project building useful browser utilities and writing about technology without the noise." />

      <Section className="!pt-10">
        <div className="prose-ax mx-auto max-w-3xl">
          <h2 className="!mt-0">Our story</h2>
          <p>
            Axiomleaf began with a familiar frustration. Searching for something as simple as "word counter" or "JSON
            formatter" returns pages weighed down by pop-ups, auto-playing videos and dozens of trackers – often for a
            task that takes twelve lines of JavaScript. We wanted a place where the tool loads instantly, does its job,
            respects the person using it and, ideally, teaches them something along the way.
          </p>
          <p>
            Today the site hosts {TOOLS.length} tools across text processing, development, conversion, generation,
            calculation and general utilities, alongside a blog that digs into the how and why of the web. Everything is
            built with modern, open-source technology – React, TypeScript, Vite and Tailwind CSS – and deployed on edge
            infrastructure so it is fast everywhere in the world.
          </p>

          <h2>What the name means</h2>
          <p>
            An <strong>axiom</strong> is a statement so evidently true that it needs no proof. A <strong>leaf</strong> is
            the smallest productive part of a plant – simple on its own, powerful in numbers. Axiomleaf is our attempt to
            build a growing collection of small, obviously useful things.
          </p>

          <h2>How the site is funded</h2>
          <p>
            Axiomleaf is free to use and always will be. Running costs are covered by unobtrusive display advertising.
            Ads are clearly labelled, never disguised as content and never interfere with using a tool. We do not sell
            or share visitor data – there is none to sell.
          </p>
        </div>

        <AdSlot />

        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold text-ink">What we believe</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {VALUES.map((v) => (
              <div key={v.title} className="card p-6">
                <h3 className="font-semibold text-ink">{v.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/65">{v.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="prose-ax mx-auto mt-12 max-w-3xl">
          <h2>Technology and security</h2>
          <p>
            The site is a statically generated single-page application. There is no backend server, no database and no
            login system – which removes entire categories of security risk. Content is delivered over HTTPS through
            Cloudflare with a strict Content Security Policy, HSTS and other hardening headers. Blog content fetched
            from the Blogger API is sanitised before it is rendered. All dependencies are open source and pinned.
          </p>
          <h2>Get in touch</h2>
          <p>
            Suggestions, corrections and partnership enquiries are all welcome. Head over to the{" "}
            <Link to="/contact">Contact page</Link> – we read every message.
          </p>
        </div>
      </Section>
    </>
  );
}
