import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import type { PropsWithChildren, ReactNode } from "react";
import CompatibilityWatcher from "@/features/builder/components/CompatibilityWatcher";

export const queryClient = new QueryClient();

/* -------------------------------------------------------------------------- */
export function AppProviders({
                               children,
                             }: PropsWithChildren<{ children?: ReactNode }>) {
  return (
    <QueryClientProvider client={queryClient}>
      <CompatibilityWatcher />
      {children}

      {/* Global toaster */}
      <Toaster
        position="bottom-right"
        richColors
        toastOptions={{
          className:
            "rounded-xl border border-gray-700/60 bg-gray-900/95 " +
            "px-4 py-3 shadow-xl shadow-black/40 text-gray-100 " +
            "w-[320px] text-base",
        }}
      />
    </QueryClientProvider>
  );
}
