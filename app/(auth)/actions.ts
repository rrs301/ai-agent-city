"use server";

import { redirect } from "next/navigation";
import { AuthError, setSessionCookie, signInWithEmail, signUpWithEmail } from "@/lib/auth";
import { saveUserToStrapi } from "@/lib/strapi-users";

export type FormState = { error: string; values?: Record<string, string> } | null;

const isEmail = (s: string) => /^\S+@\S+\.\S+$/.test(s);

export async function signUp(_prev: FormState, form: FormData): Promise<FormState> {
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const values = { name, email };

  if (!name) return { error: "Enter your name.", values };
  if (!isEmail(email)) return { error: "Enter a valid email address.", values };
  if (password.length < 8) return { error: "Use a password of at least 8 characters.", values };

  try {
    const { token, user } = await signUpWithEmail(name, email, password);
    try {
      await saveUserToStrapi({ ...user, name: user.name || name }, "email");
    } catch (err) {
      // The account exists in CloudHike already; don't block the user on the CMS.
      console.error(err);
    }
    // With "Require a verified email" on, sign-up returns no session token.
    if (!token) {
      return { error: "Account created. Check your inbox to verify your email, then sign in.", values };
    }
    await setSessionCookie(token);
  } catch (err) {
    if (err instanceof AuthError && err.status < 500) return { error: err.message, values };
    console.error(err);
    return { error: "Sign-up is unavailable right now. Please try again.", values };
  }
  redirect("/dashboard");
}

export async function signIn(_prev: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const values = { email };

  if (!isEmail(email) || !password) return { error: "Enter your email and password.", values };

  try {
    const { token } = await signInWithEmail(email, password);
    await setSessionCookie(token);
  } catch (err) {
    if (err instanceof AuthError && err.status === 403) {
      return { error: "Please verify your email first. Check your inbox for the link.", values };
    }
    if (err instanceof AuthError && err.status < 500) return { error: "Wrong email or password.", values };
    console.error(err);
    return { error: "Sign-in is unavailable right now. Please try again.", values };
  }
  redirect("/dashboard");
}
