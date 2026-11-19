import type { Metadata } from "next";
import { AuthShell } from "../auth-shell";

export const metadata: Metadata = { title: "Sign in — Creator City" };

export default function SignInPage() {
  return <AuthShell mode="sign-in" />;
}
