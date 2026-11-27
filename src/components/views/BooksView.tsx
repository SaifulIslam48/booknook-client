"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Book } from "@/types";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import { useAsync } from "@/lib/useAsync";
import BookCard from "../BookCard";
import SectionHead from "../SectionHead";
import Spinner from "../Spinner";

export default function BooksView() {
  const params = useSearchParams();
  const initialCategory = params.get("category");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    initialCategory && (CATEGORIES as string[]).includes(initialCategory) ? initialCategory : "All"
  );
  const { data: books, loading, error, reload } = useAsync(() => api<Book[]>("/books", { auth: false }), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (books ?? []).filter(
      (b) =>
        (category === "All" || b.category === category) &&
        (!q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
    );
  }, [books, search, category]);

  return (
    <section className="fade mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-12">
      <SectionHead
        as="h1"
        eyebrow="Complete Catalog"
        title="All Library Books"
        right={
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="search"
              aria-label="Search books"
              placeholder="Search by title or author…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input w-full sm:w-64"
            />
            <select
              aria-label="Filter by category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="select w-full sm:w-40"
            >
              {["All", ...CATEGORIES].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        }
      />

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="rounded-2xl bg-card border border-line p-12 text-center space-y-4">
          <p className="text-sm text-muted">{error}</p>
          <button onClick={reload} className="btn btn-outline btn-primary">
            Try again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-card border border-line p-12 text-center space-y-4">
          <h3 className="heading text-2xl font-bold">No matching books found</h3>
          <p className="text-sm text-muted">Try clearing your search or switching category filters.</p>
          <button
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
            className="btn btn-primary"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((b) => (
            <BookCard key={b._id} book={b} />
          ))}
        </div>
      )}
    </section>
  );
}
