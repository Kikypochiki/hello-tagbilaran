import type { Metadata } from "next";
import { historyChapters } from "@/content/history";
import { StoryExit } from "@/components/story/story-exit";
import { StoryProgress } from "@/components/story/story-progress";
import { StoryUnfolding } from "@/components/story/story-unfolding";

export const metadata: Metadata = {
  title: "A city, unfolded",
  description:
    "Begin with Tagbilaran City's five-chapter field journal, then explore a practical city guide.",
  alternates: { canonical: "/" },
};

function ArchivalPlaceholder({ chapter }: { chapter: number }) {
  return (
    <figure className="archive-figure">
      <div className="archive-figure__image" role="img" aria-label="Archival image placeholder">
        <svg aria-hidden="true" viewBox="0 0 680 450" preserveAspectRatio="xMidYMid slice">
          <path className="archive-figure__wash" d="M0 330 135 205l87 62 95-145 110 127 93-85 160 160v126H0Z" />
          <path d="M0 363c130-50 237 41 367-7 116-42 197-24 313 12" />
          <circle cx={chapter % 2 ? 516 : 148} cy="100" r="38" />
          <path d="M38 40h604v370H38z" />
        </svg>
        <span>Image research in progress</span>
      </div>
      <figcaption>
        Placeholder plate {String(chapter).padStart(2, "0")} · Rights-cleared local or
        archival image required before publication.
      </figcaption>
    </figure>
  );
}

export default function Home() {
  return (
    <main id="main-content" className="story-journal">
      <StoryUnfolding />
      <section className="journal-cover" aria-labelledby="cover-title">
        <div className="journal-cover__registration" aria-hidden="true">
          FIELD JOURNAL · NO. 01
        </div>
        <div className="journal-cover__content">
          <p className="kicker">A city field journal from Bohol</p>
          <h1 id="cover-title">
            Hello,
            <span>Tagbilaran.</span>
          </h1>
          <p className="journal-cover__dek">
            Where every street leads to a story. Begin with the city itself—its memory,
            everyday rhythms, and the people who keep it moving.
          </p>
          <a className="cover-scroll" href="#coast-and-current">
            Open the first chapter <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="journal-cover__postmark" aria-hidden="true">
          <span>TAGBILARAN</span>
          <span>BOHOL · PH</span>
        </div>
        <div className="journal-cover__sun" aria-hidden="true" />
      </section>

      <div className="story-layout">
        <StoryProgress
          chapters={historyChapters.map(({ id, title }) => ({ id, title }))}
        />
        <article className="history-article" aria-label="A prototype history of Tagbilaran">
          <header className="editorial-notice">
            <strong>Sourced working journal</strong>
            <p>
              This synthesis begins with the City Government of Tagbilaran’s published
              history. Final publication still requires corroboration, local editorial
              review, and image rights.
            </p>
          </header>
          {historyChapters.map((chapter, index) => (
            <section
              className="history-chapter"
              id={chapter.id}
              key={chapter.id}
              aria-labelledby={`${chapter.id}-title`}
            >
              <div className="history-chapter__binding" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="history-chapter__folio" aria-hidden="true">
                <span>Hello Tagbilaran</span>
                <span>Journal leaf {String(chapter.order).padStart(2, "0")}</span>
              </div>
              <div className="history-chapter__number" aria-hidden="true">
                {String(chapter.order).padStart(2, "0")}
              </div>
              <header className="history-chapter__header">
                <p className="chapter-eyebrow">{chapter.eyebrow}</p>
                <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
                {chapter.dateLabel ? (
                  <p className="chapter-date">{chapter.dateLabel}</p>
                ) : null}
              </header>
              <div className="history-chapter__spread">
                <div className="history-chapter__copy">
                  <p className="chapter-intro">{chapter.introduction}</p>
                  {chapter.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {chapter.annotations?.map((annotation) => (
                    <aside className="margin-note" key={annotation.label}>
                      <span>{annotation.label}</span>
                      <p>{annotation.text}</p>
                    </aside>
                  ))}
                </div>
                <ArchivalPlaceholder chapter={index + 1} />
              </div>
              {chapter.sources.length ? (
                <footer className="history-chapter__sources">
                  <span>Chapter source</span>
                  {chapter.sources.map((source) =>
                    source.url ? (
                      <a key={source.title} href={source.url} target="_blank" rel="noreferrer">
                        {source.title} · {source.publisher}
                      </a>
                    ) : (
                      <span key={source.title}>{source.title}</span>
                    ),
                  )}
                </footer>
              ) : null}
            </section>
          ))}
        </article>
      </div>
      <StoryExit />
    </main>
  );
}
