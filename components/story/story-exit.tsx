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
      <h2 className="sr-only" id="story-exit-title">
        Continue to the Tagbilaran city guide
      </h2>
      <Link className="primary-action story-exit__guide-link" href="/explore" onClick={handleExplore}>
        Continue to city guide <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
