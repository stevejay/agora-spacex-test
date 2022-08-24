import { expect, test } from '@playwright/test';

test('example test', async ({ page }) => {
  await page.goto('http://localhost:6006/?path=/story/example-app--default');
  const heading = page.frameLocator('#storybook-preview-iframe').locator('#root').locator('h1');
  await expect(heading).toHaveText('Hello Vite + React! (mode=development)');
});
