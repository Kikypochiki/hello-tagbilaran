"use client";

import { useEffect } from "react";

export function StoryUnfolding() {
  useEffect(() => {
    const article = document.querySelector<HTMLElement>(".history-article");
    const chapters = [...document.querySelectorAll<HTMLElement>(".history-chapter")];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!article || !chapters.length || reducedMotion) return;

    article.classList.add("history-motion-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-unfolded", "true");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "-8% 0px -12%", threshold: 0.12 },
    );

    chapters.forEach((chapter) => observer.observe(chapter));

    return () => {
      observer.disconnect();
      article.classList.remove("history-motion-ready");
      chapters.forEach((chapter) => chapter.removeAttribute("data-unfolded"));
    };
  }, []);

  return null;
}
