"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

export function StoryUnfolding() {
  useEffect(() => {
    const article = document.querySelector<HTMLElement>(".history-article");
    const chapters = [...document.querySelectorAll<HTMLElement>(".history-chapter")];
    const reducedMotion = prefersReducedMotion();

    if (!article || !chapters.length || reducedMotion) return;

    let animationFrame = 0;

    function updatePageStates() {
      animationFrame = 0;
      const readingLine = window.innerHeight * 0.48;
      let activeIndex = 0;

      chapters.forEach((chapter, index) => {
        if (chapter.getBoundingClientRect().top <= readingLine) activeIndex = index;
      });

      chapters.forEach((chapter, index) => {
        chapter.dataset.pageState =
          index < activeIndex ? "turned" : index === activeIndex ? "current" : "upcoming";
      });
    }

    function scheduleUpdate() {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updatePageStates);
    }

    article.classList.add("history-page-turn-ready");
    updatePageStates();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      article.classList.remove("history-page-turn-ready");
      chapters.forEach((chapter) => delete chapter.dataset.pageState);
    };
  }, []);

  return null;
}
