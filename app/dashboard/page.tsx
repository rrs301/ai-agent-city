import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Dashboard — Creator City" };

// Intentionally empty for now: the route only requires a signed-in user.
export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return <main className="min-h-dvh" />;
}
