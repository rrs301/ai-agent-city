import type { Metadata } from "next";
import { AuthShell } from "../auth-shell";

export const metadata: Metadata = { title: "Sign up — Creator City" };

export default function SignUpPage() {
  return <AuthShell mode="sign-up" />;
}
