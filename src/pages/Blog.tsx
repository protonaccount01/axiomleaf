/**
 * BLOG LISTING  (/blog)
 * Fetches posts from Blogger via usePosts(); shows a friendly setup notice
 * if the API isn't configured yet.
 */
import { SEO, breadcrumbJsonLd } from "@/components/seo/SEO";
import { AdSlot, Callout, PageHero, Section } from "@/components/ui";
import { PostCard, PostCardSkeleton } from "@/components/blog/PostCard";
import { usePosts } from "@/hooks/usePosts";
import { BLOGGER, SITE } from "@/config/site";

export default function Blog() {
  const { data: posts, loading, error, notConfigured, nextPageToken, loadMore } = usePosts(9);

  return (
    <>
      <SEO
        title="Blog – Articles on Technology, Productivity & the Web"
        description={`Read the ${SITE.name} blog: practical explainers on web development, online privacy, productivity and the tools we build.`}
        path="/blog"
        keywords={["axiomleaf blog", "technology articles", "web development blog", "productivity tips"]}
        jsonLd={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])}
      />

      <PageHero
        eyebrow="Axiomleaf Blog"
        title="Ideas, explainers and honest opinions"
        description="Long-form writing on technology, the open web, productivity and the thinking behind the tools we ship."
      />

      <Section className="!pt-10">
        {notConfigured && (
          <Callout tone="warn">
            <strong>Blog feed not configured.</strong> Add <code>VITE_BLOGGER_API_KEY</code> and{" "}
            <code>VITE_BLOGGER_BLOG_ID</code> to your environment variables and redeploy. See the README for step-by-step
            instructions.
            {BLOGGER.publicUrl && (
              <>
                {" "}
                Meanwhile you can{" "}
                <a href={BLOGGER.publicUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                  read the blog here
                </a>
                .
              </>
            )}
          </Callout>
        )}
        {error && !notConfigured && <Callout tone="warn">Could not load posts: {error}</Callout>}

        {loading && !posts && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        )}

        {posts && posts.length > 0 && (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
            {nextPageToken && (
              <div className="mt-10 text-center">
                <button type="button" className="btn-primary" onClick={loadMore} disabled={loading}>
                  {loading ? "Loading…" : "Load more articles"}
                </button>
              </div>
            )}
          </>
        )}

        {posts && posts.length === 0 && (
          <div className="card p-12 text-center text-ink/60">No articles published yet – check back soon.</div>
        )}

        <AdSlot />

        <div className="prose-ax mx-auto max-w-3xl">
          <h2>About the Axiomleaf blog</h2>
          <p>
            The blog is where we slow down and explain things properly. Where a tool page answers "how do I do X right
            now?", an article answers "why does X work that way, and what should I know before relying on it?". Topics
            include front-end development, hosting on free platforms such as Cloudflare Pages and GitHub Pages, search
            engine optimisation, digital privacy, and reviews of workflows and utilities we actually use.
          </p>
          <p>
            Posts are published through Google's Blogger platform and displayed here via its public API, which lets us
            keep the writing workflow simple while giving readers a fast, ad-light experience. Each article shows an
            estimated reading time and its publication date so you can judge freshness at a glance. Older technical
            articles are revisited and updated when the underlying tools change.
          </p>
          <p>
            If you have a topic you would like covered, or you spot an error, please reach out through the Contact page –
            reader feedback shapes the editorial calendar more than anything else.
          </p>
        </div>
      </Section>
    </>
  );
}
