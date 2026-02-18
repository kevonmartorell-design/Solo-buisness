
import { test, expect } from '@playwright/test';

// Mock data (or we can use environmental vars if set up, but for now we expect seed data or we create it)
// Ideally, we need a known Organization ID. 
// Since we can't easily seed from Playwright without direct DB access or API, we might need a workaround.
// However, the previous tests logged in. We can log in, get the Org ID from Profile, then visit the public link.

test.describe('Public Booking Flow', () => {
    let orgId: string;

    test.beforeAll(async ({ browser }) => {
        // Login as Business User to get Org ID
        const context = await browser.newContext();
        const page = await context.newPage();

        // Login using Fast Track to ensure account exists and has Org
        await page.goto('http://localhost:5173/login');
        // Click the fast track button
        await page.click('button:has-text("Fast Track")');

        // Wait for dashboard
        await page.waitForURL('**/dashboard');

        // 1. Create a Service (ensure one exists)
        await page.goto('http://localhost:5173/services');
        // Open Add Modal (floating button)
        await page.click('button.fixed.right-6');

        // Fill Form
        await page.fill('input[placeholder*="New Service"]', 'Consultation');
        await page.fill('input[placeholder="0.00"]', '100');
        await page.fill('input[placeholder="60"]', '60');
        await page.click('button:has-text("Add Item")');

        // Wait for it to appear in list
        await page.waitForSelector('h3:has-text("Consultation")');

        // Navigate to profile to see the link and get Org ID
        await page.goto('http://localhost:5173/profile');

        // Wait for the booking link to appear
        const linkLocator = page.locator('p[data-org-id]');
        await linkLocator.waitFor({ state: 'visible', timeout: 10000 });

        // Extract Org ID from attribute
        orgId = await linkLocator.getAttribute('data-org-id') as string;
        console.log('Found Org ID from DOM:', orgId);

        await context.close();
    });

    test('Public client can book a service', async ({ page }) => {
        // 1. Visit Public Booking Page
        expect(orgId).toBeDefined();
        await page.goto(`http://localhost:5173/booking/${orgId}`);

        // 2. Select Service
        // Wait for services to load
        await expect(page.locator('h3', { hasText: 'Consultation' }).first()).toBeVisible({ timeout: 10000 });
        // Click the first service
        await page.click('div.group:first-child');

        // 3. Select Date & Time
        await expect(page.getByText('Select Time')).toBeVisible();
        await page.click('button:has-text("10:00")'); // Select 10am

        // 4. Enter Details
        await expect(page.getByText('Your Details')).toBeVisible();
        await page.fill('input[type="text"][placeholder="John Doe"]', 'Public Client Test');
        await page.fill('input[type="email"]', `public.client.${Date.now()}@test.com`);
        await page.fill('input[type="tel"]', '555-0199');
        await page.fill('textarea', 'This is an automated test booking.');

        // 5. Submit
        await page.click('button:has-text("Confirm Booking")');

        // 6. Verify Success
        await expect(page.getByText('Booking Requested!')).toBeVisible();
        await expect(page.getByText('Thanks Public Client Test')).toBeVisible();
    });

});
