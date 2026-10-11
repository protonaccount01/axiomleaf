import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Replaces __SITE_URL__ in index.html with VITE_SITE_URL (set it in the
 * Cloudflare dashboard / .env) so canonical + Open Graph URLs always match
 * the live domain. Falls back to the default below.
 */
function siteUrlPlugin(siteUrl: string): Plugin {
  return {
    name: "site-url-html",
    transformIndexHtml(html) {
      return html.replaceAll("__SITE_URL__", siteUrl);
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "VITE_");
  const siteUrl = (env.VITE_SITE_URL || "https://axiomleaf.pages.dev").replace(/\/$/, "");

  return {
    plugins: [react(), tailwindcss(), viteSingleFile(), siteUrlPlugin(siteUrl)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
