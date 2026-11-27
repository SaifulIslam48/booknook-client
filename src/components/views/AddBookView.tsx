"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Book } from "@/types";
import { api, errMsg, uploadImage } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { CATEGORIES } from "@/lib/constants";
import SectionHead from "../SectionHead";
import { useToast } from "../Toast";

const LABEL = "block text-xs font-semibold uppercase tracking-wider mb-1.5";

export default function AddBookView() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const file = f.get("image");
    if (!(file instanceof File) || !file.size) {
      toast.error("Please choose a cover image for the book.");
      return;
    }
    setBusy(true);
    try {
      const image = await uploadImage(file);
      const book = await api<Book>("/books", {
        method: "POST",
        body: {
          title: f.get("title"),
          author: f.get("author"),
          category: f.get("category"),
          description: f.get("description"),
          totalCopies: Number(f.get("totalCopies")),
          image,
        },
      });
      toast.success(`“${book.title}” was added to BookNook!`);
      router.push("/my-books");
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="fade mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-12">
      <div className="max-w-3xl mx-auto">
        <SectionHead as="h1" eyebrow="Contribute a Title" title="Add a New Book" />
        <form onSubmit={onSubmit} className="rounded-2xl bg-card border border-line p-6 sm:p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={LABEL}>Book Title</label>
              <input name="title" required minLength={2} placeholder="e.g. The Alchemist" className="input w-full" />
            </div>
            <div>
              <label className={LABEL}>Author Name</label>
              <input name="author" required minLength={2} placeholder="e.g. Paulo Coelho" className="input w-full" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={LABEL}>Category</label>
              <select name="category" className="select w-full" defaultValue="Fiction">
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL}>Total Copies</label>
              <input name="totalCopies" type="number" min={1} max={1000} defaultValue={2} required className="input w-full" />
            </div>
          </div>
          <div>
            <label className={LABEL}>Book Image (uploaded to imgbb)</label>
            <input name="image" type="file" accept="image/*" required className="file-input w-full" />
          </div>
          <div>
            <label className={LABEL}>Short Description</label>
            <textarea
              name="description"
              rows={3}
              required
              minLength={10}
              placeholder="Write a concise overview of what readers will enjoy in this book…"
              className="textarea w-full"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={LABEL}>User Name</label>
              <input readOnly value={session?.user.name ?? ""} className="input w-full opacity-70" />
            </div>
            <div>
              <label className={LABEL}>User Email</label>
              <input readOnly value={session?.user.email ?? ""} className="input w-full opacity-70" />
            </div>
          </div>
          <button type="submit" disabled={busy} className="btn btn-primary w-full">
            {busy && <span className="loading loading-spinner loading-sm" />}
            Add Book
          </button>
        </form>
      </div>
    </section>
  );
}
