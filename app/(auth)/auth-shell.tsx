import Link from "next/link";
import { Building2 } from "lucide-react";
import { googleSignInUrl } from "@/lib/auth";
import { AuthForm } from "./auth-form";

const copy = {
  "sign-in": {
    title: "Welcome back",
    subtitle: "Sign in to your Creator City workspace.",
    switchText: "New to Creator City?",
    switchLink: { href: "/sign-up", label: "Create an account" },
  },
  "sign-up": {
    title: "Create your account",
    subtitle: "Start building your team of AI content agents.",
    switchText: "Already have an account?",
    switchLink: { href: "/sign-in", label: "Sign in" },
  },
} as const;

export function AuthShell({ mode }: { mode: "sign-in" | "sign-up" }) {
  const c = copy[mode];

  return (
    <main className="grid min-h-dvh place-items-center bg-[#f7f8fa] px-4 py-10 dark:bg-background">
      <div className="w-full max-w-[400px]">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 text-foreground">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Building2 aria-hidden className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Creator City</span>
        </Link>

        <section className="rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{c.title}</h1>
          <p className="mt-1 text-sm text-foreground/60">{c.subtitle}</p>

          <a href={googleSignInUrl()}
            className="mt-6 flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-input
              bg-background text-[15px] font-medium text-foreground transition hover:bg-secondary
              focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30">
            <GoogleIcon />
            Continue with Google
          </a>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-foreground/45">
            <span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" />
          </div>

          <AuthForm mode={mode} />
        </section>

        <p className="mt-6 text-center text-sm text-foreground/60">
          {c.switchText}{" "}
          <Link href={c.switchLink.href} className="font-medium text-primary underline-offset-4 hover:underline">
            {c.switchLink.label}
          </Link>
        </p>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-[18px]">
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.88-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.11A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.28 14.29a7.2 7.2 0 0 1 0-4.58V6.6H1.27a12 12 0 0 0 0 10.8l4.01-3.11Z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.27 6.6l4.01 3.11C6.22 6.88 8.87 4.77 12 4.77Z" />
    </svg>
  );
}
