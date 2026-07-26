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
        const revealTargets = gsap.utils.toArray<HTMLElement>(
          ".developer-spread, .support-spread, .hazard-step, .hazard-map, .hazard-result",
        );

        revealTargets.forEach((target) => {
          gsap.fromTo(
            target,
            {
              y: 24,
            },
            {
              y: 0,
              duration: 0.72,
              ease: "power3.out",
              clearProps: "transform",
              scrollTrigger: {
                trigger: target,
                start: "top 92%",
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
