"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import type { Book } from "@/types";
import { api, errMsg } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { formatDate } from "@/lib/constants";
import { useAsync } from "@/lib/useAsync";
import Modal from "../Modal";
import Spinner from "../Spinner";
import { useToast } from "../Toast";

export default function BookDetailsView() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = authClient.useSession();
  const toast = useToast();
  const { data: book, loading, error, reload } = useAsync(() => api<Book>(`/books/${id}`), [id]);
  const [borrowing, setBorrowing] = useState(false);
  const [returnOn, setReturnOn] = useState("");
  const [busy, setBusy] = useState(false);

  async function confirmBorrow() {
    if (!book) return;
    setBusy(true);
    try {
      await api("/borrows", { method: "POST", body: { bookId: book._id } });
      toast.success(`You borrowed “${book.title}”. Enjoy reading!`);
      setBorrowing(false);
      reload();
    } catch (e) {
      setBorrowing(false);
      toast.error(errMsg(e));
      reload();
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <Spinner />;
  if (error || !book) {
    return (
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-20 text-center space-y-4">
        <h1 className="heading text-3xl font-bold">We couldn’t open this book</h1>
        <p className="text-sm text-muted">{error ?? "Book not found"}</p>
        <Link href="/books" className="btn btn-primary">
          Back to All Books
        </Link>
      </section>
    );
  }

  const available = book.copies > 0;
  return (
    <section className="fade mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-12">
      <Link href="/books" className="inline-block text-sm font-semibold text-muted hover:text-brand mb-6">
        ← Back to All Books
      </Link>

      <div className="grid md:grid-cols-12 gap-8 p-6 sm:p-8 rounded-2xl bg-card border border-line">
        <div className="md:col-span-5">
          <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-md bg-line">
            <img
              src={book.image}
              alt={`Cover of ${book.title}`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder.svg";
              }}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2.5">
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-brand/10 text-brand">{book.category}</span>
              <span
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  available ? "bg-success/15 text-success" : "bg-error/15 text-error"
                }`}
              >
                {available ? `${book.copies} ${book.copies === 1 ? "Copy" : "Copies"} Available` : "Not Available"}
              </span>
            </div>
            <div>
              <h1 className="heading text-3xl sm:text-4xl font-bold">{book.title}</h1>
              <p className="text-base text-muted mt-1">by {book.author}</p>
            </div>
            <p className="leading-relaxed">{book.description}</p>
            <div className="pt-3 border-t border-line text-sm text-muted space-y-1">
              <p>
                <b className="text-ink">Added by:</b> {book.addedByName} ({book.addedByEmail})
              </p>
              <p>
                <b className="text-ink">Shelved on:</b> {formatDate(book.createdAt)}
              </p>
            </div>
          </div>

          <div>
            <button
              onClick={() => {
                setReturnOn(formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()));
                setBorrowing(true);
              }}
              disabled={!available}
              className="btn btn-primary"
            >
              {available ? "Borrow This Book" : "Not Available"}
            </button>
          </div>
        </div>
      </div>

      {borrowing && (
        <Modal title="Borrow This Book" onClose={() => !busy && setBorrowing(false)}>
          <p className="text-sm text-muted mb-4">
            You are borrowing <b className="text-ink">{book.title}</b> for 7 days.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Borrower Name</label>
              <input readOnly value={session?.user.name ?? ""} className="input w-full opacity-70" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Borrower Email</label>
              <input readOnly value={session?.user.email ?? ""} className="input w-full opacity-70" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Return Date (7 days)</label>
              <input readOnly value={returnOn} className="input w-full opacity-70" />
            </div>
          </div>
          <div className="modal-action">
            <button className="btn btn-outline border-line" onClick={() => setBorrowing(false)} disabled={busy}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={confirmBorrow} disabled={busy}>
              {busy && <span className="loading loading-spinner loading-sm" />}
              Confirm Borrow
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
