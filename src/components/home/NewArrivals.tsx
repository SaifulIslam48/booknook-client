"use client";
import Link from "next/link";
import type { Book } from "@/types";
import { api } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";
import BookCard from "../BookCard";
import SectionHead from "../SectionHead";
import Spinner from "../Spinner";

export default function NewArrivals() {

  const { data: books, loading, error, reload } = useAsync(
    () => api<Book[]>("/books?sort=newest&limit=6", { auth: false }),
    []
  );

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-16">
      <SectionHead
        eyebrow="Recently Shelved"
        title="New Arrivals"
        right={
          <p className="text-sm text-muted max-w-md">
            Explore the six newest titles shared by readers in our neighborhood collection.
          </p>
        }
      />
      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="rounded-2xl bg-card border border-line p-10 text-center space-y-4">
          <p className="text-sm text-muted">{error}</p>
          <button onClick={reload} className="btn btn-outline btn-primary">
            Try again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books?.map((b) => (
            <BookCard key={b._id} book={b} />
          ))}
        </div>
      )}
      <div className="mt-10 text-center">
        <Link href="/books" className="btn btn-outline btn-primary">
          See All Books
        </Link>
      </div>
    </section>
  );
}
