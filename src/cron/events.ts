import puppeteer from 'puppeteer';

import createPage from '../lib/createPage';
import getPageEvents from '../lib/getPageEvents';
import Event from '../models/Event';
import Sport, { ISport } from '../models/Sport';

async function getSportEvents(page: puppeteer.Page, sport: ISport) {
  await page.goto(sport.url, { timeout: 60000 });
  await page.waitForSelector('.Sport-styles-sport-container', {
    timeout: 10000,
  });

  try {
    await page.click('#_evidon-accept-button');
  } catch {}

  const events = await getPageEvents(page, sport);
  return events;
}

const syncEvents = async () => {
  try {
    await Event.deleteMany();
    const { page, browser } = await createPage();

    const sports = await Sport.find();

    for (const sport of sports) {
      try {
        const events = await getSportEvents(page, sport);
        Event.insertMany(events);
      } catch (e) {
        console.log(`Failed to fetch events for ${sport.displayName}`);
      }
    }

    await browser.close();
  } catch (e) {
    console.log(e);
  }
};

export default syncEvents;
