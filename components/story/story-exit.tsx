"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { prefersReducedMotion } from "@/lib/motion";

export function StoryExit() {
  const router = useRouter();

  function handleExplore(event: MouseEvent<HTMLAnchorElement>) {
    const reducedMotion = prefersReducedMotion();
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
      <div className="story-exit__copy">
        <p className="section-kicker">Turn the page · enter the city</p>
        <h2 id="story-exit-title">The story continues in the streets.</h2>
        <p>Move from the archive into a living index of places, barangays, and everyday city life.</p>
      </div>
      <Link className="primary-action story-exit__guide-link" href="/explore" onClick={handleExplore}>
        Continue to city guide <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
