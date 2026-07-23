"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/toaster";
import { getQueryClient } from "@/lib/query-client";

/**
 * Client-side provider composition.
 *
 * All client-side context providers (auth, theme, query, etc.)
 * should be composed here and wrapped around the app in layout.tsx.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
      {process.env["NODE_ENV"] === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
