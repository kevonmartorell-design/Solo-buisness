import { test, expect } from '@playwright/test';

test.describe('Signup Flow Audit', () => {

    test('Tier 1: Client (Free) Signup', async ({ page }) => {
        // 1. Navigate to Client Signup
        await page.goto('/signup?tier=free');

        // 2. Verify Tier Selection
        // The badge text might be "Client Account" or similar. Checking loosely.
        await expect(page.getByText('Client Account')).toBeVisible();

        // 3. Fill Form
        const uniqueId = Date.now();
        await page.locator('input[name="fullName"]').fill('Test Client');
        await page.locator('input[name="email"]').fill(`client_${uniqueId}@test.com`);
        await page.locator('input[name="password"]').fill('Password123!');

        // 4. Submit
        await page.locator('button[type="submit"]').click();

        // 5. Verify Redirect to Dashboard
        await expect(page).toHaveURL(/.*dashboard/);
        // Optional: Verify dashboard content
        // await expect(page.getByText('Overview')).toBeVisible(); 
    });

    test('Tier 2: Solo Signup', async ({ page }) => {
        // 1. Navigate to Solo Signup
        await page.goto('/signup?tier=solo');

        // 2. Verify Tier Selection
        await expect(page.getByText('Solo / Small Team')).toBeVisible();

        // 3. Fill Form
        const uniqueId = Date.now();
        await page.locator('input[name="fullName"]').fill('Test Solo');
        await page.locator('input[name="email"]').fill(`solo_${uniqueId}@test.com`);
        await page.locator('input[name="password"]').fill('Password123!');

        // 4. Submit
        await page.locator('button[type="submit"]').click();

        // 5. Verify Redirect to Onboarding
        await expect(page).toHaveURL(/.*onboarding/);
        await expect(page.getByText('Setup Your Business')).toBeVisible();
    });

    test('Tier 3: Business Signup', async ({ page }) => {
        // 1. Navigate to Business Signup
        await page.goto('/signup?tier=business');

        // 2. Verify Tier Selection
        await expect(page.getByText('Business Scale')).toBeVisible();

        // 3. Fill Form
        const uniqueId = Date.now();
        await page.locator('input[name="fullName"]').fill('Test Business');
        await page.locator('input[name="email"]').fill(`business_${uniqueId}@test.com`);
        await page.locator('input[name="password"]').fill('Password123!');

        // 4. Submit
        await page.locator('button[type="submit"]').click();

        // 5. Verify Redirect to Onboarding
        await expect(page).toHaveURL(/.*onboarding/);
        await expect(page.getByText('Setup Your Business')).toBeVisible();
    });

});
