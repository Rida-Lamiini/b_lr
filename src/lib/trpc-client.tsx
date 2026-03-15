"use client";

import React, { useState } from "react";
import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { type AppRouter } from "@/server/trpc/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * tRPC React hooks for the application.
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * Base URL helper for tRPC requests.
 */
const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

/**
 * tRPC and Query Client provider.
 * 
 * Recreates the QueryClient and trpcClient per-session to avoid 
 * sharing state across different users/requests in a server-side context, 
 * improving security and reliability.
 */
export const TRPCProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // 30 seconds
            retry: 1,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          // Add custom headers here if needed, e.g. for authentication
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
};