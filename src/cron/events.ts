import dayjs from 'dayjs';
import axios from 'axios';

import config from '../config';

import Sport from '../models/Sport';
import Event, {IEventOdds} from '../models/Event';
import Team from '../models/Team';
import League from '../models/League';

const syncEvents = async () => {
  // Find the sport that had it's events updated the longest time ago.
  const sport = await Sport.findOne().sort({events_updated: 1});
  if (!sport) return;

  // Iterate through pages until there are no more pages left.
  let isNextPage = true;
  for (let page = 1; isNextPage; page++) {
    // Fetches a page of upcoming events for the given sport.
    const result = await axios.get(
      `${config.bet365Api.host}/v1/bet365/upcoming`,
      {
        params: {sport_id: sport._id, token: config.bet365Api.token, page},
      },
    );
    if (!result.data.success) return;

    // Checks if there are any more pages.
    if (
      result.data.pager.total <
      result.data.pager.page * result.data.pager.per_page
    )
      isNextPage = false;

    // Iterates over all of the events in that page.
    for (const event of result.data.results) {
      // Continues to the next event if it already exists in the database.
      const existingEvent = await Event.findById(event.id);
      if (existingEvent) {
        continue;
        //todo update time and time_status
      }

      // Searches the database for the teams and leagues for this event.
      const homeTeam = await Team.findById(event.home.id);
      const awayTeam = await Team.findById(event.away.id);
      const league = await League.findById(event.league.id);

      // If the league or a team doesn't exist it will fetch the details from the api.
      if (!homeTeam || !awayTeam || !league) {
        const detailsResult = await axios.get(
          `${config.bet365Api.host}/v1/bet365/result`,
          {
            params: {event_id: event.id, token: config.bet365Api.token, page},
          },
        );

        if (result.data.success) {
          const details = detailsResult.data.results[0];

          // todo update existing teams and league
          // Creates a team for the home team if it doesn't exist.
          if (!homeTeam) {
            const newTeam = new Team({
              _id: event.home.id,
              name: event.home.name.replace(/ /g, '_').toLowerCase(),
              display_name: event.home.name,
              country: details.home.cc,
              image_id: details.home.image_id,
            });

            await newTeam.save();
          }

          // Creates a team for the away team if it doesn't exist.
          if (!awayTeam) {
            const newTeam = new Team({
              _id: event.away.id,
              name: event.away.name.replace(/ /g, '_').toLowerCase(),
              display_name: event.away.name,
              country: details.away.cc,
              image_id: details.away.image_id,
            });

            await newTeam.save();
          }

          // Creates a league if it doesn't exist.
          if (!league) {
            const newLeague = new League({
              _id: event.league.id,
              name: event.league.name.replace(/ /g, '_').toLowerCase(),
              display_name: event.league.name,
              country: details.league.cc,
            });

            await newLeague.save();
          }
        }
      }

      // Fetches the odds for the given event.
      const oddsResult = await axios.get(
        `${config.bet365Api.host}/v3/bet365/prematch`,
        {
          params: {FI: event.id, token: config.bet365Api.token},
        },
      );
      if (!oddsResult.data.success) continue;

      // Copies the odds over to a new odds object.
      const odds: IEventOdds = {};

      for (const key in oddsResult.data.results[0]) {
        const value = oddsResult.data.results[0][key];

        if (typeof value === 'object' && value !== null && key === 'main') {
          odds[key] = value.sp;
        }
      }

      // Creates and saves the event.
      const newEvent = new Event({
        _id: event.id,
        sport: sport._id,
        home_team: event.home.id,
        away_team: event.away.id,
        league: event.league.id,
        date: dayjs.unix(event.time).utc().toDate(),
        time_status: event.time_status,
        odds_updated: dayjs.utc().toDate(),
        odds,
      });

      await newEvent.save();
    }
  }

  sport.events_updated = dayjs.utc().toDate();
  await sport.save();
  console.log(`[EVENTS] Events updated for ${sport.display_name}.`);
};

export default syncEvents;
