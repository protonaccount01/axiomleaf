/**
 * ─────────────────────────────────────────────────────────────
 *  BLOGGER API v3 SERVICE
 *  Docs: https://developers.google.com/blogger/docs/3.0/reference
 *
 *  Reads posts from a public Blogger blog using an API key.
 *  Configure via environment variables (see .env.example):
 *     VITE_BLOGGER_API_KEY   – Google Cloud API key (restrict by referrer!)
 *     VITE_BLOGGER_BLOG_ID   – numeric blog id (Blogger → Settings)
 *
 *  All HTML from Blogger is sanitized with DOMPurify before render.
 * ─────────────────────────────────────────────────────────────
 */
import DOMPurify from "dompurify";
import { BLOGGER } from "@/config/site";

export interface BlogPost {
  id: string;
  title: string;
  /** Sanitized HTML */
  content: string;
  /** Plain-text excerpt (~160 chars) */
  excerpt: string;
  published: string;
  updated: string;
  url: string;
  labels: string[];
  author: string;
  image?: string;
}

export interface PostList {
  posts: BlogPost[];
  nextPageToken?: string;
}

const API = "https://www.googleapis.com/blogger/v3/blogs";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in-memory cache
const cache = new Map<string, { at: number; data: unknown }>();

interface RawPost {
  id: string;
  title: string;
  content?: string;
  published: string;
  updated: string;
  url: string;
  labels?: string[];
  author?: { displayName?: string };
  images?: { url: string }[];
}

function stripHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent ?? "").replace(/\s+/g, " ").trim();
}

function firstImage(html: string): string | undefined {
  const m = /<img[^>]+src="([^"]+)"/i.exec(html);
  return m?.[1];
}

function normalise(p: RawPost): BlogPost {
  const raw = p.content ?? "";
  const text = stripHtml(raw);
  return {
    id: p.id,
    title: p.title,
    content: DOMPurify.sanitize(raw, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ["target", "rel", "loading"],
      FORBID_TAGS: ["style", "iframe", "form", "input"],
    }),
    excerpt: text.length > 160 ? text.slice(0, 157).trimEnd() + "…" : text,
    published: p.published,
    updated: p.updated,
    url: p.url,
    labels: p.labels ?? [],
    author: p.author?.displayName ?? "Axiomleaf",
    image: p.images?.[0]?.url ?? firstImage(raw),
  };
}

async function get<T>(url: string): Promise<T> {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.at < CACHE_TTL) return hit.data as T;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    const msg = res.status === 403 ? "Blogger API key rejected (check referrer restrictions)." : `Blogger API error ${res.status}`;
    throw new Error(msg);
  }
  const data = (await res.json()) as T;
  cache.set(url, { at: Date.now(), data });
  return data;
}

export class BloggerNotConfigured extends Error {
  constructor() {
    super("Blogger API is not configured. Set VITE_BLOGGER_API_KEY and VITE_BLOGGER_BLOG_ID.");
  }
}

export async function fetchPosts(opts: { maxResults?: number; pageToken?: string; label?: string } = {}): Promise<PostList> {
  if (!BLOGGER.isConfigured) throw new BloggerNotConfigured();
  const params = new URLSearchParams({
    key: BLOGGER.apiKey,
    maxResults: String(opts.maxResults ?? 9),
    fetchImages: "true",
    fetchBodies: "true",
    status: "live",
  });
  if (opts.pageToken) params.set("pageToken", opts.pageToken);
  if (opts.label) params.set("labels", opts.label);
  const data = await get<{ items?: RawPost[]; nextPageToken?: string }>(`${API}/${BLOGGER.blogId}/posts?${params}`);
  return { posts: (data.items ?? []).map(normalise), nextPageToken: data.nextPageToken };
}

export async function fetchPost(id: string): Promise<BlogPost> {
  if (!BLOGGER.isConfigured) throw new BloggerNotConfigured();
  if (!/^\d+$/.test(id)) throw new Error("Invalid post id");
  const params = new URLSearchParams({ key: BLOGGER.apiKey, fetchImages: "true" });
  const data = await get<RawPost>(`${API}/${BLOGGER.blogId}/posts/${id}?${params}`);
  return normalise(data);
}

export async function searchPosts(q: string): Promise<BlogPost[]> {
  if (!BLOGGER.isConfigured) throw new BloggerNotConfigured();
  const params = new URLSearchParams({ key: BLOGGER.apiKey, q, fetchBodies: "true" });
  const data = await get<{ items?: RawPost[] }>(`${API}/${BLOGGER.blogId}/posts/search?${params}`);
  return (data.items ?? []).map(normalise);
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export const readingTime = (html: string) => Math.max(1, Math.ceil(stripHtml(html).split(/\s+/).length / 200));
