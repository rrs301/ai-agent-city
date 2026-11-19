"use client";

import { useActionState, useId } from "react";
import { LoaderCircle } from "lucide-react";
import { signIn, signUp, type FormState } from "./actions";

type Mode = "sign-in" | "sign-up";

const inputClass =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-[15px] text-foreground " +
  "placeholder:text-foreground/40 outline-none transition focus-visible:border-primary " +
  "focus-visible:ring-3 focus-visible:ring-primary/25";

export function AuthForm({ mode }: { mode: Mode }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    mode === "sign-up" ? signUp : signIn,
    null,
  );
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <form action={action} className="grid gap-4" aria-describedby={state?.error ? errorId : undefined} noValidate>
      {mode === "sign-up" && (
        <Field label="Name" htmlFor={`${id}-name`}>
          <input id={`${id}-name`} name="name" type="text" autoComplete="name" required
            defaultValue={state?.values?.name} placeholder="Ada Lovelace" className={inputClass} />
        </Field>
      )}
      <Field label="Email" htmlFor={`${id}-email`}>
        <input id={`${id}-email`} name="email" type="email" autoComplete="email" required
          defaultValue={state?.values?.email} placeholder="you@example.com" className={inputClass} />
      </Field>
      <Field label="Password" htmlFor={`${id}-password`}
        hint={mode === "sign-up" ? "At least 8 characters." : undefined}>
        <input id={`${id}-password`} name="password" type="password" required
          minLength={mode === "sign-up" ? 8 : undefined}
          autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
          className={inputClass} />
      </Field>

      {state?.error && (
        <p id={errorId} role="alert"
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending}
        className="mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-[15px]
          font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-70
          focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40">
        {pending && <LoaderCircle aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />}
        {mode === "sign-up"
          ? pending ? "Creating account…" : "Create account"
          : pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

function Field({ label, htmlFor, hint, children }: {
  label: string; htmlFor: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {hint && <p className="text-xs text-foreground/55">{hint}</p>}
    </div>
  );
}
