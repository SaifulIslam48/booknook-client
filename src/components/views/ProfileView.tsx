"use client";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Avatar from "../Avatar";
import { useToast } from "../Toast";

export default function ProfileView() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const toast = useToast();
  const user = session?.user;
  if (!user) return null;

  async function logout() {
    await authClient.signOut();
    toast.info("Logged out successfully.");
    router.push("/");
  }

  return (
    <section className="fade mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-12">
      <div className="max-w-md mx-auto rounded-2xl bg-card border border-line p-8 text-center space-y-5">
        <Avatar name={user.name} image={user.image} className="w-24 h-24 text-3xl mx-auto ring-2 ring-brand" />
        <div>
          <h1 className="heading text-3xl font-bold">{user.name}</h1>
          <p className="text-sm text-muted mt-1">{user.email}</p>
        </div>
        <button onClick={logout} className="btn btn-outline btn-primary">
          Logout
        </button>
      </div>
    </section>
  );
}
