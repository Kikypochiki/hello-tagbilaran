import type { Metadata } from "next";
import Link from "next/link";
import { ChapterArtifact } from "@/components/story/chapter-artifact";
import { CoverAmbient } from "@/components/story/cover-ambient";
import { historyChapters } from "@/content/history";
import { RevealText } from "@/components/story/reveal-text";
import { StoryProgress } from "@/components/story/story-progress";
import { StoryUnfolding } from "@/components/story/story-unfolding";

export const metadata: Metadata = {
  title: { absolute: "Hello Tagbilaran" },
  description:
    "Begin with Tagbilaran City's five-chapter field journal, then explore a practical city guide.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main id="main-content" className="story-journal">
      <StoryUnfolding />

      <section className="journal-cover" aria-labelledby="cover-title">
        <CoverAmbient />
        <div className="journal-cover__layout">
          <div className="journal-cover__content">
            <h1 id="cover-title">
              <span>Hello,</span>
              Tagbilaran.
            </h1>
            <p className="journal-cover__dek">
              A living portrait of Bohol’s capital, assembled from coastline, memory,
              civic life, and the people who keep the city moving.
            </p>
            <div className="journal-cover__actions">
              <a className="cover-scroll" href={`#${historyChapters[0].id}`}>
                Begin the experience <span aria-hidden="true">↓</span>
              </a>
              <Link
                className="cover-explore"
                href="/explore"
                aria-label="Explore places in the city atlas"
              >
                Enter the city atlas <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>

      </section>

      <div className="story-layout">
        <StoryProgress
          chapters={historyChapters.map(({ id, title }) => ({ id, title }))}
        />

        <article className="history-article" aria-label="A five-chapter history of Tagbilaran">
          {historyChapters.map((chapter, index) => {
            const nextChapter = historyChapters[index + 1];
            return (
              <section
                className="history-chapter"
                data-visual-mode={chapter.visualMode}
                id={chapter.id}
                key={chapter.id}
                aria-labelledby={`${chapter.id}-title`}
              >
                <div className="history-chapter__stage">
                  <div className="history-chapter__atmosphere" aria-hidden="true">
                    <span />
                  </div>

                  <div className="history-chapter__spread">
                    <header className="history-chapter__header">
                      <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
                    </header>

                    <div className="history-chapter__copy">
                      <RevealText className="chapter-intro">
                        {chapter.introduction}
                      </RevealText>
                      {chapter.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>

                    <ChapterArtifact chapter={chapter} />
                  </div>

                  <footer className="history-chapter__footer">
                    {chapter.sources.length ? (
                      <div className="history-chapter__sources">
                        <span>{chapter.sources.length === 1 ? "Source" : "Sources"}</span>
                        {chapter.sources.map((source) =>
                          source.url ? (
                            <a key={source.title} href={source.url} target="_blank" rel="noreferrer">
                              {source.title} · {source.publisher}
                            </a>
                          ) : (
                            <span key={source.title}>{source.title}</span>
                          ),
                        )}
                      </div>
                    ) : null}

                    <nav
                      className="history-chapter__room-controls"
                      aria-label={`${chapter.title} chapter navigation`}
                    >
                      <a href={nextChapter ? `#${nextChapter.id}` : "/explore"}>
                        {nextChapter ? "Continue" : "Enter the city atlas"}
                        <span aria-hidden="true">{nextChapter ? "↓" : "→"}</span>
                      </a>
                    </nav>
                  </footer>
                </div>
              </section>
            );
          })}
        </article>
      </div>
    </main>
  );
}
