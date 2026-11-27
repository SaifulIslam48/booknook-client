"use client";
import Link from "next/link";
import { useState } from "react";
import type { Book } from "@/types";
import { api, errMsg, uploadImage } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { CATEGORIES } from "@/lib/constants";
import { useAsync } from "@/lib/useAsync";
import Modal from "../Modal";
import SectionHead from "../SectionHead";
import Spinner from "../Spinner";
import { useToast } from "../Toast";

const LABEL = "block text-xs font-semibold uppercase tracking-wider mb-1.5";

export default function MyBooksView() {
  const { data: session } = authClient.useSession();
  const toast = useToast();
  const email = session?.user.email.toLowerCase() ?? "";

  const { data: all, setData, loading, error, reload } = useAsync(() => api<Book[]>("/books", { auth: false }), []);
  const books = (all ?? []).filter((b) => b.addedByEmail === email);

  const [editing, setEditing] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState<Book | null>(null);
  const [busy, setBusy] = useState(false);

  async function saveEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    const f = new FormData(e.currentTarget);
    const file = f.get("image");
    setBusy(true);
    try {
      const body: Record<string, unknown> = {
        title: f.get("title"),
        author: f.get("author"),
        category: f.get("category"),
        description: f.get("description"),
        totalCopies: Number(f.get("totalCopies")),
      };
      if (file instanceof File && file.size) body.image = await uploadImage(file);
      const updated = await api<Book>(`/books/${editing._id}`, { method: "PATCH", body });
      setData((prev) => (prev ? prev.map((b) => (b._id === updated._id ? updated : b)) : prev));
      toast.success("Book details updated successfully!");
      setEditing(null);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await api(`/books/${deleting._id}`, { method: "DELETE" });
      setData((prev) => (prev ? prev.filter((b) => b._id !== deleting._id) : prev));
      toast.success(`“${deleting.title}” was removed from BookNook.`);
      setDeleting(null);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="fade mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-12">
      <SectionHead
        as="h1"
        eyebrow="Your Contributions"
        title="My Books"
        right={
          <Link href="/add-book" className="btn btn-primary">
            + Add Another Book
          </Link>
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
      ) : books.length === 0 ? (
        <div className="rounded-2xl bg-card border border-line p-12 text-center space-y-4">
          <h3 className="heading text-2xl font-bold">You haven’t added any books yet</h3>
          <p className="text-sm text-muted">Share a book from your personal shelf so others can borrow it.</p>
          <Link href="/add-book" className="btn btn-primary">
            Add Your First Book
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-card border border-line">
          <table className="table">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-muted">
                <th>Book</th>
                <th>Author</th>
                <th>Category</th>
                <th>Copies</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img
                        src={b.image}
                        alt=""
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                        className="w-10 h-14 rounded-lg object-cover shrink-0"
                      />
                      <span className="font-bold">{b.title}</span>
                    </div>
                  </td>
                  <td className="text-muted">{b.author}</td>
                  <td>{b.category}</td>
                  <td className="font-semibold">
                    {b.copies} / {b.totalCopies}
                  </td>
                  <td className="text-right whitespace-nowrap">
                    <button className="btn btn-sm btn-outline border-line mr-2" onClick={() => setEditing(b)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-outline btn-error" onClick={() => setDeleting(b)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Modal title="Edit Book" onClose={() => !busy && setEditing(null)}>
          <form onSubmit={saveEdit} className="space-y-4">
            <div>
              <label className={LABEL}>Book Title</label>
              <input name="title" required minLength={2} defaultValue={editing.title} className="input w-full" />
            </div>
            <div>
              <label className={LABEL}>Author Name</label>
              <input name="author" required minLength={2} defaultValue={editing.author} className="input w-full" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Category</label>
                <select name="category" defaultValue={editing.category} className="select w-full">
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={LABEL}>Total Copies</label>
                <input
                  name="totalCopies"
                  type="number"
                  min={1}
                  max={1000}
                  required
                  defaultValue={editing.totalCopies}
                  className="input w-full"
                />
              </div>
            </div>
            <div>
              <label className={LABEL}>Short Description</label>
              <textarea
                name="description"
                rows={3}
                required
                minLength={10}
                defaultValue={editing.description}
                className="textarea w-full"
              />
            </div>
            <div>
              <label className={LABEL}>New Cover Image (optional)</label>
              <input name="image" type="file" accept="image/*" className="file-input w-full" />
            </div>
            <div className="modal-action">
              <button type="button" className="btn btn-outline border-line" onClick={() => setEditing(null)} disabled={busy}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy && <span className="loading loading-spinner loading-sm" />}
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleting && (
        <Modal title="Delete this book?" onClose={() => !busy && setDeleting(null)}>
          <p className="text-sm text-muted">
            Are you sure you want to remove <b className="text-ink">{deleting.title}</b> from the library? This action
            cannot be undone.
          </p>
          <div className="modal-action">
            <button className="btn btn-outline border-line" onClick={() => setDeleting(null)} disabled={busy}>
              Cancel
            </button>
            <button className="btn btn-error" onClick={confirmDelete} disabled={busy}>
              {busy && <span className="loading loading-spinner loading-sm" />}
              Yes, Delete
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
