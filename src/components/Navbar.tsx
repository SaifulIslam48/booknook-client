"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Brand from "./Brand";
import Avatar from "./Avatar";
import { useToast } from "./Toast";
import { authClient } from "@/lib/auth-client";

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
];
const PRIVATE_LINKS = [
  { href: "/add-book", label: "Add Book" },
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
];

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  const user = session?.user;
  const links = user ? [...PUBLIC_LINKS, ...PRIVATE_LINKS] : PUBLIC_LINKS;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") === "booknook-dark");
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function toggleTheme() {
    const next = dark ? "booknook" : "booknook-dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("bn-theme", next);
    setDark(!dark);
  }

  async function logout() {
    setUserOpen(false);
    await authClient.signOut();
    toast.info("Logged out successfully.");
    router.push("/");
  }

  const linkClass = (href: string) =>
    `px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
      isActive(href) ? "bg-brand/10 text-brand" : "text-muted hover:text-ink"
    }`;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-bg/90 border-b border-line">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          <Brand />

          <nav className="hidden md:flex items-center gap-1" aria-label="Main">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={linkClass(l.href)}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle light and dark theme"
              className="btn btn-square btn-outline border-line"
            >
              {dark ? (
                <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
                </svg>
              )}
            </button>

            {isPending ? (
              <span className="w-10 h-10" aria-hidden="true" />
            ) : user ? (
              <div ref={userRef} className="relative">
                <button
                  onClick={() => setUserOpen((o) => !o)}
                  aria-label="User menu"
                  className="block rounded-full ring-2 ring-brand"
                >
                  <Avatar name={user.name} image={user.image} className="w-10 h-10" />
                </button>
                {userOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-card border border-line shadow-xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-line">
                      <p className="text-sm font-bold truncate">{user.name}</p>
                      <p className="text-xs text-muted truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setUserOpen(false)}
                      className="block px-3 py-2 mt-1 rounded-xl text-xs font-semibold hover:bg-line/50"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-error hover:bg-error/10"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="btn btn-outline border-line btn-sm sm:btn-md">
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary btn-sm sm:btn-md">
                  Register
                </Link>
              </>
            )}

            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="md:hidden btn btn-square btn-outline border-line"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden pb-3 pt-2 border-t border-line" aria-label="Mobile">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`block ${linkClass(l.href)}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
