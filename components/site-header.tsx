"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "Story", meta: "Read" },
  { href: "/explore", label: "Explore", meta: "Map" },
];

function CompassMark() {
  return (
    <svg
      aria-hidden="true"
      className="brand-mark"
      viewBox="0 0 52 52"
      fill="none"
    >
      <circle cx="26" cy="26" r="21.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="26" cy="26" r="3" fill="currentColor" />
      <path d="m34.5 17.5-5.3 11.7-11.7 5.3 5.3-11.7 11.7-5.3Z" fill="currentColor" />
      <path d="M26 1.5v5M26 45.5v5M1.5 26h5M45.5 26h5" stroke="currentColor" strokeWidth="1.5" />
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
          <span className="brand__wordmark">
            <strong>Hello Tagbilaran</strong>
            <small>Tagbilaran City · Bohol</small>
          </span>
        </Link>
        <p className="site-header__descriptor">
          <span>City field journal</span>
          History, food, places, and everyday life
        </p>
        <nav className="site-nav" aria-label="Primary navigation">
          {navigation.map((item, index) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href) ||
                  (item.href === "/explore" && pathname.startsWith("/places"));
            return (
              <Link
                key={item.href}
                className="site-nav__link"
                data-active={active || undefined}
                href={item.href}
                aria-current={active ? "page" : undefined}
              >
                <span className="site-nav__number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <small>{item.meta}</small>
                  <strong>{item.label}</strong>
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
