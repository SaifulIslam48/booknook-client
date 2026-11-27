import { authClient } from "@/lib/auth-client";
import type { Metadata } from "next";
import LoginView from "@/components/views/LoginView";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return <LoginView />;
}

authClient.signIn.social({
  provider: "google",
  callbackURL: "/",
});