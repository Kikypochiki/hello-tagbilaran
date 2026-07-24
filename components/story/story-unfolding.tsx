"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function StoryUnfolding() {
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    const root = document.documentElement;
    root.classList.add("story-cinematic-ready");
    const media = gsap.matchMedia();

    media.add("(min-width: 961px) and (prefers-reduced-motion: no-preference)", () => {
      const chapters = gsap.utils.toArray<HTMLElement>(".history-chapter");

      chapters.forEach((chapter) => {
        const stage = chapter.querySelector<HTMLElement>(".history-chapter__stage");
        if (!stage) return;

        const header = chapter.querySelector<HTMLElement>(".history-chapter__header");
        const figure = chapter.querySelector<HTMLElement>(".archive-figure");
        const echoes = Array.from(
          chapter.querySelectorAll<HTMLElement>(".archive-figure__echo"),
        );
        const introWords = Array.from(
          chapter.querySelectorAll<HTMLElement>(".story-reveal-word"),
        );
        const paragraphs = Array.from(
          chapter.querySelectorAll<HTMLElement>(
            ".history-chapter__copy > p:not(.chapter-intro)",
          ),
        );
        const footer = chapter.querySelector<HTMLElement>(".history-chapter__footer");
        const trace = chapter.querySelector<SVGPathElement>(".chapter-trace__line");
        const tracePoints = Array.from(
          chapter.querySelectorAll<SVGCircleElement>(".chapter-trace__point"),
        );

        gsap.set(stage, { "--story-wash": 0 });
        gsap.set(header, { y: 34, opacity: 0.62 });
        gsap.set(figure, {
          y: 48,
          scale: 0.9,
          rotation: chapter.dataset.visualMode === "memory-folio" ? 0.8 : -0.8,
        });
        gsap.set(echoes, { y: 80, scale: 0.58, opacity: 0 });
        gsap.set(trace, { strokeDashoffset: 1 });
        gsap.set(tracePoints, {
          scale: 0,
          transformOrigin: "50% 50%",
        });
        gsap.set(introWords, { opacity: 0.34 });
        gsap.set(paragraphs, { y: 24, opacity: 0.28 });
        gsap.set(footer, { y: 18, opacity: 0 });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: chapter,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.85,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to(stage, { "--story-wash": 1, duration: 1 })
          .to(header, { y: 0, opacity: 1, duration: 0.34 }, 0)
          .to(figure, { y: 0, scale: 1, rotation: 0, duration: 0.56 }, 0)
          .to(
            echoes,
            {
              y: 0,
              scale: 1,
              opacity: 1,
              duration: 0.36,
              stagger: 0.08,
            },
            0.08,
          )
          .to(trace, { strokeDashoffset: 0, duration: 0.62 }, 0.08)
          .to(
            tracePoints,
            { scale: 1, duration: 0.28, stagger: 0.08 },
            0.2,
          )
          .to(
            introWords,
            { opacity: 1, duration: 0.5, stagger: 0.012 },
            0.18,
          )
          .to(
            paragraphs,
            { y: 0, opacity: 1, duration: 0.42, stagger: 0.08 },
            0.34,
          )
          .to(
            footer,
            { y: 0, opacity: 1, duration: 0.25 },
            0.6,
          )
          .to(
            figure,
            { y: -12, scale: 1.025, duration: 0.25 },
            0.75,
          );
      });
    });

    media.add(
      "(max-width: 960px) and (prefers-reduced-motion: no-preference)",
      () => {
        const chapters = gsap.utils.toArray<HTMLElement>(".history-chapter");

        chapters.forEach((chapter) => {
          const targets = [
            chapter.querySelector<HTMLElement>(".history-chapter__header"),
            chapter.querySelector<HTMLElement>(".archive-figure"),
            chapter.querySelector<HTMLElement>(".history-chapter__copy"),
          ].filter((element): element is HTMLElement => Boolean(element));

          gsap.fromTo(
            targets,
            { y: 42, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: chapter,
                start: "top 82%",
                once: true,
              },
            },
          );
        });
      },
    );

    return () => {
      root.classList.remove("story-cinematic-ready");
      media.revert();
    };
  }, []);

  return null;
}
