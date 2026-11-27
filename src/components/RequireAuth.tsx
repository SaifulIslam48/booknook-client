"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useToast } from "./Toast";
import Spinner from "./Spinner";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();

  useEffect(() => {
    if (!isPending && !session) {
      toast.info("Please log in to access that page.");
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, session, pathname, router, toast]);

  if (isPending || !session) return <Spinner />;
  return <>{children}</>;
}
