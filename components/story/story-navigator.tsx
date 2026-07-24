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
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const activeChapter =
    chapters.find((chapter) => chapter.id === activeId) ?? chapters[0];

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
    const details = detailsRef.current;
    if (!details) return;
    const desktop = window.matchMedia("(min-width: 768px)");
    const syncOpenState = () => {
      details.open = desktop.matches;
    };
    syncOpenState();
    desktop.addEventListener("change", syncOpenState);
    return () => desktop.removeEventListener("change", syncOpenState);
  }, []);

  return (
    <nav
      className="archive-story__navigator"
      aria-label="Story chapters"
      data-within-story={isWithinStory && !isFooterVisible ? "" : undefined}
    >
      <div className="story-rail">
        <p className="sr-only">Living City Archive chapters</p>
        <span className="story-rail__track" aria-hidden="true">
          <i className="story-rail__fill" />
        </span>
        <ol>
          {chapters.map((chapter, index) => {
            const chapterAt =
              chapters.length > 1
                ? 8 + (index / (chapters.length - 1)) * 84
                : 50;

            return (
              <li
                key={chapter.id}
                style={{ "--chapter-at": `${chapterAt}%` } as CSSProperties}
              >
                <a
                  href={`#${chapter.id}`}
                  aria-label={`Go to ${chapter.title}`}
                  aria-current={chapter.id === activeId ? "step" : undefined}
                >
                  <i className="story-rail__tick" aria-hidden="true" />
                  <span className="story-rail__label" aria-hidden="true">
                    {chapter.title}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>

        <div className="story-compass" aria-hidden="true">
          <div className="story-compass__case">
            <div className="story-compass__dial">
              <i className="story-compass__north">N</i>
              <span className="story-compass__needle-group">
                <span className="story-compass__needle story-compass__needle--north" />
                <span className="story-compass__needle story-compass__needle--south" />
                <span className="story-compass__pin" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <details className="story-mobile-index" ref={detailsRef}>
        <summary>
          <span>{activeChapter?.title}</span>
          <strong>Chapters</strong>
        </summary>
        <ol>
          {chapters.map((chapter) => (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                aria-current={chapter.id === activeId ? "step" : undefined}
                onClick={() => {
                  if (detailsRef.current) detailsRef.current.open = false;
                }}
              >
                {chapter.title}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
