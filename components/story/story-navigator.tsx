"use client";

import { useEffect, useRef, useState } from "react";

type StoryChapterLink = {
  id: string;
  title: string;
};

export function StoryNavigator({ chapters }: { chapters: StoryChapterLink[] }) {
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? "");
  const [isWithinStory, setIsWithinStory] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isFolioOpen, setIsFolioOpen] = useState(false);
  const folioRef = useRef<HTMLDivElement>(null);
  const mobileIndexRef = useRef<HTMLDetailsElement>(null);
  const activeChapter =
    chapters.find((chapter) => chapter.id === activeId) ?? chapters[0];
  const activeIndex = Math.max(
    0,
    chapters.findIndex((chapter) => chapter.id === activeId),
  );
  const chapterNumber = String(activeIndex + 1).padStart(2, "0");
  const chapterTotal = String(chapters.length).padStart(2, "0");

  useEffect(() => {
    const sections = chapters
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const story = document.querySelector<HTMLElement>(".archive-story");
    const footer = document.querySelector<HTMLElement>(".site-footer");

    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (current) setActiveId(current.target.id);
      },
      {
        rootMargin: "-22% 0px -58% 0px",
        threshold: [0.01, 0.2, 0.45],
      },
    );

    sections.forEach((section) => observer.observe(section));
    const storyObserver = story
      ? new IntersectionObserver(
          ([entry]) => setIsWithinStory(entry.isIntersecting),
          { rootMargin: "-72px 0px -68% 0px", threshold: 0.01 },
        )
      : null;

    if (story) storyObserver?.observe(story);

    const footerObserver = footer
      ? new IntersectionObserver(
          ([entry]) => setIsFooterVisible(entry.isIntersecting),
          { threshold: 0.01 },
        )
      : null;

    if (footer) footerObserver?.observe(footer);

    return () => {
      observer.disconnect();
      storyObserver?.disconnect();
      footerObserver?.disconnect();
    };
  }, [chapters]);

  useEffect(() => {
    if (!isFolioOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsFolioOpen(false);
      folioRef.current
        ?.querySelector<HTMLButtonElement>(".story-folio__trigger")
        ?.focus();
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (!folioRef.current?.contains(event.target as Node)) {
        setIsFolioOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isFolioOpen]);

  return (
    <nav
      className="archive-story__navigator"
      aria-label="Story chapters"
      data-within-story={isWithinStory && !isFooterVisible ? "" : undefined}
    >
      <div
        className="story-folio"
        data-open={isFolioOpen ? "" : undefined}
        ref={folioRef}
      >
        <button
          className="story-folio__trigger"
          type="button"
          aria-expanded={isFolioOpen}
          aria-controls="story-folio-sheet"
          aria-label={`Open chapter index. Current chapter: ${activeChapter?.title}`}
          onClick={() => setIsFolioOpen((open) => !open)}
        >
          <span>{chapterNumber}</span>
          <i aria-hidden="true" />
          <small>{chapterTotal}</small>
        </button>

        <div className="story-folio__sheet" id="story-folio-sheet">
          <p>Living City Archive</p>
          <ol>
            {chapters.map((chapter, index) => (
              <li key={chapter.id}>
                <a
                  href={`#${chapter.id}`}
                  aria-current={chapter.id === activeId ? "step" : undefined}
                  onClick={() => {
                    setIsFolioOpen(false);
                  }}
                >
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <strong>{chapter.title}</strong>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <details className="story-mobile-index" ref={mobileIndexRef}>
        <summary>
          <span>{activeChapter?.title}</span>
          <strong>
            {chapterNumber} / {chapterTotal}
          </strong>
        </summary>
        <ol>
          {chapters.map((chapter, index) => (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                aria-current={chapter.id === activeId ? "step" : undefined}
                onClick={() => {
                  if (mobileIndexRef.current) {
                    mobileIndexRef.current.open = false;
                  }
                }}
              >
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {chapter.title}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
