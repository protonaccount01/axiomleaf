/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_BLOGGER_API_KEY?: string;
  readonly VITE_BLOGGER_BLOG_ID?: string;
  readonly VITE_BLOGGER_PUBLIC_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
