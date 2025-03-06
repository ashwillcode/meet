import puppeteer from 'puppeteer';

describe('Show/Hide Event Details Feature', () => {
  let browser;
  let page;

  // Increase timeout for the entire test suite
  jest.setTimeout(30000);

  beforeAll(async () => {
    try {
      // Launch browser with headless mode for better performance
      browser = await puppeteer.launch({
        headless: true, // Changed to true for better performance
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu'
        ],
        defaultViewport: null
      });

      // Create new page and set longer timeout
      page = await browser.newPage();
      page.setDefaultTimeout(10000);

      // Navigate to app and wait for load
      await page.goto('http://localhost:5173/', {
        waitUntil: 'networkidle0',
        timeout: 10000
      });
    } catch (error) {
      console.error('Setup failed:', error);
      // Attempt cleanup on setup failure
      if (browser) {
        await browser.close();
      }
      throw error;
    }
  });

  beforeEach(async () => {
    try {
      if (!page || page.isClosed()) {
        page = await browser.newPage();
      }
      await page.goto('http://localhost:5173/', {
        waitUntil: 'networkidle0',
        timeout: 10000
      });
      // Wait for at least one event to be loaded
      await page.waitForSelector('[data-testid="event-item"]');
    } catch (error) {
      console.error('beforeEach failed:', error);
      throw error;
    }
  });

  afterEach(async () => {
    try {
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    } catch (error) {
      console.error('afterEach cleanup failed:', error);
    }
  });

  afterAll(async () => {
    try {
      if (page && !page.isClosed()) {
        await page.close();
      }
      if (browser) {
        await browser.close();
      }
    } catch (error) {
      console.error('Browser closure failed:', error);
    }
  });

  test('Event details are collapsed by default', async () => {
    try {
      // Wait for events to load
      await page.waitForSelector('[data-testid="event-item"]');
      
      // Check that no event details are visible
      const eventDetails = await page.$$('[data-testid="event-details"]');
      expect(eventDetails.length).toBe(0);
      
      // Verify all buttons show "Show Details"
      const buttons = await page.$$('[data-testid="details-btn"]');
      for (const button of buttons) {
        const buttonText = await page.evaluate(el => el.textContent, button);
        expect(buttonText).toBe('Show Details');
      }
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  test('User can expand event details', async () => {
    try {
      // Wait for the first event and its button
      await page.waitForSelector('[data-testid="event-item"]');
      const buttons = await page.$$('[data-testid="details-btn"]');
      expect(buttons.length).toBeGreaterThan(0);
      
      // Click the first event's button
      await buttons[0].click();
      
      // Wait for and verify the details are shown
      await page.waitForSelector('[data-testid="event-details"]');
      
      // Verify button text changed
      const buttonText = await page.evaluate(el => el.textContent, buttons[0]);
      expect(buttonText).toBe('Hide Details');
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  test('User can collapse event details', async () => {
    try {
      // Wait for the first event and its button
      await page.waitForSelector('[data-testid="event-item"]');
      const buttons = await page.$$('[data-testid="details-btn"]');
      expect(buttons.length).toBeGreaterThan(0);
      
      // First, expand the details
      await buttons[0].click();
      await page.waitForSelector('[data-testid="event-details"]');
      
      // Then collapse them
      await buttons[0].click();
      
      // Wait a bit for any animations
      await page.waitForTimeout(300);
      
      // Verify details are hidden
      const eventDetails = await page.$$('[data-testid="event-details"]');
      expect(eventDetails.length).toBe(0);
      
      // Verify button text changed back
      const buttonText = await page.evaluate(el => el.textContent, buttons[0]);
      expect(buttonText).toBe('Show Details');
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
}); 