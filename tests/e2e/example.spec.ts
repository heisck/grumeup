import { expect, test } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load and display the GrumeUp heading", async ({ page }) => {
    await page.goto("/");

    // Verify the main heading is visible
    const heading = page.getByRole("heading", { name: /grumeup/i });
    await expect(heading).toBeVisible();

    // Verify the page title
    await expect(page).toHaveTitle(/grumeup/i);
  });

  test("should display technology badges", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Next.js 16")).toBeVisible();
    await expect(page.getByText("TypeScript Strict")).toBeVisible();
    await expect(page.getByText("Turborepo")).toBeVisible();
  });
});
