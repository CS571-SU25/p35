// src/bootstrap.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { AppProviders } from "@/providers/AppProviders";
import AppLayout from "@/routes/AppLayout";
import { builderRoutes } from "@/features/builder";
import Account from "@/routes/Account";
import { Toaster } from "sonner";
import "@/index.css";
import { initTheme } from "@/lib/theme";

export function bootstrap() {
  initTheme();

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          // NO redirect from "/" anymore (because "/" never reaches here now)
          builderRoutes,
          { path: "account/*", element: <Account /> },
          { path: "*", element: <Navigate to="/builder" replace /> },
        ],
      },
    ],
    { basename: import.meta.env.BASE_URL || "/" },
  );

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <AppProviders>
        <RouterProvider router={router} />
        <Toaster richColors />
      </AppProviders>
    </React.StrictMode>
  );
}
