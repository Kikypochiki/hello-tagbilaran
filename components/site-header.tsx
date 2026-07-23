"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "Story", meta: "Read" },
  { href: "/explore", label: "Explore", meta: "Map" },
  { href: "/hazard-assessment", label: "Hazards", meta: "Assess" },
  { href: "/about", label: "About", meta: "Project" },
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
    <header className="site-header" data-overlay={pathname === "/" || undefined}>
      <div className="site-header__inner">
        <Link className="brand" href="/" aria-label="Hello Tagbilaran home">
          <CompassMark />
          <span className="brand__wordmark">
            <strong>Hello Tagbilaran</strong>
            <small>Tagbilaran City · Bohol</small>
          </span>
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          {navigation.map((item) => {
            const active =
              item.href === "/" || item.href.startsWith("/#")
                ? pathname === "/" && item.href === "/"
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
                <small>{item.meta}</small>
                <strong>{item.label}</strong>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
