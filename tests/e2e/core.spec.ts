import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Story remains within the viewport and offers direct navigation", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Hello, Tagbilaran." })).toBeVisible();
  await expect(page.getByRole("link", { name: /Explore places/ })).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("Explore keeps list access, URL filters, and stable navigation", async ({
  page,
}, testInfo) => {
  await page.goto("/explore?view=list");
  if (testInfo.project.name === "mobile") {
    await expect(page.getByRole("button", { name: "List" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
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

test("Only reviewed Street View actions are exposed", async ({ page }) => {
  await page.goto("/places/national-museum-bohol");
  await expect(page.getByText(/Sources reviewed/).first()).toBeVisible();
  await page.goto("/explore?view=list&q=BQ+Mall");
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

test("Representative routes have no serious automated accessibility violations", async ({
  page,
}) => {
  for (const route of ["/", "/explore?view=list", "/places/plaza-rizal"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter(
        (item) => item.impact === "serious" || item.impact === "critical",
      ),
    ).toEqual([]);
  }
});
