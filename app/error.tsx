"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => console.error(error), [error]);
  return (
    <main id="main-content" className="error-sheet">
      <h1>Something interrupted this journal.</h1>
      <p>Try opening the page again. Saved places stored on this device are unaffected.</p>
      <button className="primary-action" type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
