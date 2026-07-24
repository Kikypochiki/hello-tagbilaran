"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

type StoryChapterLink = {
  id: string;
  title: string;
};

export function StoryNavigator({ chapters }: { chapters: StoryChapterLink[] }) {
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? "");
  const [isWithinStory, setIsWithinStory] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
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

  return (
    <nav
      className="archive-story__navigator"
      aria-label="Story chapters"
      data-within-story={isWithinStory && !isFooterVisible ? "" : undefined}
    >
      <div className="story-thread">
        <span className="story-thread__track" aria-hidden="true">
          <i className="story-thread__fill" />
        </span>
        <ol>
          {chapters.map((chapter, index) => {
            const chapterAt =
              chapters.length > 1
                ? 5 + (index / (chapters.length - 1)) * 90
                : 50;

            return (
              <li
                key={chapter.id}
                style={{ "--chapter-at": `${chapterAt}%` } as CSSProperties}
              >
                <a
                  href={`#${chapter.id}`}
                  aria-current={chapter.id === activeId ? "step" : undefined}
                >
                  <i className="story-thread__mark" aria-hidden="true" />
                  <span className="story-thread__label">
                    <small aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </small>
                    <strong>{chapter.title}</strong>
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
        <p className="story-thread__counter" aria-hidden="true">
          <strong>{chapterNumber}</strong>
          <span>/</span>
          {chapterTotal}
        </p>
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
