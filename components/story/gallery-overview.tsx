export function GalleryOverview({
  chapters,
}: {
  chapters: { id: string; title: string; eyebrow: string }[];
}) {
  return (
    <section className="gallery-overview" id="story-overview" aria-labelledby="gallery-overview-title">
      <div className="gallery-overview__intro">
        <p className="section-kicker">Gallery plan · five rooms</p>
        <h2 id="gallery-overview-title">Follow one line through the living archive.</h2>
        <p>
          Each room holds a different way of reading the city: shoreline, encounter,
          street plan, repaired record, and everyday life.
        </p>
      </div>
      <nav aria-label="Living archive overview">
        <ol>
          {chapters.map((chapter, index) => (
            <li key={chapter.id}>
              <a href={`#${chapter.id}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{chapter.title}</strong>
                <small>{chapter.eyebrow.replace(/^Chapter \w+ · /i, "")}</small>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <a className="gallery-overview__enter" href={`#${chapters[0]?.id ?? "main-content"}`}>
        Enter room one <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
