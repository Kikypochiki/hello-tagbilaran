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

  return (
    <nav className="chapter-rail" aria-label="History chapters">
      <p>Field notes</p>
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
    </nav>
  );
}
