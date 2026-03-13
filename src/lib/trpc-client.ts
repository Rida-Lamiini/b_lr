"use client";

import React from "react";
import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { type AppRouter } from "@/server/trpc/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      retry: 1,
    },
  },
});

export const TRPCProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return React.createElement(QueryClientProvider, { client: queryClient }, children);
};