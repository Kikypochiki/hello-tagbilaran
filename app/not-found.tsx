import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="error-sheet">
      <h1>We could not find that place note.</h1>
      <p>The place may have moved or the link may be out of date.</p>
      <div className="error-sheet__actions">
        <Link className="primary-action" href="/explore">
          Open the place index
        </Link>
        <Link className="text-link" href="/">
          Return to the story
        </Link>
      </div>
    </main>
  );
}
