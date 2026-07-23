import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChapterArtifact } from "@/components/story/chapter-artifact";
import { BarangayFoldout } from "@/components/story/barangay-foldout";
import { historyChapters } from "@/content/history";
import { StoryExit } from "@/components/story/story-exit";
import { StoryProgress } from "@/components/story/story-progress";
import { StoryUnfolding } from "@/components/story/story-unfolding";
import { GalleryThreshold } from "@/components/story/gallery-threshold";
import { StoryPortal } from "@/components/story/story-portal";

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
        <GalleryThreshold />
        <div className="journal-cover__layout">
          <div className="journal-cover__content">
            <div className="journal-cover__registration">
              <span>Tagbilaran City · Bohol</span>
            </div>
            <h1 id="cover-title">
              <span>Hello,</span>
              Tagbilaran.
            </h1>
            <p className="journal-cover__dek">
              A living portrait of Bohol’s capital, assembled from coastline, memory,
              civic life, and the people who keep the city moving.
            </p>
            <div className="journal-cover__actions">
              <a className="cover-scroll" href="#story-overview">
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

          <figure className="journal-cover__postcard">
            <div className="journal-cover__halo" aria-hidden="true">
              <span />
            </div>
            <div className="journal-cover__photo">
              <Image
                src="/images/places/plaza-rizal.jpg"
                alt="Plaza Jose P. Rizal and St. Joseph the Worker Cathedral in central Tagbilaran"
                width={2048}
                height={1152}
                sizes="(max-width: 780px) 96vw, 58vw"
                priority
                loading="eager"
              />
            </div>
            <figcaption>
              <span>City portrait · 01</span>
              <strong>Plaza Jose P. Rizal</strong>
              <span>Central Tagbilaran · City Government of Tagbilaran</span>
            </figcaption>
          </figure>
        </div>

      </section>

      <StoryPortal
        chapters={historyChapters.map(({ id, title, eyebrow }) => ({ id, title, eyebrow }))}
      />

      <div className="story-layout">
        <div className="story-survey-thread" aria-hidden="true">
          <span />
          <i />
        </div>
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

                  <div className="history-chapter__number" aria-hidden="true">
                    {String(chapter.order).padStart(2, "0")}
                  </div>

                  <div className="history-chapter__spread">
                    <header className="history-chapter__header">
                      <p className="chapter-eyebrow">{chapter.eyebrow}</p>
                      <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
                      {chapter.dateLabel ? <p className="chapter-date">{chapter.dateLabel}</p> : null}
                    </header>

                    <div className="history-chapter__copy">
                      <p className="chapter-intro">{chapter.introduction}</p>
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
                      <a href="#story-overview">Archive index</a>
                      <a href={nextChapter ? `#${nextChapter.id}` : "#barangays"}>
                        {nextChapter ? "Continue" : "Meet the barangays"}
                        <span aria-hidden="true">↓</span>
                      </a>
                    </nav>
                  </footer>
                </div>
              </section>
            );
          })}
        </article>
      </div>

      <BarangayFoldout />
      <StoryExit />
    </main>
  );
}
