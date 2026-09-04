/**
 * APP ROOT – mounts the router. Everything else lives in:
 *   src/router.tsx          → route table
 *   src/components/layout   → header / footer / page shell
 *   src/pages               → one file per page
 *   src/tools               → tool components + registry
 *   src/services            → external APIs (Blogger)
 */
import { RouterProvider } from "react-router-dom";
import { router } from "@/router";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
