"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function StoryUnfolding() {
  useEffect(() => {
    const cover = document.querySelector<HTMLElement>(".journal-cover");
    const portal = document.querySelector<HTMLElement>(".story-portal");
    const story = document.querySelector<HTMLElement>(".story-layout");
    const article = document.querySelector<HTMLElement>(".history-article");
    const chapters = [...document.querySelectorAll<HTMLElement>(".history-chapter")];
    const reducedMotion = prefersReducedMotion();

    if (!article || !chapters.length) return;

    if (reducedMotion) {
      document.documentElement.classList.add("story-motion-reduced");
      return () => document.documentElement.classList.remove("story-motion-reduced");
    }

    let animationFrame = 0;

    function setSceneVariables(element: HTMLElement, progress: number) {
      const focus = clamp(1 - Math.abs(progress - 0.5) * 2);
      const direction = progress - 0.5;

      element.style.setProperty("--scene-progress", progress.toFixed(4));
      element.style.setProperty("--scene-focus", focus.toFixed(4));
      element.style.setProperty("--scene-copy-y", "0px");
      element.style.setProperty("--scene-art-y", `${direction * 52}px`);
      element.style.setProperty("--scene-art-x", `${direction * -18}px`);
      element.style.setProperty("--scene-turn", `${direction * 1.2}deg`);
      element.style.setProperty("--scene-scale", (0.975 + focus * 0.025).toFixed(4));
      element.style.setProperty("--scene-wash", (0.72 + focus * 0.28).toFixed(4));
    }

    function updateScenes() {
      animationFrame = 0;
      const viewportHeight = window.innerHeight;
      const readingLine = viewportHeight * 0.5;
      let activeIndex = 0;

      if (cover) {
        const bounds = cover.getBoundingClientRect();
        const progress = clamp(-bounds.top / Math.max(1, bounds.height));
        cover.style.setProperty("--cover-progress", progress.toFixed(4));
        cover.style.setProperty("--cover-art-y", `${progress * 58}px`);
        cover.style.setProperty("--cover-copy-y", "0px");
        cover.style.setProperty("--cover-scale", (1 - progress * 0.035).toFixed(4));
        cover.style.setProperty("--cover-fade", "1");
        cover.style.setProperty("--cover-meta-fade", clamp(1 - progress * 3).toFixed(4));
        document.documentElement.classList.toggle(
          "story-cover-passed",
          bounds.bottom < viewportHeight * 0.58,
        );
      }

      if (portal) {
        const bounds = portal.getBoundingClientRect();
        const progress = clamp((viewportHeight - bounds.top) / (bounds.height + viewportHeight));
        portal.style.setProperty("--portal-progress", progress.toFixed(4));
        portal.style.setProperty("--portal-door-scale", (0.7 + progress * 0.55).toFixed(4));
        portal.style.setProperty("--portal-shift", `${(0.5 - progress) * 90}px`);
      }

      chapters.forEach((chapter, index) => {
        const bounds = chapter.getBoundingClientRect();
        const progress = clamp((viewportHeight - bounds.top) / (bounds.height + viewportHeight));
        setSceneVariables(chapter, progress);

        if (bounds.top <= readingLine) activeIndex = index;
      });

      chapters.forEach((chapter, index) => {
        chapter.dataset.pageState =
          index < activeIndex ? "passed" : index === activeIndex ? "current" : "approaching";
      });

      if (story) {
        const bounds = story.getBoundingClientRect();
        const progress = clamp(-bounds.top / Math.max(1, bounds.height - viewportHeight));
        story.style.setProperty("--gallery-progress", progress.toFixed(4));
      }
    }

    function scheduleUpdate() {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateScenes);
    }

    document.documentElement.classList.add("story-motion-ready");
    updateScenes();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      document.documentElement.classList.remove("story-motion-ready");
      document.documentElement.classList.remove("story-cover-passed");
      cover?.removeAttribute("style");
      portal?.removeAttribute("style");
      story?.style.removeProperty("--gallery-progress");
      chapters.forEach((chapter) => {
        chapter.removeAttribute("style");
        delete chapter.dataset.pageState;
      });
    };
  }, []);

  return null;
}
