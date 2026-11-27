import type { Metadata } from "next";
import RequireAuth from "@/components/RequireAuth";
import MyBooksView from "@/components/views/MyBooksView";

export const metadata: Metadata = { title: "My Books" };

export default function MyBooksPage() {
  return (
    <RequireAuth>
      <MyBooksView />
    </RequireAuth>
  );
}
