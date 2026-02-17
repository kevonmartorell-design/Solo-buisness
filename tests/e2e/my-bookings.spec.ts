
import { test, expect } from '@playwright/test';

test.describe('My Bookings Page', () => {
    // We can't easily login in this environment without a seeded user, 
    // but we can check if the route is protected or redirects to login.
    // If we had a mock user, we would test the content.
    // For now, let's verify it redirects to login when unauthenticated, 
    // which confirms the route behaves as a protected route.

    test('redirects to login if not authenticated', async ({ page }) => {
        await page.goto('/my-bookings');
        await expect(page).toHaveURL(/\/login/);
    });

    // If we could login, we would test:
    // test('displays upcoming and past tabs', async ({ page }) => { ... });
});
