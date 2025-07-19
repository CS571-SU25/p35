import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren, ReactNode } from "react";

/** 👇  named export that the step loaders will import */
export const queryClient = new QueryClient();

/**
 * Wraps the whole app with shared providers (React-Query, etc.)
 * Usage in main.tsx:
 *    <AppProviders> … <RouterProvider /> … </AppProviders>
 */
export function AppProviders({
                               children,
                             }: PropsWithChildren<{ children?: ReactNode }>) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
