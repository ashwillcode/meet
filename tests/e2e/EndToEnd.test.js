import puppeteer from 'puppeteer';

describe('Filter Events By City Feature', () => {
  let browser;
  let page;

  // Increase timeout for the entire test suite
  jest.setTimeout(30000);

  beforeAll(async () => {
    try {
      // Launch browser with headless mode for better performance
      browser = await puppeteer.launch({
        headless: true, // Can be changed to false for visual debugging
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
      // Wait for the city search input to be loaded
      await page.waitForSelector('#city-search input');
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

  test('Show all upcoming events when no city is searched', async () => {
    try {
      // Wait for events to load
      await page.waitForSelector('[data-testid="event-item"]');
      
      // Get all events
      const eventElements = await page.$$('[data-testid="event-item"]');
      
      // Verify we have events displayed (our mock data has 3 events)
      expect(eventElements.length).toBe(3);
      
      // Verify events are from different cities
      const locations = await Promise.all(
        eventElements.map(element => 
          page.evaluate(el => el.querySelector('[data-testid="event-location"]').textContent, element)
        )
      );
      
      // Check that we have events from different cities
      const uniqueLocations = new Set(locations);
      expect(uniqueLocations.size).toBeGreaterThan(1);
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  test('Display city suggestions as user types', async () => {
    try {
      // Get the search input
      const searchInput = await page.$('#city-search input');
      
      // Type "Berlin" into the search input
      await searchInput.type('Berlin');
      
      // Wait for suggestions to appear
      await page.waitForSelector('.suggestions li');
      
      // Get all suggestions
      const suggestions = await page.$$('.suggestions li');
      
      // Verify we have suggestions
      expect(suggestions.length).toBeGreaterThan(0);
      
      // Verify one of the suggestions is Berlin
      const suggestionTexts = await Promise.all(
        suggestions.map(element => 
          page.evaluate(el => el.textContent, element)
        )
      );
      
      expect(suggestionTexts.some(text => text.includes('Berlin'))).toBe(true);
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  test('Select a city from the suggestions', async () => {
    try {
      // Get the search input
      const searchInput = await page.$('#city-search input');
      
      // Type "Berlin" into the search input
      await searchInput.type('Berlin');
      
      // Wait for suggestions to appear
      await page.waitForSelector('.suggestions li');
      
      // Click the suggestion for Berlin
      const berlinSuggestion = await page.$$('.suggestions li');
      const suggestionTexts = await Promise.all(
        berlinSuggestion.map(element => 
          page.evaluate(el => el.textContent, element)
        )
      );
      
      const berlinIndex = suggestionTexts.findIndex(text => text.includes('Berlin'));
      await berlinSuggestion[berlinIndex].click();
      
      // Wait for events to update
      await page.waitForSelector('[data-testid="event-item"]');
      
      // Get all displayed events
      const eventElements = await page.$$('[data-testid="event-item"]');
      
      // Verify all displayed events are in Berlin
      const locations = await Promise.all(
        eventElements.map(element => 
          page.evaluate(el => el.querySelector('[data-testid="event-location"]').textContent, element)
        )
      );
      
      expect(locations.every(location => location.includes('Berlin'))).toBe(true);
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
}); 