"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export function GlobalMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const pageLead = document.querySelector<HTMLElement>(
          ".about-cover, .hazard-assessment__cover, .place-detail__header",
        );

        if (pageLead) {
          gsap.fromTo(
            pageLead,
            { clipPath: "inset(0 0 100% 0)" },
            {
              clipPath: "inset(0 0 0% 0)",
              duration: 1.05,
              ease: "power3.inOut",
              clearProps: "clipPath",
            },
          );
        }

        const revealTargets = gsap.utils.toArray<HTMLElement>(
          ".developer-spread, .support-spread, .hazard-step, .hazard-map, .hazard-result, .place-detail__body > *, .source-sheet",
        );

        revealTargets.forEach((target) => {
          gsap.fromTo(
            target,
            {
              clipPath: "inset(0 0 16% 0)",
              y: 42,
            },
            {
              clipPath: "inset(0 0 0% 0)",
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              clearProps: "clipPath,transform",
              scrollTrigger: {
                trigger: target,
                start: "top 88%",
                once: true,
              },
            },
          );
        });

      });

    });

    return () => {
      media.revert();
      context.revert();
    };
  }, [pathname]);

  return null;
}
