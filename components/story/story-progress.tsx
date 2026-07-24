"use client";

import { useEffect, useState } from "react";

export function StoryProgress({
  chapters,
}: {
  chapters: { id: string; title: string }[];
}) {
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? "");

  useEffect(() => {
    const sections = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId((visible.target as HTMLElement).id);
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: [0.05, 0.25, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [chapters]);

  const activeIndex = Math.max(
    0,
    chapters.findIndex((chapter) => chapter.id === activeId),
  );
  const progress = chapters.length > 1 ? activeIndex / (chapters.length - 1) : 0;
  const previousChapter = chapters[activeIndex - 1];
  const nextChapter = chapters[activeIndex + 1];

  return (
    <nav className="chapter-rail" aria-label="History chapters">
      <div className="chapter-rail__heading">
        <p>Living City Archive</p>
        <a href="#main-content">Cover</a>
      </div>
      <div className="chapter-rail__mobile-controls">
        {previousChapter ? (
          <a href={`#${previousChapter.id}`} aria-label={`Previous: ${previousChapter.title}`}>
            ← Previous
          </a>
        ) : (
          <span />
        )}
        <strong>
          Chapter {activeIndex + 1} of {chapters.length}
        </strong>
        {nextChapter ? (
          <a href={`#${nextChapter.id}`} aria-label={`Next: ${nextChapter.title}`}>
            Next →
          </a>
        ) : (
          <a href="/explore">City atlas →</a>
        )}
      </div>
      <div className="chapter-rail__track" aria-hidden="true">
        <span style={{ transform: `scaleY(${progress})` }} />
      </div>
      <ol>
        {chapters.map((chapter, index) => (
          <li key={chapter.id}>
            <a
              href={`#${chapter.id}`}
              aria-current={chapter.id === activeId ? "step" : undefined}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {chapter.title}
            </a>
          </li>
        ))}
      </ol>
      <a className="chapter-rail__restart" href="#main-content">
        Restart experience ↑
      </a>
    </nav>
  );
}
