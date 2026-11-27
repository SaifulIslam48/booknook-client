import type { Metadata } from "next";
import RequireAuth from "@/components/RequireAuth";
import AddBookView from "@/components/views/AddBookView";

export const metadata: Metadata = { title: "Add Book" };

export default function AddBookPage() {
  return (
    <RequireAuth>
      <AddBookView />
    </RequireAuth>
  );
}
