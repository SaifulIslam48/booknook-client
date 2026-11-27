"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    document.title = "BookNook | Page Not Found";
  }, []);

  return (
    <section className="mx-auto max-w-xl px-4 pt-28 text-center space-y-5">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-secondary">Error 404</p>
      <h1 className="heading text-4xl sm:text-5xl font-bold">Page Not Found in Our Shelves</h1>
      <p className="text-sm text-muted leading-relaxed">
        The page you are looking for may have been moved or shelved under another title.
      </p>
      <Link href="/" className="btn btn-primary">
        Back to Home
      </Link>
    </section>
  );
}
