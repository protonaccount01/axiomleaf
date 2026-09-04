/**
 * SINGLE BLOG POST  (/blog/:id)
 * Content is fetched from Blogger and already sanitized by the service layer.
 */
import { Link, useParams } from "react-router-dom";
import { SEO, breadcrumbJsonLd } from "@/components/seo/SEO";
import { AdSlot, Breadcrumbs, Callout, Spinner } from "@/components/ui";
import { usePost, usePosts } from "@/hooks/usePosts";
import { PostCard } from "@/components/blog/PostCard";
import { formatDate, readingTime } from "@/services/blogger";
import { ToolCard } from "@/components/tools/ToolCard";
import { featuredTools } from "@/tools/registry";
import { SITE } from "@/config/site";

export default function BlogPost() {
  const { id } = useParams();
  const { data: post, loading, error, notConfigured } = usePost(id);
  const { data: more } = usePosts(4);

  if (loading) return <Spinner label="Loading article…" />;

  if (!post) {
    return (
      <div className="container-x py-20">
        <Callout tone="warn">
          {notConfigured ? "The blog is not configured yet." : error ?? "Article not found."}{" "}
          <Link to="/blog" className="font-semibold underline">
            Back to blog
          </Link>
        </Callout>
      </div>
    );
  }

  const path = `/blog/${post.id}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.published,
    dateModified: post.updated,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    mainEntityOfPage: `${SITE.url}${path}`,
  };

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        path={path}
        type="article"
        image={post.image}
        keywords={post.labels}
        jsonLd={[articleJsonLd, breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: post.title, path }])]}
      />

      <div className="border-b border-ink/5 bg-leaf-50/60">
        <div className="container-x max-w-4xl py-10 sm:py-14">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: post.title }]} />
          <div className="mt-4 flex flex-wrap gap-2">
            {post.labels.map((l) => (
              <span key={l} className="badge">
                {l}
              </span>
            ))}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-sm text-ink/60">
            By {post.author} · <time dateTime={post.published}>{formatDate(post.published)}</time> · {readingTime(post.content)} min read
            {post.updated !== post.published && <> · Updated {formatDate(post.updated)}</>}
          </p>
        </div>
      </div>

      <div className="container-x max-w-4xl py-10">
        {post.image && (
          <img src={post.image} alt="" className="mb-8 aspect-[16/9] w-full rounded-2xl object-cover" referrerPolicy="no-referrer" />
        )}
        <AdSlot className="!mt-0" />
        {/* Sanitized in services/blogger.ts via DOMPurify */}
        <article className="prose-ax" dangerouslySetInnerHTML={{ __html: post.content }} />
        <AdSlot />

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-leaf-50/50 p-6">
          <p className="text-sm text-ink/70">Enjoyed this article? Share it or explore more writing.</p>
          <div className="flex gap-2">
            <a
              href={`https://x.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(SITE.url + path)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost !py-2"
            >
              Share on X
            </a>
            <Link to="/blog" className="btn-primary !py-2">
              More articles
            </Link>
          </div>
        </div>

        {more && more.filter((p) => p.id !== post.id).length > 0 && (
          <section className="mt-14">
            <h2 className="mb-5 text-2xl font-bold text-ink">Keep reading</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {more.filter((p) => p.id !== post.id).slice(0, 3).map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-14">
          <h2 className="mb-5 text-2xl font-bold text-ink">Handy tools</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredTools().slice(0, 4).map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
