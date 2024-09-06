import dayjs from 'dayjs';

import { ISport } from '../models/Sport';

interface IRawEvent {
  sport: number;
  date: string;
  time: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  odds: any;
}

async function getPageEvents(page: any, sport: ISport) {
  const rawEvents = await page.evaluate(async (sport: ISport) => {
    // Retreives the league name from the league header row
    function parseLeague(element: Element) {
      return element.querySelector('.CompetitionTitle-styles-title')
        ?.textContent;
    }

    // Retreives the team names and time from an event row
    function parseEvent(element: Element) {
      const time = element.querySelector(
        '.EventDateTime-styles-time',
      )?.textContent;
      const homeTeam = element.querySelector(
        '.EventTeams-styles-team:first-child > .EventTeams-styles-team-title',
      )?.textContent;
      const awayTeam = element.querySelector(
        '.EventTeams-styles-team:nth-child(2) > .EventTeams-styles-team-title',
      )?.textContent;

      const homeImageSrc = element
        .querySelector(
          '.EventTeams-styles-team:first-child .EventTeams-styles-team-logo',
        )
        ?.getAttribute('src');

      const homeImage = homeImageSrc
        ? 'https://sports.tipico.de' + homeImageSrc
        : undefined;

      const awayImageSrc = element
        .querySelector(
          '.EventTeams-styles-team:nth-child(2) .EventTeams-styles-team-logo',
        )
        ?.getAttribute('src');

      const awayImage = awayImageSrc
        ? 'https://sports.tipico.de' + awayImageSrc
        : undefined;

      return { time, homeTeam, awayTeam, homeImage, awayImage };
    }

    // Checks whether the given element is a sport header section
    function isSportHeader(element: Element) {
      return element.classList.contains('SportHeader-styles-sport-wrapper');
    }

    // Checks whether the given element is a league header section
    function isLeagueHeader(element: Element) {
      return element.classList.contains(
        'CompetitionHeader-styles-competition-header',
      );
    }

    // Checks whether the given element is a date header section
    function isDateHeader(element: Element) {
      return element.classList.contains(
        'EventDateHeader-styles-event-date-header',
      );
    }

    // Checks whether the given element is an event row
    function isEventRow(element: Element) {
      return element.classList.contains('EventRow-styles-event-row');
    }

    const container = document.querySelector('.Sport-styles-sport-container');
    if (!container) throw Error('Error getting events!');

    // Array of children of the main sport container
    const children = Array.from(container.children);

    let currentLeague = '';
    let currentDate = '';

    const unfilteredEvents = children.map((child) => {
      if (isSportHeader(child)) console.log('header');

      if (isLeagueHeader(child)) {
        const league = parseLeague(child);
        if (league) currentLeague = league;
      }

      if (isDateHeader(child)) {
        const date = child.textContent;
        if (date) currentDate = date;
      }

      if (isEventRow(child)) {
        const isLive = !!child.querySelector('.EventDateTime-styles-live-time');
        if (isLive) return null;

        const parsedEvent = parseEvent(child);

        const odds: any = {};

        sport.marketGroups.forEach((marketGroup: any, index: number) => {
          const oddsRow = child.querySelector(
            `.EventOddGroup-styles-odd-group-container:nth-child(${index + 3})`,
          );

          const handicap = oddsRow?.querySelector(
            '.EventOddGroup-styles-fixed-param-text',
          )?.textContent;

          const markets: any = {};

          marketGroup.markets.forEach((market: any, index: number) => {
            const odd = oddsRow?.querySelector(
              `.EventOddButton-styles-odd-button:nth-child(${
                index + 1
              }):not(.EventOddButton-styles-stopped) > span`,
            )?.textContent;

            if (odd) markets[market.name] = parseFloat(odd);
          });

          if (Object.keys(markets).length > 0)
            odds[marketGroup.name] = { handicap, markets };
        });

        return {
          ...parsedEvent,
          sport: sport._id,
          date: currentDate,
          league: currentLeague,
          odds,
        };
      }
    });

    const rawEvents = unfilteredEvents.filter((e) => !!e) as IRawEvent[];

    return rawEvents;
  }, sport);

  const events = rawEvents.map((event: IRawEvent) => {
    let time = dayjs();
    if (event.date !== 'today') {
      const date = event.date.split(', ')[1];
      const [day, month] = date.split('.');
      time = time.set('date', parseInt(day));
      time = time.set('month', parseInt(month) - 1);
    }

    if (!event.time) console.log(event);

    const [hour, minute] = event.time.split(':');
    time = time.set('hour', parseInt(hour));
    time = time.set('minute', parseInt(minute));
    time = time.add(1, 'day');

    return { ...event, time: time.toDate() };
  });

  return events;
}

export default getPageEvents;
