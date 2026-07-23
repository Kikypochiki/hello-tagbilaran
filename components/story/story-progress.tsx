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

    let animationFrame = 0;

    function updateActiveChapter() {
      animationFrame = 0;
      const readingLine = window.innerHeight * 0.48;
      let activeSection = sections[0];

      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= readingLine) activeSection = section;
      });

      setActiveId(activeSection.id);
    }

    function scheduleUpdate() {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateActiveChapter);
    }

    updateActiveChapter();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
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
        <p>Gallery route</p>
        <a href="#story-overview">Plan</a>
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
          <a href="#story-exit-title">Continue →</a>
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
