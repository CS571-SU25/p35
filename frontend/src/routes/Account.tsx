/* ──────────────────────────────────────────────────────────────
   Account.tsx  – user settings & saved‑build manager
   ────────────────────────────────────────────────────────────── */
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useBuildStore } from "@/stores/buildStore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Folder, MoonStar, LogOut, Github } from "lucide-react";

/* ───── local fallback for Separator (avoids missing-module error) ───── */
const Separator = () => (
  <hr className="my-4 border-t border-gray-700/60 dark:border-gray-600/40" />
);

/* ───── User info ───── */
interface UserInfo {
  id : string;
  email: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
  };
}

export default function Account() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const savedBuilds     = useBuildStore((s) => s.builds);
  const loadBuild       = useBuildStore((s) => s.loadBuild);

  /* fetch current user once */
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
        return;
      }
      setUser(data.user as UserInfo | null);
    })();
  }, []);

  /* sign‑out helper */
  async function handleSignOut() {
    await supabase.auth.signOut();
    toast("Signed out");
    location.href = "/"; // redirect
  }

  /* unauthenticated state ------------------------------------------------ */
  if (!user) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 p-8">
        <p className="text-lg">You’re not signed in.</p>
        <Button
          onClick={() =>
            supabase.auth.signInWithOAuth({ provider: "github" })
          }
        >
          Sign in / Sign up
        </Button>
      </div>
    );
  }

  /* authenticated state -------------------------------------------------- */
  const { avatar_url, full_name } = user.user_metadata || {};

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      {/* ───── Profile card ───── */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          {/* avatar */}
          {avatar_url ? (
            <img
              src={avatar_url}
              alt="avatar"
              className="h-16 w-16 rounded-full ring-2 ring-primary"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-700 text-xl uppercase">
              {(full_name ?? user.email)[0]}
            </div>
          )}

          {/* info */}
          <div className="flex-1">
            <p className="text-lg font-medium">
              {full_name ?? "Unnamed user"}
            </p>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>

          {/* sign‑out */}
          <Button variant="destructive" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </CardContent>
      </Card>

      {/* ───── Saved builds ───── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Saved builds
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {savedBuilds.length === 0 ? (
            <p className="text-sm text-gray-400">No builds saved yet.</p>
          ) : (
            savedBuilds.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{b.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(b.date).toLocaleDateString()}
                  </p>
                </div>
                <Button size="sm" onClick={() => loadBuild(b.id)}>
                  Load
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* ───── Preferences / links ───── */}
      <div className="flex flex-wrap gap-4">
        <Button variant="secondary" size="sm">
          <MoonStar className="mr-2 h-4 w-4" />
          Toggle theme
        </Button>

        <a
          href="https://github.com/yourrepo/pc-builder/discussions"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-1.5 text-sm hover:bg-gray-700"
        >
          <Github className="h-4 w-4" />
          Feedback / Issues
        </a>
      </div>
    </div>
  );
}
