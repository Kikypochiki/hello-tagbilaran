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
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  const guideLink = page.getByRole("link", { name: "Continue to city guide" });
  await guideLink.scrollIntoViewIfNeeded();
  await expect(guideLink).toBeVisible();
  await guideLink.click();
  await expect(page).toHaveURL("/explore", { timeout: 15_000 });
});

test("Living archive keeps five distinct readable scenes and a neighborhood foldout", async ({ page }) => {
  await page.goto("/");
  const chapters = page.locator(".history-chapter[data-visual-mode]");
  await expect(chapters).toHaveCount(5);
  expect(await chapters.evaluateAll((items) => new Set(items.map((item) => item.getAttribute("data-visual-mode"))).size)).toBe(5);
  await expect(page.getByRole("heading", { name: /Meet the city, neighborhood by neighborhood/ })).toBeVisible();
  await expect(page.locator(".barangay-foldout li")).toHaveCount(15);
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
  await expect(page.getByText("Selected map stop")).toBeVisible();
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
