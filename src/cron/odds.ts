import dayjs from 'dayjs';
import axios from 'axios';

import config from '../config';

import Event, {IEventOdds} from '../models/Event';

const syncOdds = async () => {
  const events = await Event.find({date: {$gt: dayjs.utc().toDate()}});

  for (const event of events) {
    if (
      dayjs.utc(event.date).diff(dayjs.utc(), 'day', true) > 1 && // Over a day unil the event.
      dayjs.utc(event.odds_updated).diff(dayjs.utc(), 'day', true) > -1 // Less than a day since the odds were updated.
    ) {
      continue;
    }
    if (dayjs.utc(event.odds_updated).diff(dayjs.utc(), 'hour', true) > -1) {
      // Less than an hour since the odds were updated.
      continue;
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

    event.odds = odds;
    event.odds_updated = dayjs.utc().toDate();
    await event.save();
    console.log(`[ODDS] Updated odds for event ${event._id}.`);
  }
};

export default syncOdds;
