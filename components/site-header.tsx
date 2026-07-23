"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const navigation = [
  { href: "/", label: "The living archive", meta: "Story", number: "01" },
  { href: "/explore", label: "The city atlas", meta: "Explore", number: "02" },
  { href: "/hazard-assessment", label: "The preparedness room", meta: "Hazards", number: "03" },
  { href: "/about", label: "The colophon", meta: "About", number: "04" },
];

function CompassMark() {
  return (
    <svg aria-hidden="true" className="brand-mark" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="21.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="26" cy="26" r="2.5" fill="currentColor" />
      <path d="m34.5 17.5-5.3 11.7-11.7 5.3 5.3-11.7 11.7-5.3Z" fill="currentColor" />
      <path d="M26 1.5v5M26 45.5v5M1.5 26h5M45.5 26h5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDialogElement>(null);
  const active = navigation.find((item) =>
    item.href === "/"
      ? pathname === "/"
      : pathname.startsWith(item.href) ||
        (item.href === "/explore" && pathname.startsWith("/places")),
  ) ?? navigation[0];

  useEffect(() => {
    menuRef.current?.close();
  }, [pathname]);

  function openMenu() {
    menuRef.current?.showModal();
  }

  function closeOnBackdrop(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === menuRef.current) menuRef.current.close();
  }

  return (
    <header className="site-header experience-header" data-overlay={pathname === "/" || undefined}>
      <div className="site-header__inner">
        <Link className="brand" href="/" aria-label="Hello Tagbilaran home">
          <CompassMark />
          <span className="brand__wordmark">
            <strong>Hello Tagbilaran</strong>
            <small>Living city archive</small>
          </span>
        </Link>

        <button className="experience-header__menu-trigger" type="button" onClick={openMenu}>
          <span>Index</span>
          <i aria-hidden="true" />
        </button>
      </div>

      <dialog
        className="experience-menu"
        ref={menuRef}
        onClick={closeOnBackdrop}
        aria-labelledby="experience-menu-title"
      >
        <div className="experience-menu__paper">
          <header>
            <p id="experience-menu-title">Field index · Tagbilaran City</p>
            <button type="button" onClick={() => menuRef.current?.close()}>
              Close <span aria-hidden="true">×</span>
            </button>
          </header>
          <nav className="site-nav" aria-label="Primary navigation">
            <ol>
              {navigation.map((item) => {
                const isActive = item === active;
                return (
                  <li key={item.href}>
                    <Link
                      className="site-nav__link"
                      data-active={isActive || undefined}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span>{item.number}</span>
                      <small>{item.meta}</small>
                      <strong>{item.label}</strong>
                      <i aria-hidden="true">↗</i>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>
          <footer>
            <p>Where every street leads to a story.</p>
            <span>Tagbilaran City · Bohol · Philippines</span>
          </footer>
        </div>
      </dialog>
    </header>
  );
}
