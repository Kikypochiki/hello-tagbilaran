import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="error-sheet">
      <p className="kicker">This page is missing from the journal</p>
      <h1>We could not find that place note.</h1>
      <p>The prototype index may have changed while local listings are being verified.</p>
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
