"use client";

import { useEffect, useRef, useState } from "react";

type StoryChapterLink = {
  id: string;
  title: string;
};

export function StoryNavigator({ chapters }: { chapters: StoryChapterLink[] }) {
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? "");
  const [isWithinStory, setIsWithinStory] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const activeChapter =
    chapters.find((chapter) => chapter.id === activeId) ?? chapters[0];

  useEffect(() => {
    const sections = chapters
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const story = document.querySelector<HTMLElement>(".archive-story");

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
          { rootMargin: "-72px 0px 0px" },
        )
      : null;

    if (story) storyObserver?.observe(story);

    return () => {
      observer.disconnect();
      storyObserver?.disconnect();
    };
  }, [chapters]);

  return (
    <nav
      className="archive-story__navigator"
      aria-label="Story chapters"
      data-within-story={isWithinStory || undefined}
    >
      <p>Living City Archive</p>
      <details ref={detailsRef}>
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
