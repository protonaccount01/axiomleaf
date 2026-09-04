/**
 * React hook wrapping the Blogger service with loading / error state.
 * Used by Home (preview), Blog (list) and BlogPost (single).
 */
import { useEffect, useState } from "react";
import { BloggerNotConfigured, fetchPost, fetchPosts, type BlogPost } from "@/services/blogger";

interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  notConfigured: boolean;
}

export function usePosts(maxResults = 9, label?: string) {
  const [state, setState] = useState<State<BlogPost[]> & { nextPageToken?: string }>({
    data: null,
    loading: true,
    error: null,
    notConfigured: false,
  });
  const [pageToken, setPageToken] = useState<string | undefined>();

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchPosts({ maxResults, pageToken, label })
      .then((r) => {
        if (!alive) return;
        setState((s) => ({
          data: pageToken ? [...(s.data ?? []), ...r.posts] : r.posts,
          loading: false,
          error: null,
          notConfigured: false,
          nextPageToken: r.nextPageToken,
        }));
      })
      .catch((e: Error) => {
        if (!alive) return;
        setState({ data: null, loading: false, error: e.message, notConfigured: e instanceof BloggerNotConfigured });
      });
    return () => {
      alive = false;
    };
  }, [maxResults, pageToken, label]);

  return { ...state, loadMore: () => state.nextPageToken && setPageToken(state.nextPageToken) };
}

export function usePost(id: string | undefined) {
  const [state, setState] = useState<State<BlogPost>>({ data: null, loading: true, error: null, notConfigured: false });
  useEffect(() => {
    if (!id) return;
    let alive = true;
    setState({ data: null, loading: true, error: null, notConfigured: false });
    fetchPost(id)
      .then((p) => alive && setState({ data: p, loading: false, error: null, notConfigured: false }))
      .catch((e: Error) => alive && setState({ data: null, loading: false, error: e.message, notConfigured: e instanceof BloggerNotConfigured }));
    return () => {
      alive = false;
    };
  }, [id]);
  return state;
}
