const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const playwright = require('@playwright/test');
    if (!playwright) {
      console.log('Playwright not installed, trying Puppeteer...');
      return;
    }
    
    const { chromium } = playwright;
    const browser = await chromium.launch();
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    
    // Desktop screenshot
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.screenshot({ path: '_screenshots/desktop.png', fullPage: true });
    console.log('Desktop screenshot saved');
    
    // Mobile screenshot
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.screenshot({ path: '_screenshots/mobile.png', fullPage: true });
    console.log('Mobile screenshot saved');
    
    await browser.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
