import type { Metadata } from "next";
import RequireAuth from "@/components/RequireAuth";
import MyBorrowsView from "@/components/views/MyBorrowsView";

export const metadata: Metadata = { title: "My Borrows" };

export default function MyBorrowsPage() {
  return (
    <RequireAuth>
      <MyBorrowsView />
    </RequireAuth>
  );
}
