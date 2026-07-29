import type { Metadata } from "next";
import Link from "next/link";
import { CoverAmbient } from "@/components/story/cover-ambient";
import { StorySequence } from "@/components/story/story-sequence";
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

      <StorySequence chapters={historyChapters} />
    </main>
  );
}
