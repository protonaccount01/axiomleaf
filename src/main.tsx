import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

/**
 * GitHub Pages SPA fallback: public/404.html stores the originally requested
 * path in sessionStorage and redirects to "/". Restore it before the router
 * mounts so deep links (e.g. /tools/word-counter) work.
 * Cloudflare Pages uses public/_redirects instead and never hits this branch.
 */
const redirect = sessionStorage.getItem("ax:redirect");
if (redirect && redirect !== location.pathname) {
  sessionStorage.removeItem("ax:redirect");
  history.replaceState(null, "", redirect);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
