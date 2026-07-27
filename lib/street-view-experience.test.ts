// @vitest-environment jsdom

import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StreetViewExperience } from "@/components/explore/street-view-experience";
import { getPlace } from "@/content/places";

describe("Street View experience", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    });
    (
      globalThis as typeof globalThis & {
        IS_REACT_ACT_ENVIRONMENT: boolean;
      }
    ).IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    vi.useRealTimers();
  });

  it("keeps the map approach visible before revealing the loaded panorama", async () => {
    const place = getPlace("national-museum-bohol");
    const onClose = vi.fn();
    expect(place).toBeDefined();

    await act(async () => {
      root.render(
        createElement(StreetViewExperience, {
          place: place!,
          onClose,
        }),
      );
    });

    const experience = container.querySelector<HTMLElement>(
      ".street-view-experience",
    );
    const iframe = container.querySelector("iframe");
    expect(experience?.dataset.stage).toBe("zooming");
    expect(experience?.getAttribute("role")).toBe("dialog");
    expect(container.textContent).toContain(
      "Moving from the city atlas to the street.",
    );

    await act(async () => {
      iframe?.dispatchEvent(new Event("load"));
      vi.advanceTimersByTime(900);
    });
    expect(experience?.dataset.stage).toBe("loading");

    await act(async () => {
      vi.advanceTimersByTime(320);
    });
    expect(experience?.dataset.stage).toBe("ready");
    expect(container.textContent).toContain("Drag to look around");

    await act(async () => {
      container
        .querySelector<HTMLButtonElement>('button[aria-label="Go back to map"]')
        ?.click();
    });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("removes the spatial delay when reduced motion is requested", async () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    });
    const place = getPlace("national-museum-bohol");
    expect(place).toBeDefined();

    await act(async () => {
      root.render(
        createElement(StreetViewExperience, {
          place: place!,
          onClose: vi.fn(),
        }),
      );
    });

    await act(async () => {
      container.querySelector("iframe")?.dispatchEvent(new Event("load"));
      vi.runAllTimers();
    });

    expect(
      container.querySelector<HTMLElement>(".street-view-experience")?.dataset
        .stage,
    ).toBe("ready");
  });
});
