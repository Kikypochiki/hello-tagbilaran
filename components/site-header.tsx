"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "Story" },
  { href: "/explore", label: "Explore" },
];

function CompassMark() {
  return (
    <svg
      aria-hidden="true"
      className="brand-mark"
      viewBox="0 0 52 52"
      fill="none"
    >
      <circle cx="26" cy="26" r="22" stroke="currentColor" strokeWidth="1.5" />
      <path d="M30.8 20.2 27.6 28l-7.8 3.2 3.2-7.8 7.8-3.2Z" fill="currentColor" />
      <path d="M26 1.5v5M26 45.5v5M1.5 26h5M45.5 26h5" stroke="currentColor" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" href="/" aria-label="Hello Tagbilaran home">
          <CompassMark />
          <span>
            <strong>Hello Tagbilaran</strong>
            <small>City field journal</small>
          </span>
        </Link>
        <nav className="paper-tabs" aria-label="Primary navigation">
          {navigation.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href) ||
                  (item.href === "/explore" && pathname.startsWith("/places"));
            return (
              <Link
                key={item.href}
                className="paper-tab"
                data-active={active || undefined}
                href={item.href}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
