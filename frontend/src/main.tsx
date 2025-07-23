// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import { AppProviders } from "@/providers/AppProviders";
import AppLayout from "@/routes/AppLayout";
import Landing from "@/routes/Landing";
import { builderRoutes } from "@/features/builder";
import Account from "@/routes/Account";
import { Toaster } from "sonner";
import "@/index.css";
import { initTheme } from "@/lib/theme";

initTheme();

const router = createBrowserRouter(
  [
    // Landing is stand-alone (not wrapped by AppLayout)
    { path: "/", element: <Landing /> },

    // Builder app under AppLayout
    {
      path: "/",
      element: <AppLayout />,
      children: [
        builderRoutes, // /builder/*
        { path: "account/*", element: <Account /> },
      ],
    },

    { path: "*", element: <Navigate to="/" replace /> },
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
