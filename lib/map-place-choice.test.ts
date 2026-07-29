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

  it("opens the same in-site panorama viewer on mobile and desktop", async () => {
    const place = getPlace("national-museum-bohol");
    const onStreetView = vi.fn();
    expect(place).toBeDefined();

    await act(async () => {
      root.render(
        createElement(MapPlaceChoice, {
          place: place!,
          mountNode,
          onClose: vi.fn(),
          onDetails: vi.fn(),
          onStreetView,
        }),
      );
    });

    const streetViewButton = Array.from(
      mountNode.querySelectorAll<HTMLButtonElement>("button"),
    ).find((button) => button.textContent?.includes("Street View"));

    expect(streetViewButton).toBeDefined();
    await act(async () => streetViewButton?.click());
    expect(onStreetView).toHaveBeenCalledOnce();
    expect(mountNode.querySelector('a[href*="google.com/maps"]')).toBeNull();
  });
});
