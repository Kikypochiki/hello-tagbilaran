"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import type { ImageAsset } from "@/types/content";

gsap.registerPlugin(useGSAP);

export function InteractiveArchiveFigure({ media }: { media: ImageAsset }) {
  const figureRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const figure = figureRef.current;
      if (
        !figure ||
        prefersReducedMotion() ||
        !window.matchMedia("(hover: hover) and (pointer: fine)").matches
      ) {
        return;
      }

      gsap.set(figure, {
        transformPerspective: 1400,
        transformStyle: "preserve-3d",
        transformOrigin: "50% 50%",
      });

      const rotateX = gsap.quickTo(figure, "rotationX", {
        duration: 0.55,
        ease: "power3.out",
      });
      const rotateY = gsap.quickTo(figure, "rotationY", {
        duration: 0.55,
        ease: "power3.out",
      });
      const lift = gsap.quickTo(figure, "y", {
        duration: 0.55,
        ease: "power3.out",
      });
      const scale = gsap.quickTo(figure, "scale", {
        duration: 0.55,
        ease: "power3.out",
      });

      const move = (event: PointerEvent) => {
        const bounds = figure.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;

        rotateX(y * -7);
        rotateY(x * 8);
        lift(-5);
        scale(1.012);
      };

      const reset = () => {
        rotateX(0);
        rotateY(0);
        lift(0);
        scale(1);
      };

      figure.addEventListener("pointermove", move);
      figure.addEventListener("pointerleave", reset);

      return () => {
        figure.removeEventListener("pointermove", move);
        figure.removeEventListener("pointerleave", reset);
      };
    },
    { scope: figureRef },
  );

  return (
    <figure className="archive-figure" ref={figureRef}>
      <div className="archive-figure__image">
        <Image
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          sizes="(max-width: 780px) 88vw, (max-width: 1060px) 68vw, 42vw"
          loading="lazy"
        />
      </div>
      <figcaption>
        Photo: {media.credit ?? "Credit not supplied"}
        {media.date ? ` · ${media.date}` : null}
      </figcaption>
    </figure>
  );
}
