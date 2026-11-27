import type { Metadata } from "next";
import RequireAuth from "@/components/RequireAuth";
import ProfileView from "@/components/views/ProfileView";

export const metadata: Metadata = { title: "My Profile" };

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileView />
    </RequireAuth>
  );
}
