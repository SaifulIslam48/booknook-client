"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useToast } from "../Toast";

function validatePassword(p: string) {
  if (p.length < 6) return "Password must be at least 6 characters.";
  if (!/[A-Z]/.test(p)) return "Password must include an uppercase letter.";
  if (!/[a-z]/.test(p)) return "Password must include a lowercase letter.";
  return null;
}

export default function RegisterView() {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const password = String(f.get("password"));

    const problem = validatePassword(password);
    setPasswordError(problem);
    if (problem) {
      toast.error(problem);
      return;
    }

    setBusy(true);
    const { error } = await authClient.signUp.email({
      name: String(f.get("name")),
      email: String(f.get("email")),
      password,
      image: String(f.get("photo")),
    });
    setBusy(false);
    if (error) {
      toast.error(error.message || "Registration failed. Please try again.");
      return;
    }
    await authClient.signOut().catch(() => undefined);
    toast.success("Registration successful! Please log in.");
    router.push("/login");
  }

  async function google() {
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: "/" });
    if (error) toast.error(error.message || "Google login failed. Please try again.");
  }

  return (
    <section className="fade mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-12">
      <div className="max-w-md mx-auto rounded-2xl bg-card border border-line p-6 sm:p-8 space-y-5">
        <div className="text-center space-y-1.5">
          <h1 className="heading text-3xl sm:text-4xl font-bold">Create Account</h1>
          <p className="text-sm text-muted">Join the BookNook neighborhood reading community.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Name</label>
            <input name="name" required placeholder="e.g. Nadia Rahman" className="input w-full" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Email</label>
            <input name="email" type="email" required placeholder="reader@example.com" className="input w-full" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Photo URL</label>
            <input name="photo" type="url" required placeholder="https://…" className="input w-full" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Password</label>
            <input
              name="password"
              type="password"
              required
              placeholder="Min 6 characters, upper and lower case"
              className={`input w-full ${passwordError ? "input-error" : ""}`}
            />
            {passwordError && <p className="mt-1.5 text-xs font-medium text-error">{passwordError}</p>}
          </div>
          <button type="submit" disabled={busy} className="btn btn-primary w-full">
            {busy && <span className="loading loading-spinner loading-sm" />}
            Register
          </button>
        </form>

        <button type="button" onClick={google} className="btn btn-outline border-line w-full">
          <b className="text-base">G</b> Continue with Google
        </button>

        <p className="text-center text-xs text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
