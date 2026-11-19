import { appUrl, getSession, setSessionCookie } from "@/lib/auth";
import { saveUserToStrapi } from "@/lib/strapi-users";

/** Stores a Google sign-in token (read from the URL fragment by /auth/callback) in the session cookie. */
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(appUrl()).origin) {
    return Response.json({ message: "Bad origin" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";

  try {
    const session = await getSession(token);
    if (!session) return Response.json({ message: "Invalid token" }, { status: 401 });

    await setSessionCookie(token);
    // First Google sign-in creates the Strapi record; later ones are no-ops.
    await saveUserToStrapi(session.user, "google").catch((err) => console.error(err));
    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Auth is unavailable" }, { status: 503 });
  }
}
