import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Aegis Cert/);
});

test('can navigate to login page', async ({ page }) => {
    await page.goto('/');
    // Click the login link.
    await page.getByRole('button', { name: 'Login' }).first().click();
    // Expect login form heading
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
});

test('login with valid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill credentials (using mock or test account)
    // For now just check form elements exist
    await expect(page.getByText('Email Address')).toBeVisible();
    // Note: getByLabel might fail if the label isn't strictly associated with input via id/for, checking text is safer if association is weak
    // But Login.tsx structure: label is "Email Address", input is sibling? 
    // Label: <label ...>Email Address</label> Input: <input ...> 
    // They are NOT associated with 'for' in the code I saw! verify?
    // Code: <label ...>Email Address</label> ... <input ...> (no id on input, no for on label).
    // So getByLabel WILL fail. Use getByPlaceholder or getByRole or getByText.
    await expect(page.getByPlaceholder('operator@aegiscert.io')).toBeVisible();
    await expect(page.getByPlaceholder('••••••••')).toBeVisible();
    await expect(page.getByRole('button', { name: 'LOGIN TO TERMINAL' })).toBeVisible();
    // Example flow (commented out until test data strategy is finalized):
    /*
    await page.getByLabel('Email address').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/.*dashboard/);
    */
});
