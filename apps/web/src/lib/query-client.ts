import { QueryClient } from "@tanstack/react-query";

/**
 * Creates a TanStack Query client with sensible defaults.
 *
 * Called once per client-side mount to avoid sharing state
 * between requests in SSR contexts.
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Don't refetch on window focus in development
        refetchOnWindowFocus: process.env["NODE_ENV"] === "production",

        // Stale time: 1 minute (data considered fresh)
        staleTime: 60 * 1000,

        // Retry failed requests up to 2 times
        retry: 2,

        // Don't retry on 4xx errors
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

// Browser-side singleton to prevent re-creating the client
let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // Server: always create a new client
    return makeQueryClient();
  }

  // Browser: reuse singleton
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
