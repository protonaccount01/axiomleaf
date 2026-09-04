import { Link } from "react-router-dom";
import { formatDate, readingTime, type BlogPost } from "@/services/blogger";

/** Card used on the Blog listing and Home page previews. */
export function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-glow">
      <Link to={`/blog/${post.id}`} className="block aspect-[16/9] overflow-hidden bg-leaf-50">
        {post.image ? (
          <img
            src={post.image}
            alt=""
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-leaf-100 to-leaf-50 text-5xl">🍃</div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink/55">
          <time dateTime={post.published}>{formatDate(post.published)}</time>
          <span aria-hidden="true">·</span>
          <span>{readingTime(post.content)} min read</span>
          {post.labels[0] && <span className="badge ml-auto">{post.labels[0]}</span>}
        </div>
        <h3 className="mt-2 text-lg font-bold leading-snug text-ink">
          <Link to={`/blog/${post.id}`} className="hover:text-leaf-700">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink/65">{post.excerpt}</p>
        <Link to={`/blog/${post.id}`} className="mt-4 text-sm font-semibold text-leaf-700 hover:underline">
          Read article →
        </Link>
      </div>
    </article>
  );
}

/** Skeleton shown while posts load. */
export function PostCardSkeleton() {
  return (
    <div className="card animate-pulse overflow-hidden">
      <div className="aspect-[16/9] bg-ink/5" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/3 rounded bg-ink/10" />
        <div className="h-5 w-3/4 rounded bg-ink/10" />
        <div className="h-3 w-full rounded bg-ink/5" />
        <div className="h-3 w-5/6 rounded bg-ink/5" />
      </div>
    </div>
  );
}
