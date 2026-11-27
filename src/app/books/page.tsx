import type { Metadata } from "next";
import { Suspense } from "react";
import BooksView from "@/components/views/BooksView";
import Spinner from "@/components/Spinner";

export const metadata: Metadata = { title: "All Books" };

export default function BooksPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <BooksView />
    </Suspense>
  );
}
