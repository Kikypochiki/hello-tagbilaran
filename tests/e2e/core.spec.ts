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
  const guideLink = page.getByRole("link", { name: "Enter the city atlas" }).last();
  await guideLink.scrollIntoViewIfNeeded();
  await expect(guideLink).toBeVisible();
  await guideLink.click();
  await expect(page).toHaveURL("/explore", { timeout: 15_000 });
});

test("Immersive field index opens and navigates between rooms", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Index" }).click();

  const index = page.getByRole("dialog", { name: "Index" });
  await expect(index).toBeVisible();
  await index.getByRole("link", { name: "Hazard assessment" }).click();

  await expect(page).toHaveURL(/\/hazard-assessment$/);
  await expect(page.getByRole("heading", { name: "Hazard assessment" })).toBeVisible();
});

test("Living archive goes directly from the cover into five focused chapters", async ({ page }) => {
  await page.goto("/");
  const chapters = page.locator(".archive-chapter");
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
  await expect(page.locator(".archive-chapter__figure img")).toHaveCount(5);
  await expect(page.locator(".archive-chapter__polaroid")).toHaveCount(5);
  await expect(page.locator(".story-thread")).toHaveCount(1);
  await expect(page.locator(".story-compass")).toHaveCount(0);
  expect(
    await chapters.evaluateAll((items) =>
      items.every((item) => item.querySelectorAll(".archive-chapter__figure img").length === 1),
    ),
  ).toBe(true);
  const chapterPresentation = await chapters.evaluateAll((items) =>
    items.map((item) => {
      const stage = item.querySelector<HTMLElement>(".archive-chapter__paper");
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
    await expect(page.locator(".archive-chapter__scene").first()).toHaveCSS(
      "position",
      "sticky",
    );

    const navigator = page.locator(".archive-story__navigator");
    await page.locator(".archive-chapter").first().scrollIntoViewIfNeeded();
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

  await expect(page.locator(".archive-story")).not.toHaveAttribute("data-motion", "ready");
  await expect(page.locator(".archive-chapter__scene").first()).toHaveCSS(
    "position",
    "relative",
  );
  const firstChapterHeight = await page
    .locator(".archive-chapter")
    .first()
    .evaluate((chapter) => chapter.getBoundingClientRect().height);
  expect(firstChapterHeight).toBeLessThan(
    (await page.evaluate(() => window.innerHeight)) * 1.9,
  );
});

test("Explore keeps list access, URL filters, and stable navigation", async ({
  page,
}, testInfo) => {
  await page.goto("/explore");
  if (testInfo.project.name === "mobile") {
    await expect(page.getByRole("combobox", { name: "Explore display" })).toHaveCount(0);
    const index = page.locator("details.map-index");
    await expect(index).not.toHaveAttribute("open", "");
    await index.locator("summary").click();
    await expect(index).toHaveAttribute("open", "");
    const indexBody = index.locator(".map-index__body");
    const listDimensions = await indexBody.evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    }));
    expect(listDimensions.scrollHeight).toBeGreaterThan(listDimensions.clientHeight);
    await indexBody.evaluate((element) => element.scrollTo({ top: 600 }));
    await expect
      .poll(() => indexBody.evaluate((element) => element.scrollTop))
      .toBeGreaterThan(0);
  }
  await page.getByPlaceholder("Name, barangay, or category").fill("museum");
  await expect(page).toHaveURL(/q=museum/);
  const museumLink = page
    .locator("a.map-index__place-link")
    .filter({ hasText: "National Museum of the Philippines" });
  await expect(museumLink).toBeVisible();
  await museumLink.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(await page.evaluate(() => performance.getEntriesByType("navigation").length)).toBe(1);
});

test("Only reviewed Street View actions are exposed", async ({ page }, testInfo) => {
  await page.goto("/places/plaza-rizal");
  await expect(page.getByText(/Sources reviewed/).first()).toBeVisible();
  await page.goto("/explore?q=BQ+Mall");
  if (testInfo.project.name === "mobile") {
    await page.locator("details.map-index > summary").click();
  }
  await page
    .locator("a.map-index__place-link")
    .filter({ hasText: "Bohol Quality Mall" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
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

test("Hazard assessment has a dedicated, shareable, source-conscious workspace", async ({ page }) => {
  await page.goto("/hazard-assessment");
  await expect(page.getByRole("heading", { name: "Hazard assessment" })).toBeVisible();
  await expect(page.getByText(/No substitute polygons/)).toBeVisible();
  await page.getByRole("button", { name: "Storm-surge" }).click();
  await expect(page).toHaveURL(/hazard=storm-surge/);
  await page.getByLabel("Assessment area").selectOption("071242001");
  await expect(page).toHaveURL(/barangay=071242001/);
  await expect(page.getByRole("heading", { name: "No local classification issued" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Continue to UP NOAH/ })).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  const titleBounds = await page.getByRole("heading", { name: "Hazard assessment" }).boundingBox();
  expect(titleBounds).not.toBeNull();
  expect((titleBounds?.x ?? 0) + (titleBounds?.width ?? 0)).toBeLessThanOrEqual(
    await page.evaluate(() => document.documentElement.clientWidth),
  );
});

test("About and support placeholders cannot be mistaken for payment details", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: "The hands behind the journal." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Developer profile pending" })).toBeVisible();
  await expect(page.getByText(/This development QR cannot be scanned/)).toBeVisible();
  await expect(page.getByRole("link", { name: /secure donation/i })).toHaveCount(0);
});

test("Representative routes have no serious automated accessibility violations", async ({
  page,
}) => {
  test.setTimeout(180_000);
  for (const route of ["/", "/explore", "/hazard-assessment", "/about", "/places/plaza-rizal"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter(
        (item) => item.impact === "serious" || item.impact === "critical",
      ),
    ).toEqual([]);
  }
});
