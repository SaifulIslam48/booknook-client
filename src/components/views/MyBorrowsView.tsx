"use client";
import Link from "next/link";
import { useState } from "react";
import type { Borrow } from "@/types";
import { api, errMsg } from "@/lib/api";
import { formatDate } from "@/lib/constants";
import { useAsync } from "@/lib/useAsync";
import SectionHead from "../SectionHead";
import Spinner from "../Spinner";
import { useToast } from "../Toast";

export default function MyBorrowsView() {
  const toast = useToast();
  const { data: borrows, setData, loading, error, reload } = useAsync(() => api<Borrow[]>("/borrows"), []);
  const [returningId, setReturningId] = useState<string | null>(null);

  async function giveBack(b: Borrow) {
    setReturningId(b._id);
    try {
      await api(`/borrows/${b._id}`, { method: "DELETE" });
      setData((prev) => (prev ? prev.filter((x) => x._id !== b._id) : prev));
      toast.success(`“${b.bookTitle}” returned. Thank you!`);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setReturningId(null);
    }
  }

  return (
    <section className="fade mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-12">
      <SectionHead as="h1" eyebrow="Active Reading List" title="My Borrows" />

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="rounded-2xl bg-card border border-line p-12 text-center space-y-4">
          <p className="text-sm text-muted">{error}</p>
          <button onClick={reload} className="btn btn-outline btn-primary">
            Try again
          </button>
        </div>
      ) : !borrows || borrows.length === 0 ? (
        <div className="rounded-2xl bg-card border border-line p-12 text-center space-y-4">
          <h3 className="heading text-2xl font-bold">No borrowed books right now</h3>
          <p className="text-sm text-muted">Browse the library catalog and borrow a book for seven days.</p>
          <Link href="/books" className="btn btn-primary">
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-card border border-line">
          <table className="table">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-muted">
                <th>Image</th>
                <th>Title</th>
                <th>Borrow Date</th>
                <th>Return Date</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {borrows.map((b) => (
                <tr key={b._id}>
                  <td>
                    <img
                      src={b.bookImage}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                      className="w-10 h-14 rounded-lg object-cover"
                    />
                  </td>
                  <td className="font-bold">{b.bookTitle}</td>
                  <td className="text-muted">{formatDate(b.borrowDate)}</td>
                  <td className="font-medium">{formatDate(b.returnDate)}</td>
                  <td className="text-right">
                    <button
                      className="btn btn-sm btn-outline btn-primary"
                      onClick={() => giveBack(b)}
                      disabled={returningId === b._id}
                    >
                      {returningId === b._id && <span className="loading loading-spinner loading-xs" />}
                      Return Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
