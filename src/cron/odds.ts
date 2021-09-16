import dayjs from 'dayjs';
import axios from 'axios';

import config from '../config';

import Event from '../models/Event';

const syncOdds = async () => {
  const events = await Event.find({time: {$gt: dayjs.utc().toDate()}});

  for (const event of events) {
    if (event.odds_updated) {
      if (
        dayjs.utc(event.time).diff(dayjs.utc(), 'day', true) > 1 && // Over a day unil the event.
        dayjs.utc(event.odds_updated).diff(dayjs.utc(), 'day', true) > -1 // Less than a day since the odds were updated.
      ) {
        continue;
      }
      if (dayjs.utc(event.odds_updated).diff(dayjs.utc(), 'hour', true) > -1) {
        // Less than an hour since the odds were updated.
        continue;
      }
    }

    // Fetches the odds for the given event.
    const oddsResult = await axios.get(
      `${config.bet365Api.host}/v2/event/odds`,
      {
        params: {event_id: event.id, token: config.bet365Api.token},
      },
    );
    if (!oddsResult.data.success) continue;

    event.odds = oddsResult.data.results.odds;
    event.odds_updated = dayjs.utc().toDate();
    await event.save();
    console.log(`[ODDS] Updated odds for event ${event._id}.`);
  }
};

export default syncOdds;
