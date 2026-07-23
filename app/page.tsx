import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChapterArtifact } from "@/components/story/chapter-artifact";
import { BarangayFoldout } from "@/components/story/barangay-foldout";
import { historyChapters } from "@/content/history";
import { StoryExit } from "@/components/story/story-exit";
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
        <div className="journal-cover__layout">
          <div className="journal-cover__content">
            <div className="journal-cover__registration">
              <span>Field journal · No. 01</span>
              <span>Tagbilaran City · Bohol</span>
            </div>
            <h1 id="cover-title">
              <span>Hello,</span>
              Tagbilaran.
            </h1>
            <p className="journal-cover__dek">
              A guide to Bohol’s capital told through its coast, civic heart, food,
              neighborhoods, and the people who keep the city moving.
            </p>
            <div className="journal-cover__actions">
              <a className="cover-scroll" href="#coast-and-current">
                Begin the city story <span aria-hidden="true">↓</span>
              </a>
              <Link className="cover-explore" href="/explore">
                Explore places <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <figure className="journal-cover__postcard">
            <div className="journal-cover__photo">
              <Image
                src="/images/places/plaza-rizal.jpg"
                alt="Plaza Jose P. Rizal and St. Joseph the Worker Cathedral in central Tagbilaran"
                width={2048}
                height={1152}
                sizes="(max-width: 780px) 92vw, 44vw"
                priority
                loading="eager"
              />
            </div>
            <figcaption>
              <span>City plate · 01</span>
              <strong>Plaza Jose P. Rizal</strong>
              <span>Central Tagbilaran · Photo: City Government of Tagbilaran</span>
            </figcaption>
            <div className="journal-cover__postmark" aria-hidden="true">
              <span>TAGBILARAN</span>
              <span>BOHOL · PH</span>
            </div>
          </figure>
        </div>
      </section>

      <div className="story-layout">
        <div className="story-survey-thread" aria-hidden="true"><span /></div>
        <StoryProgress
          chapters={historyChapters.map(({ id, title }) => ({ id, title }))}
        />
        <article className="history-article" aria-label="A five-chapter history of Tagbilaran">
          {historyChapters.map((chapter) => (
            <section
              className="history-chapter"
              data-visual-mode={chapter.visualMode}
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
              <div className="history-chapter__spread">
                <header className="history-chapter__header">
                  <p className="chapter-eyebrow">{chapter.eyebrow}</p>
                  <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
                  {chapter.dateLabel ? (
                    <p className="chapter-date">{chapter.dateLabel}</p>
                  ) : null}
                </header>
                <div className="history-chapter__copy">
                  <p className="chapter-intro">{chapter.introduction}</p>
                  {chapter.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <ChapterArtifact chapter={chapter} />
              </div>
              {chapter.sources.length ? (
                <footer className="history-chapter__sources">
                  <span>{chapter.sources.length === 1 ? "Chapter source" : "Chapter sources"}</span>
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
      <BarangayFoldout />
      <StoryExit />
    </main>
  );
}
