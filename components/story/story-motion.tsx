"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function StoryMotion() {
  useGSAP(() => {
    const story = document.querySelector<HTMLElement>(".archive-story");
    if (!story || prefersReducedMotion()) return;

    const media = gsap.matchMedia();

    media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      story.dataset.motion = "ready";

      const chapters = gsap.utils.toArray<HTMLElement>(".archive-chapter", story);

      chapters.forEach((chapter) => {
        const paper = chapter.querySelector<HTMLElement>(".archive-chapter__paper");
        const heading = chapter.querySelector<HTMLElement>(".archive-chapter__heading");
        const figure = chapter.querySelector<HTMLElement>(".archive-chapter__figure");
        const image = chapter.querySelector<HTMLElement>(".archive-chapter__image img");
        const copy = chapter.querySelector<HTMLElement>(".archive-chapter__copy");
        const footer = chapter.querySelector<HTMLElement>(".archive-chapter__footer");

        if (!paper || !heading || !figure || !image || !copy || !footer) return;

        gsap.set(paper, { yPercent: 5, scale: 0.985 });
        gsap.set(heading, { y: 54, opacity: 0.18 });
        gsap.set(figure, {
          clipPath: "inset(18% 14% 18% 14%)",
          y: 42,
        });
        gsap.set(image, { scale: 1.12 });
        gsap.set(copy, { y: 42, opacity: 0 });
        gsap.set(footer, { y: 24, opacity: 0 });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: chapter,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to(paper, { yPercent: 0, scale: 1, duration: 0.22 }, 0)
          .to(heading, { y: 0, opacity: 1, duration: 0.26 }, 0)
          .to(
            figure,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              y: 0,
              duration: 0.42,
            },
            0.08,
          )
          .to(image, { scale: 1, duration: 0.5 }, 0.08)
          .to(copy, { y: 0, opacity: 1, duration: 0.3 }, 0.42)
          .to(footer, { y: 0, opacity: 1, duration: 0.2 }, 0.62);
      });

      return () => {
        delete story.dataset.motion;
      };
    });

    media.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      const chapters = gsap.utils.toArray<HTMLElement>(".archive-chapter", story);

      chapters.forEach((chapter) => {
        const targets = Array.from(
          chapter.querySelectorAll<HTMLElement>(
            ".archive-chapter__heading, .archive-chapter__figure, .archive-chapter__copy",
          ),
        );

        gsap.fromTo(
          targets,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.72,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: chapter,
              start: "top 82%",
              once: true,
            },
          },
        );
      });
    });

    return () => media.revert();
  }, []);

  return null;
}
