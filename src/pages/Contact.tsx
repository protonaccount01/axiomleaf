/**
 * CONTACT PAGE  (/contact)
 * There is no backend, so the form composes a mailto: link. To use a form
 * service instead (Formspree, Web3Forms, Cloudflare Worker) swap `onSubmit`.
 */
import { useState, type FormEvent } from "react";
import { SEO, breadcrumbJsonLd } from "@/components/seo/SEO";
import { AdSlot, FAQ, PageHero, Section } from "@/components/ui";
import { Field, Input, TextArea } from "@/tools/shared/ToolUI";
import { SITE } from "@/config/site";

const CONTACT_FAQ = [
  { q: "How quickly will I get a reply?", a: "We aim to respond to every message within 2–3 business days." },
  { q: "Can I suggest a new tool?", a: "Please do! Describe what it should do and how you would use it – reader requests drive our roadmap." },
  { q: "Do you accept guest posts or sponsored content?", a: "We occasionally accept high-quality guest articles. Sponsored placements are clearly labelled. Email us with your proposal." },
  { q: "I found a bug. What should I include?", a: "The tool name, your browser and device, what you entered, and what you expected to happen. Screenshots help enormously." },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const body = `Name: ${form.name}\n\n${form.message}`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(form.subject || "Hello from Axiomleaf")}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <>
      <SEO
        title="Contact Us"
        description={`Get in touch with the ${SITE.name} team – suggest a tool, report a bug, ask a question or discuss a partnership.`}
        path="/contact"
        keywords={["contact axiomleaf", "suggest a tool", "report a bug"]}
        jsonLd={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])}
      />
      <PageHero eyebrow="Contact" title="We'd love to hear from you" description="Ideas for new tools, bug reports, corrections, partnership enquiries – every message is read by a human." />

      <Section className="!pt-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <form onSubmit={onSubmit} className="card space-y-5 p-6 sm:p-8" aria-label="Contact form">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your name">
                <Input required maxLength={80} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
              </Field>
              <Field label="Subject">
                <Input required maxLength={120} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Tool suggestion, bug report…" />
              </Field>
            </div>
            <Field label="Message">
              <TextArea value={form.message} onChange={(v) => setForm({ ...form, message: v })} rows={8} className="!font-sans !text-[15px]" placeholder="Tell us what's on your mind…" />
            </Field>
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" className="btn-primary" disabled={!form.message.trim()}>
                Send via email
              </button>
              <p className="text-xs text-ink/50">This opens your email app with the message pre-filled. We never store form data.</p>
            </div>
            {sent && <p className="rounded-lg bg-leaf-50 px-4 py-3 text-sm text-leaf-800">Thanks! If your email client didn't open, write to us directly at {SITE.email}.</p>}
          </form>

          <aside className="space-y-6">
            <div className="card p-6">
              <h2 className="font-semibold text-ink">Direct email</h2>
              <a href={`mailto:${SITE.email}`} className="mt-2 block break-all font-mono text-sm text-leaf-700 hover:underline">
                {SITE.email}
              </a>
            </div>
            <div className="card p-6">
              <h2 className="font-semibold text-ink">Elsewhere</h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a href={SITE.social.github} target="_blank" rel="noopener noreferrer" className="text-ink/75 hover:text-leaf-700">GitHub →</a>
                </li>
                <li>
                  <a href={SITE.social.twitter} target="_blank" rel="noopener noreferrer" className="text-ink/75 hover:text-leaf-700">X / Twitter →</a>
                </li>
              </ul>
            </div>
            <AdSlot className="!my-0 min-h-64" />
          </aside>
        </div>

        <div className="prose-ax mx-auto mt-14 max-w-3xl">
          <h2>Before you write</h2>
          <p>
            For the fastest help, check the FAQ section at the bottom of each tool page – most common questions are
            answered there. If you are reporting a bug, please include the name of the tool, the browser and device you
            were using, what you entered and what you expected to happen. Reproducible reports are usually fixed within
            days.
          </p>
          <p>
            We welcome suggestions for new tools and article topics. The best requests describe a real task you are
            trying to accomplish rather than a feature in the abstract; that context helps us design something that
            actually solves the problem.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <h2 className="mb-4 text-2xl font-bold text-ink">Frequently asked questions</h2>
          <FAQ items={CONTACT_FAQ} />
        </div>
      </Section>
    </>
  );
}
