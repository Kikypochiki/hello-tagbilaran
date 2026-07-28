// @vitest-environment jsdom

import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MapPlaceChoice } from "@/components/explore/map-place-choice";
import { getPlace } from "@/content/places";

describe("map place choice", () => {
  let container: HTMLDivElement;
  let mountNode: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    (
      globalThis as typeof globalThis & {
        IS_REACT_ACT_ENVIRONMENT: boolean;
      }
    ).IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement("div");
    mountNode = document.createElement("div");
    document.body.append(container, mountNode);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    mountNode.remove();
  });

  it("offers a touch-safe panorama handoff alongside the desktop viewer", async () => {
    const place = getPlace("national-museum-bohol");
    expect(place).toBeDefined();

    await act(async () => {
      root.render(
        createElement(MapPlaceChoice, {
          place: place!,
          mountNode,
          onClose: vi.fn(),
          onDetails: vi.fn(),
          onStreetView: vi.fn(),
        }),
      );
    });

    const mobileLink = mountNode.querySelector<HTMLAnchorElement>(
      ".map-place-choice__street-view-mobile",
    );
    const desktopButton = mountNode.querySelector<HTMLButtonElement>(
      ".map-place-choice__street-view-desktop",
    );

    expect(mobileLink).not.toBeNull();
    expect(mobileLink?.target).toBe("_blank");
    expect(mobileLink?.rel).toContain("noopener");
    expect(new URL(mobileLink!.href).searchParams.get("map_action")).toBe(
      "pano",
    );
    expect(desktopButton?.textContent).toContain("Street View");
  });
});
