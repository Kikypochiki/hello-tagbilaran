"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ExploreError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => console.error(error), [error]);

  return (
    <main id="main-content" className="error-sheet">
      <p className="kicker">The map page caught on a fold</p>
      <h1>The field guide could not open.</h1>
      <p>Your saved stops remain on this device. Try opening the page again.</p>
      <div className="error-sheet__actions">
        <button className="primary-action" type="button" onClick={reset}>
          Try again
        </button>
        <Link className="text-link" href="/">
          Return to the story
        </Link>
      </div>
    </main>
  );
}
