/**
 * ROUTE TABLE – add new pages here.
 * Pages are lazy-loaded so the initial bundle stays small.
 */
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

const Home = lazy(() => import("@/pages/Home"));
const Tools = lazy(() => import("@/pages/Tools"));
const ToolPage = lazy(() => import("@/pages/ToolPage"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const PrivacyPolicy = lazy(() => import("@/pages/legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/legal/TermsOfService"));
const Disclaimer = lazy(() => import("@/pages/legal/Disclaimer"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "tools", element: <Tools /> },
      { path: "tools/:slug", element: <ToolPage /> },
      { path: "blog", element: <Blog /> },
      { path: "blog/:id", element: <BlogPost /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "terms-of-service", element: <TermsOfService /> },
      { path: "disclaimer", element: <Disclaimer /> },
      { path: "404", element: <NotFound /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
