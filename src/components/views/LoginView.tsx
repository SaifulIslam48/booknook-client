"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useToast } from "../Toast";

function redirectTarget() {
  const next = new URLSearchParams(window.location.search).get("redirect");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export default function LoginView() {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await authClient.signIn.email({
      email: String(f.get("email")),
      password: String(f.get("password")),
    });
    setBusy(false);
    if (error) {
      toast.error(error.message || "Login failed. Check your email and password.");
      return;
    }
    toast.success("Welcome back to BookNook!");
    router.push(redirectTarget());
  }

  async function google() {
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: redirectTarget() });
    if (error) toast.error(error.message || "Google login failed. Please try again.");
  }

  return (
    <section className="fade mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-14">
      <div className="max-w-md mx-auto rounded-2xl bg-card border border-line p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1.5">
          <h1 className="heading text-3xl sm:text-4xl font-bold">Welcome Back</h1>
          <p className="text-sm text-muted">Sign in to borrow, add and manage your library books.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Email</label>
            <input name="email" type="email" required placeholder="reader@example.com" className="input w-full" />
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider">Password</label>
              <button
                type="button"
                onClick={() => toast.info("Password reset is not available yet.")}
                className="text-xs text-brand hover:underline"
              >
                Forget Password?
              </button>
            </div>
            <input name="password" type="password" required placeholder="Your password" className="input w-full" />
          </div>
          <button type="submit" disabled={busy} className="btn btn-primary w-full">
            {busy && <span className="loading loading-spinner loading-sm" />}
            Login
          </button>
        </form>

        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="flex-1 border-t border-line" />
          OR
          <span className="flex-1 border-t border-line" />
        </div>

        <button type="button" onClick={google} className="btn btn-outline border-line w-full">
          <b className="text-base">G</b> Continue with Google
        </button>

        <p className="text-center text-xs text-muted">
          New to BookNook?{" "}
          <Link href="/register" className="font-semibold text-brand hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </section>
  );
}
