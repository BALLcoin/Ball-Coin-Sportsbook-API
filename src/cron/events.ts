import dayjs from 'dayjs';
import axios from 'axios';

import config from '../config';

import Sport from '../models/Sport';
import Event from '../models/Event';
import Team from '../models/Team';
import League from '../models/League';

const syncEvents = async () => {
  // Find the sport that had it's events updated the longest time ago.
  const sport = await Sport.findOne().sort({events_updated: 1});
  if (!sport) return;
  console.log(`[EVENTS] Starting updating events for ${sport.display_name}.`);

  // Iterate through pages until there are no more pages left.
  let isNextPage = true;
  for (let page = 1; isNextPage; page++) {
    // Fetches a page of upcoming events for the given sport.
    const result = await axios.get(
      `${config.bet365Api.host}/v2/events/upcoming`,
      {
        params: {
          sport_id: sport._id,
          token: config.bet365Api.token,
          page,
          skip_esports: true,
        },
      },
    );
    if (!result.data.success) return;

    // Checks if there are any more pages.
    if (
      page >= 100 ||
      result.data.pager.total <
        result.data.pager.page * result.data.pager.per_page
    )
      isNextPage = false;

    // Iterates over all of the events in that page.
    for (const event of result.data.results) {
      // If event exists update time and time status, then continue.
      const existingEvent = await Event.findById(event.id);

      if (existingEvent) {
        existingEvent.time = event.time;
        existingEvent.time_status = event.time_status;
        await existingEvent.save();
        continue;
      }

      // Creates a team for the home team if it doesn't exist.
      const homeTeam = await Team.findById(event.home.id);
      if (!homeTeam) {
        const newTeam = new Team({
          _id: event.home.id,
          name: event.home.name.replace(/ /g, '_').toLowerCase(),
          display_name: event.home.name,
          country: event.home.cc,
          image_id: event.home.image_id,
        });

        await newTeam.save();
        console.log(`[EVENTS] Added team with id ${newTeam._id}.`);
      }

      // Creates a team for the away team if it doesn't exist.
      const awayTeam = await Team.findById(event.away.id);
      if (!awayTeam) {
        const newTeam = new Team({
          _id: event.away.id,
          name: event.away.name.replace(/ /g, '_').toLowerCase(),
          display_name: event.away.name,
          country: event.away.cc,
          image_id: event.away.image_id,
        });

        await newTeam.save();
        console.log(`[EVENTS] Added team with id ${newTeam._id}.`);
      }

      // Creates a league if it doesn't exist.
      const league = await League.findById(event.league.id);
      if (!league) {
        const newLeague = new League({
          _id: event.league.id,
          name: event.league.name.replace(/ /g, '_').toLowerCase(),
          display_name: event.league.name,
          country: event.league.cc,
        });

        await newLeague.save();
        console.log(`[EVENTS] Added league with id ${newLeague._id}.`);
      }

      // Fetches the odds for the given event.
      // const oddsResult = await axios.get(
      //   `${config.bet365Api.host}/v2/event/odds`,
      //   {
      //     params: {event_id: event.id, token: config.bet365Api.token},
      //   },
      // );
      // if (!oddsResult.data.success) continue;

      // Creates and saves the event.
      const newEvent = new Event({
        _id: event.id,
        sport: sport._id,
        home_team: event.home.id,
        away_team: event.away.id,
        league: event.league.id,
        time: dayjs.unix(event.time).utc().toDate(),
        time_status: event.time_status,
        // odds_updated: dayjs.utc().toDate(),
        // odds: oddsResult.data.results.odds,
      });

      await newEvent.save();
      console.log(`[EVENTS] Added event with id ${event.id}.`);
    }
  }

  sport.events_updated = dayjs.utc().toDate();
  await sport.save();
  console.log(`[EVENTS] Events updated for ${sport.display_name}.`);
};

export default syncEvents;
