import "server-only";
import { cookies } from "next/headers";

/**
 * Server-only client for the CloudHike.dev Auth API.
 * The session token lives in an HTTP-only cookie set by this app's server.
 */

export const SESSION_COOKIE = "session";

export type AuthUser = { id: string; email: string; name: string };
export type Session = { user: AuthUser } | null;

export class AuthError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

function authUrl() {
  const url = process.env.AUTH_URL;
  if (!url) throw new AuthError("AUTH_URL is not configured", 500);
  return url.replace(/\/$/, "");
}

export function appUrl() {
  return process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${authUrl()}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.AUTH_PUBLISHABLE_KEY ?? "",
      ...init.headers,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new AuthError(body?.message ?? res.statusText ?? "Auth request failed", res.status);
  }
  return res.json() as Promise<T>;
}

export function signUpWithEmail(name: string, email: string, password: string) {
  return call<{ token: string; user: AuthUser }>("/sign-up/email", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function signInWithEmail(email: string, password: string) {
  return call<{ token: string; user: AuthUser }>("/sign-in/email", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/** Returns the session, or null when the token is missing or invalid. Throws on outages. */
export async function getSession(token: string | undefined): Promise<Session> {
  if (!token) return null;
  try {
    return await call<Session>("/get-session", {
      headers: { authorization: `Bearer ${token}` },
    });
  } catch (err) {
    if (err instanceof AuthError && err.status === 401) return null;
    throw err;
  }
}

/** The browser navigation target that starts Google sign-in. */
export function googleSignInUrl() {
  const returnTo = new URL("/auth/callback", appUrl()).toString();
  return `${authUrl()}/social/google?to=${encodeURIComponent(returnTo)}`;
}

// Cookie helpers: call only from Server Actions and Route Handlers.

export async function setSessionCookie(token: string) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getCurrentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = await getSession(token);
  return session?.user ?? null;
}
