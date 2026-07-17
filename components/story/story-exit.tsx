"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

export function StoryExit() {
  const router = useRouter();

  function handleExplore(event: MouseEvent<HTMLAnchorElement>) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (
      reducedMotion ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    document.documentElement.classList.add("is-folding-to-map");
    window.setTimeout(() => {
      router.push("/explore");
      document.documentElement.classList.remove("is-folding-to-map");
    }, 780);
  }

  return (
    <section className="story-exit" aria-labelledby="story-exit-title">
      <div className="story-exit__map-preview" aria-hidden="true">
        <svg viewBox="0 0 760 420" preserveAspectRatio="xMidYMid slice">
          <path d="M-40 92c110 45 142-10 242 38s151 4 247 50 173-5 342 45" />
          <path d="M45 356c90-80 151-56 228-131s184-44 222-115 144-53 230-29" />
          <path d="M212 0c-9 80 38 109 12 184s28 115 11 236" />
          <path d="M528 0c28 84-19 117 13 191s-31 129 18 229" />
          <circle cx="380" cy="214" r="17" />
          <circle cx="380" cy="214" r="5" />
        </svg>
      </div>
      <div className="story-exit__paper">
        <span className="story-exit__eyebrow">The journal opens outward</span>
        <h2 id="story-exit-title">The story continues in the streets of Tagbilaran.</h2>
        <p>
          Move from the editorial timeline to a searchable city field guide. The map is
          optional; every stop remains available as an accessible list.
        </p>
        <Link className="primary-action" href="/explore" onClick={handleExplore}>
          Explore the map <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
