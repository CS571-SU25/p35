import { Outlet } from "react-router-dom";
import Navbar from "@/components/common/Navbar";

/** Root layout – renders the sticky top‑nav and an <Outlet /> */
export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-off-black text-white">
      <header>
        <Navbar />          {/* the bar we built earlier */}
      </header>

      <main className="flex-1 overflow-y-auto">
        <Outlet />          {/* BuilderLayout, Landing … */}
      </main>
    </div>
  );
}
