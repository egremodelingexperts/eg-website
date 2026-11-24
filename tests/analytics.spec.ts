import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const productionOrigin = "https://egremodelingexperts.com";
const localOrigin = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4321";
const preferenceKey = "eg-analytics-choice-v1";
const measurementId = "G-QMMK4NPT6J";
const clarityId = "zf68ijcacm";

test.beforeEach(async ({ page, request }) => {
  // Serve this checkout at its production origin to exercise the hostname guard.
  await page.route(`${productionOrigin}/**`, async (route) => {
    const url = new URL(route.request().url());
    const response = await request.get(new URL(url.pathname + url.search, localOrigin).href);
    await route.fulfill({ response });
  });
  await page.route("https://docs.google.com/**", (route) =>
    route.fulfill({ contentType: "text/html", body: "<p>Consultation form test</p>" }),
  );
  // Exercise our loader without transmitting test traffic to either vendor.
  await page.route(/https:\/\/(www\.googletagmanager\.com|www\.clarity\.ms)\//, (route) =>
    route.fulfill({ contentType: "application/javascript", body: "" }),
  );
});

test("analytics starts only after consent, remembers decline, and can be withdrawn", async ({
  page,
}, testInfo) => {
  const vendorRequests: string[] = [];
  page.on("request", (request) => {
    if (/googletagmanager\.com|clarity\.ms/.test(request.url())) vendorRequests.push(request.url());
  });
  await page.goto(productionOrigin + "/");
  const panel = page.locator("[data-analytics-consent]");
  await expect(panel).toBeVisible();
  expect(vendorRequests).toEqual([]);
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(
    accessibility.violations.filter((v) => ["serious", "critical"].includes(v.impact ?? "")),
  ).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("analytics-consent.png") });
  await page.getByRole("button", { name: "Decline", exact: true }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Analytics settings" })).toBeVisible();
  await expect(panel).toBeHidden();
  expect(vendorRequests).toEqual([]);

  await page.getByRole("button", { name: "Analytics settings" }).click();
  await expect(page.getByRole("heading", { name: "Website analytics" })).toBeFocused();
  await page.getByRole("button", { name: "Allow analytics" }).click();
  await expect.poll(() => vendorRequests.length).toBe(2);
  expect(vendorRequests).toContain(`https://www.googletagmanager.com/gtag/js?id=${measurementId}`);
  expect(vendorRequests).toContain(`https://www.clarity.ms/tag/${clarityId}`);

  await page.getByRole("button", { name: "Analytics settings" }).click();
  await page.getByRole("button", { name: "Allow analytics" }).click();
  expect(vendorRequests).toHaveLength(2);
  await page.getByRole("button", { name: "Analytics settings" }).click();
  await Promise.all([
    page.waitForEvent("domcontentloaded"),
    page.getByRole("button", { name: "Decline", exact: true }).click(),
  ]);
  await expect(page.getByRole("button", { name: "Analytics settings" })).toBeVisible();
  expect(vendorRequests).toHaveLength(2);
  expect(await page.evaluate((key) => localStorage.getItem(key), preferenceKey)).toBe("declined");
});

test("events use the configured stream without query strings, contact details, or false leads", async ({
  page,
}) => {
  await page.addInitScript((key) => localStorage.setItem(key, "accepted"), preferenceKey);
  await page.goto(productionOrigin + "/consultation/?email=visitor%40example.com#private");
  await expect(page.getByRole("button", { name: "Analytics settings" })).toBeVisible();
  await expect(page.locator('script[src*="clarity.ms/tag"]')).toHaveCount(0);
  const readCommands = () =>
    page.evaluate(() => {
      const data = (window as Window & { dataLayer?: IArguments[] }).dataLayer ?? [];
      return data.map((entry) => Array.from(entry));
    });
  let commands = await readCommands();
  expect(commands.filter((entry) => entry[0] === "config")).toHaveLength(1);
  expect(commands.find((entry) => entry[0] === "config")?.[1]).toBe(measurementId);
  expect(JSON.stringify(commands)).not.toContain("visitor");
  expect(JSON.stringify(commands)).not.toContain("#private");

  // Cancel the operating system's phone/email handoff after our click handler runs.
  await page.evaluate(() => window.addEventListener("click", (e) => e.preventDefault()));
  await page.locator('footer a[href^="tel:"]').click();
  await page.locator('footer a[href^="mailto:"]').click();
  commands = await readCommands();
  expect(commands.filter((entry) => entry[0] === "event").map((entry) => entry[1])).toEqual([
    "consultation_start",
    "click_phone",
    "click_email",
  ]);
  expect(JSON.stringify(commands)).not.toContain("egpaintingandmore");
  expect(JSON.stringify(commands)).not.toContain("generate_lead");

  await page.goto(productionOrigin + "/portfolio/");
  await expect(page.getByRole("button", { name: "Analytics settings" })).toBeVisible();
  expect((await readCommands()).filter((entry) => entry[1] === "view_portfolio")).toHaveLength(1);
});

test("development traffic is excluded even with a saved opt-in", async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, "accepted"), preferenceKey);
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator("[data-analytics-consent]")).toBeHidden();
  await expect(
    page.locator('script[src*="googletagmanager.com"], script[src*="clarity.ms/tag"]'),
  ).toHaveCount(0);
});
