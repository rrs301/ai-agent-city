# Authentication

Sign-in and sign-up use the [CloudHike.dev Auth API](https://cloudhike.dev/docs/md/auth). New users are also saved to the Strapi CMS **Users** collection type (`plugin::users-permissions.user`).

## Routes

| Route | Purpose |
| --- | --- |
| `/sign-in` | Email/password sign-in and "Continue with Google" |
| `/sign-up` | Email/password sign-up (name, email, password) and "Continue with Google" |
| `/auth/callback` | Google return page. Reads `#token=…` from the URL fragment and posts it to the session route |
| `POST /api/auth/session` | Checks a Google token with `get-session`, sets the cookie and saves the user to Strapi. Rejects other origins |
| `/dashboard` | Empty page for signed-in users. Visitors without a session are redirected to `/sign-in` |

## How it works

- `lib/auth.ts` (server-only) calls CloudHike Auth with `AUTH_PUBLISHABLE_KEY`. The returned token is stored in an HTTP-only `session` cookie that this app sets. Page scripts never see it.
- `app/(auth)/actions.ts` contains the Server Actions for the email forms. Both redirect to `/dashboard` on success.
- `proxy.ts` makes a quick check for the cookie on `/dashboard`. `app/dashboard/page.tsx` then verifies the session with CloudHike.
- `lib/strapi-users.ts` saves the user through Strapi's `POST /api/auth/local/register`, so no Strapi API token is needed. CloudHike keeps the real credentials. Strapi gets the name as `username`, the email, and a random unused password. The call is idempotent: if the email already exists, nothing changes. Strapi errors are logged and do not block sign-in.

## Environment

Set these in `.env.local`. `.env.example` lists them without values.

| Variable | Use |
| --- | --- |
| `AUTH_URL`, `AUTH_PUBLISHABLE_KEY` | CloudHike Auth API (server-side here) |
| `AUTH_SECRET_KEY` | CloudHike admin endpoints. Server only and currently unused |
| `APP_URL` | This app's origin. Used for the Google return link and the session route's origin check |
| `STRAPI_URL` | Strapi base URL, default `http://localhost:1337` |

## Setup

- **CloudHike dashboard:** On the Auth card, turn on Google under **Sign in with GitHub or Google**. Then add every origin the app runs on (for example `http://localhost:3000`) under **Sites users can return to**. Until you do, the Google link returns "This site is not allowed to sign users in."
- **Strapi:** Keep public registration on (Settings → Users & Permissions → Advanced settings → *Enable sign-ups*). If you also turn on email confirmation there, Strapi will try to send confirmation emails for these records.
