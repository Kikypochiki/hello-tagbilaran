import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Story remains within the viewport and offers direct navigation", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Hello Tagbilaran");
  await expect(page.locator('link[rel="icon"][href*="/icon.svg"]').first()).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Hello, Tagbilaran." })).toBeVisible();
  await expect(page.getByRole("link", { name: /Explore places/ })).toBeVisible();
  await expect(page.locator(".journal-cover__registration")).toHaveCount(0);
  await expect(page.locator(".journal-cover__postcard")).toHaveCount(0);
  await expect(page.locator(".cover-ambient")).toHaveCount(1);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  const guideLink = page
    .locator("[data-story-chapter]")
    .last()
    .getByRole("link", { name: /Enter the city atlas/ });
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await page.waitForTimeout(500);
  await expect(guideLink).toBeVisible();
  await guideLink.click();
  await expect(page).toHaveURL("/explore", { timeout: 15_000 });
});

test("Immersive field index opens and navigates between rooms", async ({ page }) => {
  await page.goto("/");

  const index = page.locator("details.experience-menu");
  const trigger = index.locator("summary");
  await expect(index).not.toHaveAttribute("open", "");
  await trigger.click();
  await expect(index).toHaveAttribute("open", "");
  await page.keyboard.press("Escape");
  await expect(index).not.toHaveAttribute("open", "");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.locator("main").click({ position: { x: 8, y: 8 } });
  await expect(index).not.toHaveAttribute("open", "");
  await trigger.click();
  await index.getByRole("link", { name: "Hazard assessment" }).click();

  await expect(page).toHaveURL(/\/hazard-assessment$/);
  await expect(page.getByRole("heading", { name: "Hazard assessment" })).toBeVisible();
});

test("Living archive goes directly from the cover into five focused chapters", async ({ page }) => {
  await page.goto("/");
  const chapters = page.locator("[data-story-chapter]");
  await expect(chapters).toHaveCount(5);
  await expect(page.getByText(/Read the city.*from shore to street/)).toHaveCount(0);
  await expect(page.locator(".story-portal")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Begin the experience/ })).toHaveAttribute(
    "href",
    `#${await chapters.first().getAttribute("id")}`,
  );
  await expect(page.getByText("Open object label")).toHaveCount(0);
  await expect(page.getByText("The story continues in the streets.")).toHaveCount(0);
  await expect(page.locator(".barangay-foldout")).toHaveCount(0);
  await expect(page.locator(".chapter-trace")).toHaveCount(0);
  await expect(page.locator(".chapter-title__image")).toHaveCount(0);
  await expect(page.locator(".archive-figure__echo")).toHaveCount(0);
  await expect(page.locator("[data-story-photo] img")).toHaveCount(5);
  await expect(page.locator("[data-story-photo]")).toHaveCount(5);
  await expect(page.locator(".story-thread")).toHaveCount(1);
  await expect(page.locator(".story-compass")).toHaveCount(0);
  expect(
    await chapters.evaluateAll((items) =>
      items.every((item) => item.querySelectorAll("[data-story-photo] img").length === 1),
    ),
  ).toBe(true);
  const chapterPresentation = await chapters.evaluateAll((items) =>
    items.map((item) => {
      const stage = item.querySelector<HTMLElement>("[data-story-stage] > div");
      const title = item.querySelector<HTMLElement>("h2");
      return {
        paper: stage ? getComputedStyle(stage).backgroundColor : "",
        ink: title ? getComputedStyle(title).color : "",
      };
    }),
  );
  expect(new Set(chapterPresentation.map(({ paper }) => paper)).size).toBe(1);
  expect(new Set(chapterPresentation.map(({ ink }) => ink)).size).toBe(1);
});

test("Editorial layers do not collide at responsive breakpoints", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.locator(".journal-cover__instruction")).toHaveCount(0);

  const coverContent = page.locator(".journal-cover__content");
  const layoutCenter = await page.evaluate(() => {
    const bodyBounds = document.body.getBoundingClientRect();
    return bodyBounds.left + bodyBounds.width / 2;
  });

  if (testInfo.project.name === "mobile") {
    const [navigatorHeight, navigatorTop] = await page.evaluate(() => {
      const navigator = document.querySelector<HTMLElement>(".archive-story__navigator");
      return [
        navigator?.getBoundingClientRect().height ?? 0,
        Number.parseFloat(getComputedStyle(navigator!).top),
      ] as const;
    });
    expect(navigatorHeight).toBeGreaterThanOrEqual(44);
    expect(navigatorTop).toBeGreaterThanOrEqual(60);
  } else {
    const contentBounds = await coverContent.boundingBox();
    expect(contentBounds).not.toBeNull();
    expect(
      Math.abs(
        (contentBounds?.x ?? 0) +
          (contentBounds?.width ?? 0) / 2 -
          layoutCenter,
      ),
    ).toBeLessThanOrEqual(2);
    await expect(page.locator("[data-story-stage]").first()).toHaveCSS(
      "position",
      "sticky",
    );

    const navigator = page.locator(".archive-story__navigator");
    await page.locator("[data-story-chapter]").first().scrollIntoViewIfNeeded();
    await expect(navigator).toHaveAttribute("data-within-story", "");

    const storyThread = page.locator(".story-thread");
    const chapterLabels = page.locator(".story-thread__label");
    await expect(chapterLabels).toHaveCount(5);
    await storyThread.hover();
    await expect(chapterLabels.first()).toBeVisible();
    await page.waitForTimeout(250);
    const labelOpacities = await chapterLabels.evaluateAll((labels) =>
      labels.map((label) => Number.parseFloat(getComputedStyle(label).opacity)),
    );
    expect(Math.max(...labelOpacities)).toBe(1);
    expect(Math.min(...labelOpacities)).toBeLessThan(0.5);
    await page.locator(".story-thread a").nth(1).focus();
    await expect(chapterLabels.nth(1)).toBeVisible();

    await page.locator(".site-footer").scrollIntoViewIfNeeded();
    await expect(navigator).not.toHaveAttribute("data-within-story", "");
  }

  await page.goto("/about");
  await expect(page.locator(".site-header")).toHaveCSS("position", "fixed");
});

test("Reduced motion keeps the story as a normal paper document", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Desktop progressive-enhancement check");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.locator(".archive-story")).not.toHaveAttribute(
    "data-story-motion",
    "desktop",
  );
  await expect(page.locator("[data-story-stage]").first()).toHaveCSS(
    "position",
    "relative",
  );
  const firstChapterHeight = await page
    .locator("[data-story-chapter]")
    .first()
    .evaluate((chapter) => chapter.getBoundingClientRect().height);
  expect(firstChapterHeight).toBeLessThan(
    (await page.evaluate(() => window.innerHeight)) * 3.5,
  );
});

test("Explore keeps a compact category index and stable URL filters", async ({
  page,
}, testInfo) => {
  await page.goto("/explore");
  const index = page.locator("details.map-index");
  const cityMap = page.locator(".map-canvas--city");
  await expect(page.locator(".site-footer")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollHeight - window.innerHeight,
    ),
  ).toBeLessThanOrEqual(1);
  await expect(cityMap).toHaveAttribute(
    "data-map-pitch",
    testInfo.project.name === "mobile" ? "28" : "38",
    { timeout: 15_000 },
  );
  await expect(cityMap).toHaveAttribute("data-buildings-ready", "true", {
    timeout: 15_000,
  });
  if (testInfo.project.name === "mobile") {
    await expect(page.getByRole("combobox", { name: "Explore display" })).toHaveCount(0);
    await expect(index).not.toHaveAttribute("open", "");
    const expectSeparatedMobileControls = async () => {
      const siteIndexBox = await page
        .locator(".experience-header__menu-trigger")
        .boundingBox();
      const mapNavigationBox = await page
        .locator(".maplibregl-ctrl-top-right .maplibregl-ctrl-group")
        .boundingBox();
      const mapIndexBox = await index.boundingBox();
      if (!siteIndexBox || !mapNavigationBox || !mapIndexBox) {
        throw new Error("Mobile map controls were not available for collision checks.");
      }
      expect(siteIndexBox.y + siteIndexBox.height).toBeLessThanOrEqual(
        mapNavigationBox.y,
      );
      expect(mapIndexBox.x + mapIndexBox.width).toBeLessThanOrEqual(
        mapNavigationBox.x,
      );
    };
    await expectSeparatedMobileControls();
    await page.setViewportSize({ width: 320, height: 740 });
    await expectSeparatedMobileControls();
  } else {
    await expect(index).toHaveAttribute("open", "");
    await index.locator("summary").click();
    await expect(index).not.toHaveAttribute("open", "");
  }
  const collapsedHeight = await index.evaluate(
    (element) => element.getBoundingClientRect().height,
  );
  expect(collapsedHeight).toBeLessThan(100);
  await index.locator("summary").click();
  await expect(index).toHaveAttribute("open", "");
  await expect(index.locator(".map-index__places")).toHaveCount(0);
  const historyCategory = page.getByRole("button", {
    name: /History & Culture.*Museums, monuments/,
  });
  await expect(historyCategory).toBeVisible();
  if (testInfo.project.name === "desktop") {
    await historyCategory.hover();
    await expect(historyCategory.locator("small")).toHaveCSS(
      "color",
      "rgba(255, 249, 235, 0.76)",
    );
  }
  await historyCategory.click();
  await expect(page).toHaveURL(/category=history-culture/);
  await page.getByRole("searchbox", { name: "Search by place or barangay" }).fill("museum");
  await expect(page).toHaveURL(/q=museum/);
  await expect(index.getByText(/places? highlighted/)).toBeVisible();
  await page.getByRole("button", { name: /Browse barangays/ }).click();
  const barangayDirectory = page.getByRole("dialog", {
    name: "Choose a barangay",
  });
  await expect(barangayDirectory).toBeVisible();
  await barangayDirectory.getByRole("button", { name: /Bool/ }).click();
  await expect(page).toHaveURL(/barangay=071242001/);
  expect(await page.evaluate(() => performance.getEntriesByType("navigation").length)).toBe(1);
});

test("Explore keeps the city model flat when reduced motion is requested", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/explore");
  await expect(page.locator(".map-canvas--city")).toHaveAttribute(
    "data-map-pitch",
    "0",
    { timeout: 15_000 },
  );
});

test("Explore keeps its useful overlays when the raster background is unavailable", async ({
  page,
}) => {
  const rasterErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && message.text().includes("tile.openstreetmap.org")) {
      rasterErrors.push(message.text());
    }
  });
  await page.route("https://tile.openstreetmap.org/**", (route) =>
    route.abort("internetdisconnected"),
  );
  await page.goto("/explore");
  const cityMap = page.locator(".map-canvas--city");
  await expect(cityMap).toHaveAttribute("data-map-background", "unavailable", {
    timeout: 15_000,
  });
  await expect(
    page
      .getByRole("status")
      .filter({
        hasText:
          "Map background unavailable. Place markers and boundaries remain usable.",
      }),
  ).toBeVisible();
  const statusBox = await page.locator(".map-canvas__network-status").boundingBox();
  const legendBox = await page.locator(".map-legend").boundingBox();
  if (!statusBox || !legendBox) {
    throw new Error("The map fallback or legend was unavailable for overlap checks.");
  }
  expect(statusBox.y + statusBox.height).toBeLessThanOrEqual(legendBox.y);
  expect(rasterErrors).toEqual([]);
});

test("Place descriptions stay in the map modal", async ({ page }) => {
  await page.goto("/explore?place=bq-mall");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("heading", { name: "About" })).toBeVisible();
  await expect(page.getByText(/View full place page/i)).toHaveCount(0);
  await expect(page.getByText(/Google Maps/i)).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Street View/ })).toHaveCount(0);
});

test("A point click opens its choice without reloading the page", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Desktop map regression check");
  await page.goto("/explore?q=National+Museum");
  const canvas = page.locator(".maplibregl-canvas");
  await expect(canvas).toBeVisible();
  await page.waitForTimeout(1_000);
  await canvas.hover();
  await page.mouse.wheel(0, -320);
  await expect(page.locator(".maplibregl-cooperative-gesture-screen")).toHaveCount(0);
  const bounds = await canvas.boundingBox();
  expect(bounds).not.toBeNull();
  await canvas.click({
    position: {
      x: Math.round((bounds?.width ?? 0) / 2),
      y: Math.round((bounds?.height ?? 0) / 2),
    },
  });
  await expect(page.locator(".map-place-choice")).toBeVisible();
  await expect(page.getByRole("button", { name: /Street View/ })).toBeVisible();
  expect(await page.evaluate(() => performance.getEntriesByType("navigation").length)).toBe(1);
});

test("Barangays remain selected after click", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Desktop map pointer regression check");
  await page.goto("/explore?q=no-such-place");
  const map = page.locator(".map-canvas");
  const canvas = page.locator(".maplibregl-canvas");
  await expect(canvas).toBeVisible();
  await page.waitForTimeout(500);
  const bounds = await canvas.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(
    Math.round((bounds?.x ?? 0) + (bounds?.width ?? 0) * 0.53),
    Math.round((bounds?.y ?? 0) + (bounds?.height ?? 0) * 0.35),
  );
  await page.mouse.down();
  await page.mouse.up();
  await expect(page).toHaveURL(/barangay=\d{9}/);
  await expect(map).toHaveAttribute("data-selected-barangay", /\d{9}/);
});

test("Barangay sheets remain shareable from the places map", async ({ page }) => {
  await page.goto("/explore?barangay=071242001");
  await expect(page.getByRole("heading", { name: "Bool" })).toBeVisible();
  await expect(page.getByRole("link", { name: /official city directory/ })).toBeVisible();
});

test("Hazard assessment is a shareable, source-conscious map workspace", async ({
  page,
}, testInfo) => {
  const hydrationErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && message.text().includes("hydrated")) {
      hydrationErrors.push(message.text());
    }
  });
  await page.goto("/hazard-assessment");
  await expect(page.locator(".site-footer")).toHaveCount(0);
  await expect(
    page.getByRole("region", { name: "Tagbilaran hazard assessment map" }),
  ).toBeVisible();
  if (testInfo.project.name === "mobile") {
    await page.locator(".hazard-map-index > summary").click();
  }
  await expect(page.getByRole("button", { name: /Flood.*100-year rainfall/ })).toBeVisible();
  await page.getByRole("button", { name: /Storm-surge/ }).click();
  await expect(page).toHaveURL(/hazard=storm-surge/);
  await page.getByLabel("Area").selectOption("071242001");
  await expect(page).toHaveURL(/barangay=071242001/);
  await expect(page.locator(".hazard-map-status")).toHaveAttribute(
    "data-state",
    "ready",
    { timeout: 15_000 },
  );
  await page.getByText("Source and limitations").click();
  await expect(page.getByRole("link", { name: /Verify with UP NOAH/ })).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  expect(hydrationErrors).toEqual([]);
});

test("About identifies the developer while support placeholders cannot be mistaken for payment details", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: "The hands behind the journal." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Dohn Michael Varquez" })).toBeVisible();
  await expect(page.getByText("Fourth-year Computer Science student at Visayas State University")).toBeVisible();
  await expect(page.getByRole("link", { name: "Visit GitHub profile" })).toHaveAttribute(
    "href",
    "https://github.com/Kikypochiki",
  );
  await expect(page.getByText(/This development QR cannot be scanned/)).toBeVisible();
  await expect(page.getByRole("link", { name: /secure donation/i })).toHaveCount(0);
  await expect(page.getByLabel("Project principles carousel")).toHaveCount(0);
});

test("Representative routes have no serious automated accessibility violations", async ({
  page,
}) => {
  test.setTimeout(180_000);
  for (const route of ["/", "/explore", "/hazard-assessment", "/about"]) {
    await page.goto(route);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter(
        (item) => item.impact === "serious" || item.impact === "critical",
      ),
    ).toEqual([]);
  }
});
