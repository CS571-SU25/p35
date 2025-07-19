console.log("main.tsx executing");

import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { AppProviders } from "@/providers/AppProviders";
import { builderRoutes } from "@/features/builder";   // ✅ correct import
import Landing from "@/routes/Landing";
import { Toaster } from "sonner";
import "@/index.css";

/* router */
const router = createBrowserRouter(
  [
    { path: "/", element: <Navigate to="builder" replace /> },
    builderRoutes,
    { path: "/landing", element: <Landing /> },
  ],
  {
    basename: import.meta.env.BASE_URL || "/p35/",   // keeps /p35/ base path happy
  },
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
      <Toaster richColors />
    </AppProviders>
  </React.StrictMode>,
);
