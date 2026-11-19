import "server-only";
import { randomBytes } from "node:crypto";
import type { AuthUser } from "@/lib/auth";

/**
 * Saves an app user to Strapi's built-in Users collection
 * (plugin::users-permissions.user).
 *
 * CloudHike owns credentials; Strapi keeps the profile record. Strapi's register
 * route requires a password, so a random one is stored that nobody knows.
 * The call is idempotent: an email already in Strapi is left as it is.
 */
export async function saveUserToStrapi(user: AuthUser, provider: "email" | "google") {
  const base = (process.env.STRAPI_URL ?? "http://localhost:1337").replace(/\/$/, "");
  const name = (user.name || user.email.split("@")[0]).trim();
  const usernames = [name.length >= 3 ? name : `${name}-user`, `${name}-${user.id.slice(-6)}`];

  for (const username of usernames) {
    const res = await fetch(`${base}/api/auth/local/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        username,
        email: user.email,
        password: randomBytes(24).toString("base64url"),
      }),
      cache: "no-store",
    });
    if (res.ok) return;

    const body = await res.json().catch(() => null);
    const message: string = body?.error?.message ?? res.statusText;
    // "Email or Username are already taken": retry once with a unique username,
    // and treat a second conflict as the email already being saved.
    if (res.status === 400 && /already taken/i.test(message)) continue;
    throw new Error(`Strapi user save failed (${res.status}, ${provider}): ${message}`);
  }
}
