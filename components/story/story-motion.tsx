"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function StoryMotion() {
  useGSAP(() => {
    const story = document.querySelector<HTMLElement>("[data-story-root]");
    if (!story || prefersReducedMotion()) return;

    const media = gsap.matchMedia();

    media.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        story.dataset.storyMotion = "desktop";

        const chapters = gsap.utils.toArray<HTMLElement>(
          "[data-story-chapter]",
          story,
        );
        const progressFill =
          story.querySelector<HTMLElement>(".story-thread__fill");

        if (progressFill) {
          gsap.fromTo(
            progressFill,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: story,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.25,
              },
            },
          );
        }

        chapters.forEach((chapter) => {
          const titleBlock =
            chapter.querySelector<HTMLElement>("[data-story-title]");
          const titleLines = gsap.utils.toArray<HTMLElement>(
            "[data-story-title-line]",
            chapter,
          );
          const date =
            chapter.querySelector<HTMLElement>("[data-story-date]");
          const photo =
            chapter.querySelector<HTMLElement>("[data-story-photo]");
          const photoImage = chapter.querySelector<HTMLElement>(
            "[data-story-photo-image]",
          );
          const introduction =
            chapter.querySelector<HTMLElement>("[data-story-intro]");
          const paragraphs = gsap.utils.toArray<HTMLElement>(
            "[data-story-paragraph]",
            chapter,
          );
          const footer =
            chapter.querySelector<HTMLElement>("[data-story-footer]");

          if (
            !titleBlock ||
            !titleLines.length ||
            !photo ||
            !photoImage ||
            !introduction ||
            !paragraphs.length ||
            !footer
          ) {
            return;
          }

          gsap.set(titleLines, {
            yPercent: (lineIndex) => (lineIndex === 0 ? 0 : 112),
          });
          if (date) gsap.set(date, { yPercent: 110 });
          gsap.set(photo, {
            xPercent: 0,
            yPercent: 12,
            scale: 0.5,
            rotation: 1.4,
            transformOrigin: "right center",
          });
          gsap.set(photoImage, { scale: 1.08 });
          gsap.set(introduction, { autoAlpha: 0, y: 36 });
          gsap.set(paragraphs, { autoAlpha: 0, y: 28 });
          gsap.set(footer, { autoAlpha: 0, y: 18 });

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: chapter,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.42,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .to(
              titleLines,
              {
                yPercent: 0,
                duration: 0.14,
                stagger: 0.035,
                ease: "power3.out",
              },
              0,
            )
            .to(
              date,
              {
                yPercent: 0,
                duration: 0.12,
                ease: "power2.out",
              },
              0.12,
            )
            .to(
              photo,
              {
                xPercent: 0,
                yPercent: 5,
                scale: 0.72,
                rotation: 0.35,
                duration: 0.25,
                ease: "power2.out",
              },
              0.1,
            )
            .to(
              photoImage,
              {
                scale: 1.035,
                duration: 0.25,
              },
              0.1,
            )
            .to(
              titleBlock,
              {
                yPercent: -18,
                scale: 0.78,
                transformOrigin: "left top",
                duration: 0.2,
                ease: "power2.inOut",
              },
              0.35,
            )
            .to(
              photo,
              {
                yPercent: 0,
                scale: 0.9,
                rotation: 0,
                duration: 0.22,
                ease: "power2.inOut",
              },
              0.34,
            )
            .to(
              titleBlock,
              {
                autoAlpha: 0,
                yPercent: -30,
                duration: 0.08,
              },
              0.42,
            )
            .to(
              introduction,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.1,
                ease: "power2.out",
              },
              0.5,
            )
            .to(
              introduction,
              {
                autoAlpha: 0,
                y: -24,
                duration: 0.06,
              },
              0.62,
            )
            .to(
              photo,
              {
                scale: 1,
                duration: 0.18,
                ease: "power2.inOut",
              },
              0.55,
            )
            .to(
              photoImage,
              {
                scale: 1,
                duration: 0.18,
              },
              0.55,
            )
            .to(
              paragraphs,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.15,
                stagger: 0.045,
                ease: "power2.out",
              },
              0.7,
            )
            .to(
              footer,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.12,
                ease: "power2.out",
              },
              0.82,
            );
        });

        ScrollTrigger.refresh();

        return () => {
          delete story.dataset.storyMotion;
        };
      },
    );

    media.add(
      "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
      () => {
        story.dataset.storyMotion = "mobile";

        const chapters = gsap.utils.toArray<HTMLElement>(
          "[data-story-chapter]",
          story,
        );

        chapters.forEach((chapter) => {
          const titleLines = gsap.utils.toArray<HTMLElement>(
            "[data-story-title-line]",
            chapter,
          );
          const date =
            chapter.querySelector<HTMLElement>("[data-story-date]");
          const photo =
            chapter.querySelector<HTMLElement>("[data-story-photo]");
          const readingTargets = gsap.utils.toArray<HTMLElement>(
            "[data-story-intro], [data-story-paragraph], [data-story-footer]",
            chapter,
          );

          gsap.fromTo(
            titleLines,
            { yPercent: 105 },
            {
              yPercent: 0,
              stagger: 0.04,
              ease: "none",
              scrollTrigger: {
                trigger: chapter,
                start: "top 84%",
                end: "top 45%",
                scrub: 0.3,
              },
            },
          );

          if (date) {
            gsap.fromTo(
              date,
              { yPercent: 100 },
              {
                yPercent: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: date,
                  start: "top 92%",
                  end: "top 72%",
                  scrub: 0.25,
                },
              },
            );
          }

          if (photo) {
            gsap.fromTo(
              photo,
              { y: 48, scale: 0.94, rotation: 1.2 },
              {
                y: 0,
                scale: 1,
                rotation: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: photo,
                  start: "top 92%",
                  end: "top 44%",
                  scrub: 0.35,
                },
              },
            );
          }

          readingTargets.forEach((target) => {
            gsap.fromTo(
              target,
              { autoAlpha: 0, y: 28 },
              {
                autoAlpha: 1,
                y: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: target,
                  start: "top 92%",
                  end: "top 68%",
                  scrub: 0.25,
                },
              },
            );
          });
        });

        return () => {
          delete story.dataset.storyMotion;
        };
      },
    );

    return () => media.revert();
  }, []);

  return null;
}
