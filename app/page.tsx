import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CoverAmbient } from "@/components/story/cover-ambient";
import { StoryMotion } from "@/components/story/story-motion";
import { StoryNavigator } from "@/components/story/story-navigator";
import { historyChapters } from "@/content/history";

export const metadata: Metadata = {
  title: { absolute: "Hello Tagbilaran" },
  description:
    "Begin with Tagbilaran City's five-chapter field journal, then explore a practical city guide.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main id="main-content" className="story-journal">
      <section className="journal-cover" aria-labelledby="cover-title">
        <CoverAmbient />
        <div className="journal-cover__layout">
          <div className="journal-cover__content">
            <h1 id="cover-title">
              <span>Hello,</span>
              Tagbilaran.
            </h1>
            <p className="journal-cover__dek">
              A living portrait of Bohol&apos;s capital, assembled from coastline,
              memory, civic life, and the people who keep the city moving.
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

      <div className="archive-story">
        <StoryMotion />
        <StoryNavigator
          chapters={historyChapters.map(({ id, title }) => ({ id, title }))}
        />

        <article
          className="archive-story__chapters"
          aria-label="A five-chapter history of Tagbilaran"
        >
          {historyChapters.map((chapter, index) => {
            const nextChapter = historyChapters[index + 1];
            const image = chapter.media[0];

            return (
              <section
                className="archive-chapter"
                data-chapter-index={index}
                id={chapter.id}
                key={chapter.id}
                aria-labelledby={`${chapter.id}-title`}
              >
                <div className="archive-chapter__scene">
                  <div className="archive-chapter__paper">
                    <header className="archive-chapter__heading">
                      <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
                      {chapter.dateLabel ? (
                        <p className="archive-chapter__date">{chapter.dateLabel}</p>
                      ) : null}
                    </header>

                    {image ? (
                      <figure className="archive-chapter__figure">
                        <div className="archive-chapter__image">
                          <Image
                            src={image.src}
                            alt={image.alt}
                            width={image.width}
                            height={image.height}
                            sizes="(max-width: 767px) 100vw, (max-width: 1100px) 58vw, 52vw"
                            loading={index === 0 ? "eager" : "lazy"}
                          />
                        </div>
                      </figure>
                    ) : null}

                    <div className="archive-chapter__copy">
                      <p className="archive-chapter__intro">
                        {chapter.introduction}
                      </p>
                      {chapter.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>

                    <footer className="archive-chapter__footer">
                      {chapter.sources.length ? (
                        <details className="archive-chapter__sources">
                          <summary>
                            {chapter.sources.length === 1
                              ? "View chapter source"
                              : "View chapter sources"}
                          </summary>
                          <ul>
                            {chapter.sources.map((source) => (
                              <li key={source.title}>
                                {source.url ? (
                                  <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {source.title}
                                  </a>
                                ) : (
                                  source.title
                                )}
                              </li>
                            ))}
                          </ul>
                        </details>
                      ) : null}

                      {nextChapter ? (
                        <a
                          className="archive-chapter__next"
                          href={`#${nextChapter.id}`}
                          aria-label={`Continue to ${nextChapter.title}`}
                        >
                          Continue
                          <span aria-hidden="true">↓</span>
                        </a>
                      ) : (
                        <Link className="archive-chapter__atlas" href="/explore">
                          Enter the city atlas
                          <span aria-hidden="true">→</span>
                        </Link>
                      )}
                    </footer>
                  </div>
                </div>
              </section>
            );
          })}
        </article>
      </div>
    </main>
  );
}
