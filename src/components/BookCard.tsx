"use client";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Book } from "@/types";
import { CATEGORY_COLORS } from "@/lib/constants";

export default function BookCard({ book }: { book: Book }) {
  const available = book.copies > 0;
  return (
    <article
      style={{ "--sc": CATEGORY_COLORS[book.category] ?? "#1B4332" } as CSSProperties}
      className="spine h-full flex flex-col overflow-hidden rounded-2xl bg-card border border-line hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-line">
        <img
          src={book.image}
          alt={`Cover of ${book.title}`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/placeholder.svg";
          }}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold bg-card/90 border border-line">
          {book.category}
        </span>
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-semibold ${
            available ? "bg-emerald-950/85 text-emerald-300" : "bg-rose-950/85 text-rose-300"
          }`}
        >
          {available ? `${book.copies} left` : "Not Available"}
        </span>
      </div>
      <div className="flex-1 flex flex-col p-5 gap-3">
        <div className="space-y-1">
          <h3 className="heading text-xl font-bold line-clamp-1">{book.title}</h3>
          <p className="text-sm text-muted line-clamp-1">by {book.author}</p>
        </div>
        <Link href={`/books/${book._id}`} className="btn btn-primary w-full mt-auto">
          View Details
        </Link>
      </div>
    </article>
  );
}
