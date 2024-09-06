import puppeteer from 'puppeteer';

async function createPage() {
  const browser = await puppeteer.launch({
    headless: false,
    // userDataDir: './cache',
    // args: [`--proxy-server=${process.env.PROXY_SERVER}`],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent(
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36',
  );

  return { page, browser };
}

export default createPage;
