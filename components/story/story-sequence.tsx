import Image from "next/image";
import Link from "next/link";
import type { HistoryChapter } from "@/types/content";
import { StoryMotion } from "./story-motion";
import { StoryNavigator } from "./story-navigator";
import styles from "./story-sequence.module.css";

const titleLines: Record<string, string[]> = {
  "coast-and-current": ["A settlement", "shaped by", "the shore"],
  "sandugo-and-friendship": ["Sandugo,", "retold", "with care"],
  "streets-of-stone": ["From port", "settlement", "to town"],
  "repair-and-cityhood": ["The long road", "to cityhood"],
  "city-in-motion": ["Tagbilaran,", "in the present", "tense"],
};

type StorySequenceProps = {
  chapters: HistoryChapter[];
  prototype?: boolean;
};

export function StorySequence({
  chapters,
  prototype = false,
}: StorySequenceProps) {
  return (
    <div
      className={`archive-story ${styles.root}`}
      data-story-root
      data-prototype={prototype ? "" : undefined}
    >
      <StoryMotion />
      {!prototype ? (
        <StoryNavigator
          chapters={chapters.map(({ id, title }) => ({ id, title }))}
        />
      ) : null}

      <article
        className={styles.chapters}
        aria-label="A five-chapter history of Tagbilaran"
      >
        {chapters.map((chapter, index) => {
          const nextChapter = chapters[index + 1];
          const image = chapter.media[0];
          const lines = titleLines[chapter.id] ?? [chapter.title];
          const chapterNumber = String(index + 1).padStart(2, "0");

          return (
            <section
              className={styles.chapter}
              data-story-chapter
              data-chapter-index={index}
              id={chapter.id}
              key={chapter.id}
              aria-labelledby={`${chapter.id}-title`}
            >
              <div className={styles.stage} data-story-stage>
                <div className={styles.sheet}>
                  <p className={styles.folio} aria-hidden="true">
                    {chapterNumber} / {String(chapters.length).padStart(2, "0")}
                  </p>

                  <header className={styles.titleBlock} data-story-title>
                    <p className={styles.eyebrow}>{chapter.eyebrow}</p>
                    <h2
                      id={`${chapter.id}-title`}
                      className={styles.title}
                      aria-label={chapter.title}
                    >
                      {lines.map((line) => (
                        <span className={styles.lineMask} key={line}>
                          <span className={styles.line} data-story-title-line>
                            {line}
                          </span>
                        </span>
                      ))}
                    </h2>
                    {chapter.dateLabel ? (
                      <span className={styles.dateMask}>
                        <span className={styles.date} data-story-date>
                          {chapter.dateLabel}
                        </span>
                      </span>
                    ) : null}
                  </header>

                  {image ? (
                    <figure className={styles.media} data-story-photo>
                      <div className={styles.print}>
                        <div className={styles.imageFrame}>
                          <Image
                            className={styles.image}
                            src={image.src}
                            alt={image.alt}
                            width={image.width}
                            height={image.height}
                            sizes="(max-width: 767px) calc(100vw - 2.5rem), 54vw"
                            loading={index === 0 ? "eager" : "lazy"}
                            data-story-photo-image
                          />
                        </div>
                        <figcaption className={styles.caption}>
                          <span>{image.alt}</span>
                          <span>
                            Photo:{" "}
                            {image.sourceUrl ? (
                              <a
                                href={image.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {image.credit ?? "Source"}
                              </a>
                            ) : (
                              image.credit
                            )}
                            {image.date ? `, ${image.date}` : ""}
                            {image.licenseUrl ? (
                              <>
                                {" · "}
                                <a
                                  href={image.licenseUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {image.rights}
                                </a>
                              </>
                            ) : null}
                          </span>
                        </figcaption>
                      </div>
                    </figure>
                  ) : null}

                  <div className={styles.reading} data-story-reading>
                    <p className={styles.introduction} data-story-intro>
                      {chapter.introduction}
                    </p>
                    <div className={styles.body}>
                      {chapter.body.map((paragraph) => (
                        <p data-story-paragraph key={paragraph}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  <footer className={styles.footer} data-story-footer>
                    {chapter.sources.length ? (
                      <details className={styles.sources}>
                        <summary>
                          {chapter.sources.length === 1
                            ? "Chapter source"
                            : "Chapter sources"}
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
                        className={styles.continueLink}
                        href={`#${nextChapter.id}`}
                        aria-label={`Continue to ${nextChapter.title}`}
                      >
                        Continue <span aria-hidden="true">↓</span>
                      </a>
                    ) : (
                      <Link className={styles.continueLink} href="/explore">
                        Enter the city atlas <span aria-hidden="true">→</span>
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
  );
}
