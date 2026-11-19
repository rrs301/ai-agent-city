"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/** Google returns here with `#token=…` (or `#error=…`); the fragment never reaches a server. */
export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const params = new URLSearchParams(window.location.hash.slice(1));
    const token = params.get("token");
    const failed = params.get("error");
    window.history.replaceState(null, "", window.location.pathname);

    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the URL fragment
      setError(failed ? "Google sign-in was not completed." : "No sign-in token was found.");
      return;
    }

    fetch("/api/auth/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        router.replace("/dashboard");
        router.refresh();
      })
      .catch(() => setError("Could not finish signing in. Please try again."));
  }, [router]);

  return (
    <main className="grid min-h-dvh place-items-center bg-[#f7f8fa] px-4 text-center dark:bg-background">
      {error ? (
        <p role="alert" className="text-foreground">
          {error}{" "}
          <Link href="/sign-in" className="font-medium text-primary underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </p>
      ) : (
        <p aria-live="polite" className="text-foreground/70">Signing you in…</p>
      )}
    </main>
  );
}
