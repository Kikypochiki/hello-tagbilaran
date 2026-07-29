"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(useGSAP);

export function CoverAmbient() {
  const ambientRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const ambient = ambientRef.current;
      const cover = ambient?.parentElement;
      if (!ambient || !cover || prefersReducedMotion()) return;

      const light = ambient.querySelector<HTMLElement>(".cover-ambient__light");
      const parallaxLayers = gsap.utils.toArray<HTMLElement>(
        ".cover-ambient__parallax",
        ambient,
      );
      const washes = gsap.utils.toArray<HTMLElement>(".cover-ambient__wash", ambient);

      const lightX = light
        ? gsap.quickTo(light, "x", { duration: 0.9, ease: "power3.out" })
        : null;
      const lightY = light
        ? gsap.quickTo(light, "y", { duration: 0.9, ease: "power3.out" })
        : null;
      const layerX = parallaxLayers.map((layer) =>
        gsap.quickTo(layer, "x", { duration: 1.15, ease: "power3.out" }),
      );
      const layerY = parallaxLayers.map((layer) =>
        gsap.quickTo(layer, "y", { duration: 1.15, ease: "power3.out" }),
      );

      const drift = gsap.to(washes, {
        yPercent: (index) => (index % 2 === 0 ? 6 : -5),
        rotate: (index) => (index % 2 === 0 ? 1.2 : -0.9),
        duration: (index) => 8 + index * 1.6,
        stagger: 0.7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      const move = (event: PointerEvent) => {
        const bounds = cover.getBoundingClientRect();
        const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
        const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;

        lightX?.(normalizedX * 120);
        lightY?.(normalizedY * 90);
        layerX.forEach((moveLayer, index) => moveLayer(normalizedX * (12 + index * 8)));
        layerY.forEach((moveLayer, index) => moveLayer(normalizedY * (9 + index * 6)));
      };

      const reset = () => {
        lightX?.(0);
        lightY?.(0);
        layerX.forEach((moveLayer) => moveLayer(0));
        layerY.forEach((moveLayer) => moveLayer(0));
      };

      cover.addEventListener("pointermove", move);
      cover.addEventListener("pointerleave", reset);

      return () => {
        drift.kill();
        cover.removeEventListener("pointermove", move);
        cover.removeEventListener("pointerleave", reset);
      };
    },
    { scope: ambientRef },
  );

  return (
    <div className="cover-ambient" ref={ambientRef} aria-hidden="true">
      <div className="cover-ambient__light" />
      <div className="cover-ambient__parallax cover-ambient__parallax--sea">
        <span className="cover-ambient__wash cover-ambient__wash--sea" />
      </div>
      <div className="cover-ambient__parallax cover-ambient__parallax--sun">
        <span className="cover-ambient__wash cover-ambient__wash--sun" />
      </div>
      <div className="cover-ambient__grain" />
    </div>
  );
}
