export default function PlaceLoading() {
  return (
    <main id="main-content" className="route-loading" aria-busy="true">
      <h1>Turning to the marked page…</h1>
      <div className="route-loading__sheet" aria-hidden="true" />
    </main>
  );
}
