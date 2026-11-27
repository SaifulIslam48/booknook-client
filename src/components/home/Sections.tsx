import Link from "next/link";
import SectionHead from "../SectionHead";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/constants";

const STEPS = [
  {
    title: "Browse & Inspect",
    text: "Check real-time copy availability, read book summaries, and see which community member added each title.",
  },
  {
    title: "Borrow in One Click",
    text: "Confirm your borrow request with a 7-day return schedule. Available copies update automatically on the shelf.",
  },
  {
    title: "Read & Return",
    text: "Track all active books inside My Borrows and return them with a single click so the next reader can enjoy them.",
  },
];

const NOTES = [
  {
    quote: "“Borrowed Milk and Honey on a Tuesday evening and finished it before the weekend. Returning it took one tap.”",
    name: "Maliha Chowdhury",
    role: "Fiction Reader",
  },
  {
    quote: "“Sharing spare science paperbacks from my bookshelf has connected me with neighbors who love astronomy as much as I do.”",
    name: "Tanvir Alam",
    role: "Science Contributor",
  },
  {
    quote: "“My daughter loves picking out illustrated stories from the Kids shelf every week. Clear return dates make it effortless.”",
    name: "Sadia Sultana",
    role: "Parent & Member",
  },
];

export default function Sections() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-20">
        <SectionHead eyebrow="Simple Lending Flow" title="How Borrowing Works" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <div key={s.title} className="h-full rounded-2xl bg-card border border-line p-6 space-y-3">
              <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-brand/10 text-brand">
                0{i + 1}
              </span>
              <h3 className="heading text-xl font-bold">{s.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-20">
        <SectionHead eyebrow="Curated Shelves" title="Top Categories & Reader Notes" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/books?category=${c}`}
              className="p-4 rounded-2xl bg-card border border-line hover:border-brand transition"
              style={{ borderLeft: `4px solid ${CATEGORY_COLORS[c]}` }}
            >
              <span className="block text-xs font-semibold text-muted">Browse shelf</span>
              <span className="heading text-lg font-bold">{c}</span>
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NOTES.map((n) => (
            <div key={n.name} className="h-full flex flex-col justify-between rounded-2xl bg-card border border-line p-6">
              <p className="text-sm text-muted leading-relaxed">{n.quote}</p>
              <div className="mt-4 pt-4 border-t border-line">
                <p className="text-sm font-bold">{n.name}</p>
                <p className="text-xs text-muted">{n.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
