import { authClient } from "@/lib/auth-client";
import type { Metadata } from "next";
import RegisterView from "@/components/views/RegisterView";

export const metadata: Metadata = { title: "Register" };

export default function RegisterPage() {
  return <RegisterView />;
}

authClient.signIn.social({
  provider: "google",
  callbackURL: "/",
});
