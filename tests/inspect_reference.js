const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ORIG_SHOTS = path.join(__dirname, 'original_screenshots');
if (!fs.existsSync(ORIG_SHOTS)) fs.mkdirSync(ORIG_SHOTS, { recursive: true });

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 }
];

async function inspect() {
  console.log('=== INSPECTING REFERENCE WEBSITE: https://www.era-residence.com/ ===');
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const inspectionData = {
    url: 'https://www.era-residence.com/',
    timestamp: new Date().toISOString(),
    routesFound: new Set(),
    techStack: {},
    assetsFound: {
      stylesheets: [],
      scripts: [],
      fonts: []
    },
    navigationItems: [],
    interactiveElements: []
  };

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to home page...');
  await page.goto('https://www.era-residence.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Detect tech stack
  inspectionData.techStack = await page.evaluate(() => {
    return {
      generator: document.querySelector('meta[name="generator"]')?.content || null,
      webflow: !!window.Webflow,
      jquery: !!window.jQuery ? window.jQuery.fn.jquery : null,
      lenis: !!window.Lenis || !!document.querySelector('.lenis'),
      gsap: !!window.gsap,
      slater: !!document.querySelector('script[src*="slater"]'),
      bodyClasses: document.body.className,
      htmlAttributes: Array.from(document.documentElement.attributes).map(a => `${a.name}="${a.value}"`)
    };
  });

  console.log('Tech stack detected:', JSON.stringify(inspectionData.techStack, null, 2));

  // Find all internal links
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href]')).map(a => a.href);
  });
  links.forEach(l => {
    if (l.startsWith('https://www.era-residence.com') || l.startsWith('/')) {
      inspectionData.routesFound.add(l);
    }
  });

  console.log('Found internal routes:', Array.from(inspectionData.routesFound));

  // Pages to screenshot
  const targetPages = [
    { name: 'home', url: 'https://www.era-residence.com/' },
    { name: 'apartments', url: 'https://www.era-residence.com/apartments' },
    { name: 'apartment_011', url: 'https://www.era-residence.com/apartments/011' },
    { name: 'contact', url: 'https://www.era-residence.com/contact' }
  ];

  for (const target of targetPages) {
    console.log(`\nInspecting and capturing ${target.name} (${target.url})...`);
    try {
      await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(3000);

      for (const vp of viewports) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.waitForTimeout(800);
        const shotPath = path.join(ORIG_SHOTS, `${target.name}_${vp.name}.png`);
        await page.screenshot({ path: shotPath, fullPage: false });
        console.log(`Saved screenshot: ${shotPath}`);
      }

      // If home page, also test interactions
      if (target.name === 'home') {
        await page.setViewportSize({ width: 1440, height: 900 });

        // Day/night toggle
        try {
          const nightBtn = await page.$('text="by night"');
          if (nightBtn) {
            await nightBtn.click();
            await page.waitForTimeout(1000);
            await page.screenshot({ path: path.join(ORIG_SHOTS, 'home_night_mode.png') });
            console.log('Saved original home_night_mode.png');
          }
        } catch (e) {
          console.warn('Could not click by night:', e.message);
        }

        // Book a call modal
        try {
          const bookCallBtn = await page.$('text="Book a call"');
          if (bookCallBtn) {
            await bookCallBtn.click();
            await page.waitForTimeout(1000);
            await page.screenshot({ path: path.join(ORIG_SHOTS, 'home_modal_open.png') });
            console.log('Saved original home_modal_open.png');
          }
        } catch (e) {
          console.warn('Could not click Book a call:', e.message);
        }
      }

      // If apartments page, test filter
      if (target.name === 'apartments') {
        await page.setViewportSize({ width: 1440, height: 900 });
        try {
          const filterTriggers = await page.$$('[data-filter-trigger]');
          if (filterTriggers.length > 1) {
            await filterTriggers[1].click({ force: true });
            await page.waitForTimeout(1000);
            await page.screenshot({ path: path.join(ORIG_SHOTS, 'apartments_filtered.png') });
            console.log('Saved original apartments_filtered.png');
          }
        } catch (e) {
          console.warn('Could not test filter trigger:', e.message);
        }
      }

    } catch (err) {
      console.error(`Error on ${target.name}:`, err.message);
    }
  }

  // Convert Set to Array for JSON output
  const report = {
    ...inspectionData,
    routesFound: Array.from(inspectionData.routesFound)
  };
  fs.writeFileSync(path.join(__dirname, 'reference_inspection.json'), JSON.stringify(report, null, 2));

  await browser.close();
  console.log('\nInspection complete. Results saved in tests/reference_inspection.json and tests/original_screenshots/');
}

inspect().catch(err => {
  console.error('Fatal inspection error:', err);
  process.exit(1);
});
