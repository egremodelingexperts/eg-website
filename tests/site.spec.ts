import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = ["/", "/portfolio/", "/reviews/", "/consultation/", "/privacy/"];

for (const route of routes) {
  test(`${route} renders without console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    expect(errors).toEqual([]);
  });

  test(`${route} has no critical accessibility violations`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) =>
      ["critical", "serious"].includes(violation.impact ?? ""),
    );
    expect(serious).toEqual([]);
  });
}

test("mobile navigation opens, closes with Escape, and exposes primary links", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open navigation menu" });
  await toggle.click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeHidden();
  await expect(toggle).toBeFocused();
});

test("portfolio carousels support controls and keyboard navigation", async ({ page }) => {
  await page.goto("/portfolio/");
  const carousel = page.getByRole("region", { name: "Kitchen Remodeling project gallery" });
  await expect(carousel.getByText("Image 1 of 3")).toBeAttached();
  await carousel.getByRole("button", { name: "Next image" }).click();
  await expect(carousel.getByText("Image 2 of 3")).toBeAttached();
  await carousel.focus();
  await page.keyboard.press("ArrowRight");
  await expect(carousel.getByText("Image 3 of 3")).toBeAttached();
});

test("portfolio lightbox opens, navigates, and closes with Escape", async ({ page }) => {
  await page.goto("/portfolio/");
  await page
    .getByRole("button", { name: /View larger image:/ })
    .first()
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Next image" }).click();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("consultation preview exposes direct contact options while form is pending", async ({
  page,
}) => {
  await page.goto("/consultation/");
  await expect(page.locator("[data-form-placeholder]")).toBeVisible();
  await expect(page.getByRole("link", { name: /Call \(817\) 862-1380/ })).toHaveAttribute(
    "href",
    "tel:+18178621380",
  );
});

test("legacy routes point visitors to their replacement pages", async ({ request }) => {
  const response = await request.get("/blank/");
  expect(response.ok()).toBeTruthy();
  expect(await response.text()).toContain(
    '<link rel="canonical" href="https://egremodelingexperts.com/reviews/">',
  );
});
