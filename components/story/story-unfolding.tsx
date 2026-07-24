"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function StoryUnfolding() {
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const chapters = gsap.utils.toArray<HTMLElement>(".history-chapter");

      chapters.forEach((chapter) => {
        const stage = chapter.querySelector<HTMLElement>(".history-chapter__stage");
        const content = [
          chapter.querySelector<HTMLElement>(".history-chapter__header"),
          chapter.querySelector<HTMLElement>(".chapter-artifact"),
          chapter.querySelector<HTMLElement>(".history-chapter__copy"),
          chapter.querySelector<HTMLElement>(".history-chapter__footer"),
        ].filter((element): element is HTMLElement => Boolean(element));

        if (!stage) return;

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: chapter,
            start: "top 92%",
            end: "top 38%",
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .fromTo(
            stage,
            {
              y: 56,
              rotateX: 2.4,
              scale: 0.988,
              transformPerspective: 1800,
              transformOrigin: "50% 0%",
              "--paper-lift": 0.78,
            },
            {
              y: 0,
              rotateX: 0,
              scale: 1,
              "--paper-lift": 0,
              duration: 0.62,
            },
          )
          .fromTo(
            content,
            { y: 28, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.48,
              stagger: 0.07,
            },
            0.12,
          );
      });
    });

    return () => media.revert();
  }, []);

  return null;
}
