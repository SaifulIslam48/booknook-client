import type { Metadata } from "next";
import RequireAuth from "@/components/RequireAuth";
import BookDetailsView from "@/components/views/BookDetailsView";

export const metadata: Metadata = { title: "Book Details" };

export default function BookDetailsPage() {
  return (
    <RequireAuth>
      <BookDetailsView />
    </RequireAuth>
  );
}
