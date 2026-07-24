export default function ExploreLoading() {
  return (
    <main id="main-content" className="route-loading" aria-busy="true">
      <h1>Unfolding the map…</h1>
      <div className="route-loading__sheet" aria-hidden="true" />
    </main>
  );
}
