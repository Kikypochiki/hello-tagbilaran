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
      const pointerCleanups: Array<() => void> = [];

      chapters.forEach((chapter, index) => {
        const paper = chapter.querySelector<HTMLElement>(".archive-chapter__paper");
        const heading = chapter.querySelector<HTMLElement>(".archive-chapter__heading");
        const figure = chapter.querySelector<HTMLElement>(".archive-chapter__figure");
        const polaroid = chapter.querySelector<HTMLElement>(
          ".archive-chapter__polaroid",
        );
        const polaroidSurface = chapter.querySelector<HTMLElement>(
          ".archive-chapter__polaroid-surface",
        );
        const image = chapter.querySelector<HTMLElement>(".archive-chapter__image img");
        const copy = chapter.querySelector<HTMLElement>(".archive-chapter__copy");
        const footer = chapter.querySelector<HTMLElement>(".archive-chapter__footer");

        if (
          !paper ||
          !heading ||
          !figure ||
          !polaroid ||
          !polaroidSurface ||
          !image ||
          !copy ||
          !footer
        ) {
          return;
        }

        const direction = index % 2 === 0 ? 1 : -1;

        gsap.set(paper, {
          yPercent: 2,
          rotationX: 0.55,
        });
        gsap.set(heading, { y: 28 });
        gsap.set(polaroid, {
          xPercent: direction * 3,
          y: 36,
          rotation: direction * 2.2,
          rotationY: direction * 4,
          rotationX: 1.2,
        });
        gsap.set(image, { scale: 1.035 });
        gsap.set(copy, { y: 22 });
        gsap.set(footer, { y: 14 });

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
          .to(
            paper,
            {
              yPercent: 0,
              rotationX: 0,
              duration: 0.34,
            },
            0,
          )
          .to(heading, { y: 0, duration: 0.34 }, 0)
          .to(
            polaroid,
            {
              xPercent: 0,
              y: 0,
              rotation: direction * 0.7,
              rotationY: 0,
              rotationX: 0,
              duration: 0.56,
            },
            0.04,
          )
          .to(image, { scale: 1, duration: 0.56 }, 0.04)
          .to(copy, { y: 0, duration: 0.3 }, 0.34)
          .to(footer, { y: 0, duration: 0.22 }, 0.5);

        const tiltToX = gsap.quickTo(polaroidSurface, "rotationX", {
          duration: 0.55,
          ease: "power3.out",
        });
        const tiltToY = gsap.quickTo(polaroidSurface, "rotationY", {
          duration: 0.55,
          ease: "power3.out",
        });
        const liftToZ = gsap.quickTo(polaroidSurface, "z", {
          duration: 0.55,
          ease: "power3.out",
        });

        const handlePointerMove = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          const bounds = polaroidSurface.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width - 0.5;
          const y = (event.clientY - bounds.top) / bounds.height - 0.5;
          tiltToX(y * -2.5);
          tiltToY(x * 3);
          liftToZ(6);
        };

        const resetPointerTilt = () => {
          tiltToX(0);
          tiltToY(0);
          liftToZ(0);
        };

        polaroidSurface.addEventListener("pointermove", handlePointerMove);
        polaroidSurface.addEventListener("pointerleave", resetPointerTilt);

        pointerCleanups.push(() => {
          polaroidSurface.removeEventListener("pointermove", handlePointerMove);
          polaroidSurface.removeEventListener("pointerleave", resetPointerTilt);
        });
      });

      return () => {
        pointerCleanups.forEach((cleanup) => cleanup());
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
          { y: 28 },
          {
            y: 0,
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
