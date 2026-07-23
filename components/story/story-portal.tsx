export function StoryPortal({
  chapters,
}: {
  chapters: { id: string; title: string; eyebrow: string }[];
}) {
  return (
    <section className="story-portal" id="story-overview" aria-labelledby="story-portal-title">
      <div className="story-portal__stage">
        <div className="story-portal__door" aria-hidden="true">
          <span />
          <span />
          <svg className="story-portal__landscape" viewBox="0 0 520 620">
            <path d="M-24 465C70 391 125 501 219 430s163-53 228 4 106 7 142-46" />
            <path d="M-18 493C83 420 139 529 232 459s159-51 224 1 104 7 141-42" />
            <path d="M181 415V267h150v148M208 267v-62h96v62M244 205v-72h25v72" />
            <path d="M169 415h178M205 313h102M224 365h63" />
            <circle cx="256" cy="133" r="6" />
            <circle cx="94" cy="473" r="5" />
            <circle cx="419" cy="449" r="5" />
          </svg>
          <i />
        </div>

        <header>
          <p className="section-kicker">The living archive · five encounters</p>
          <h2 id="story-portal-title">Walk into the city’s memory.</h2>
          <p>
            One survey line moves from shore to street. Follow it at your own pace;
            every chapter remains readable without motion.
          </p>
        </header>

        <nav aria-label="Choose a story chapter">
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

        <a className="story-portal__enter" href={`#${chapters[0]?.id ?? "main-content"}`}>
          Cross the threshold <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
