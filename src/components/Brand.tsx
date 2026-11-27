import Link from "next/link";

export default function Brand() {
  return (
    <Link href="/" aria-label="BookNook home" className="flex items-center gap-2.5">
      <span className="w-10 h-10 shrink-0 rounded-xl bg-brand text-onbrand flex items-center justify-center">
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      </span>
      <span className="heading text-2xl font-bold">
        Book<span className="text-brand">Nook</span>
      </span>
    </Link>
  );
}
