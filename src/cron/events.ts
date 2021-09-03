import {events} from '../data';

import Event from '../models/Event';
import Team from '../models/Team';
import League from '../models/League';

export interface IPrice {
  [coin: string]: {
    btc: number;
    btc_market_cap: number;
    btc_24h_vol: number;
    btc_24h_change: number;
    usd: number;
    usd_market_cap: number;
    usd_24h_vol: number;
    usd_24h_change: number;
  };
}

const syncEvents = async () => {
  for (const remoteEvent of events) {
    const event = await Event.findById(remoteEvent.event_id);

    if (event) continue;

    const homeTeam = await Team.findById(remoteEvent.result[0].home.id);

    if (!homeTeam) {
      const newTeam = new Team({
        _id: remoteEvent.result[0].home.id,
        name: remoteEvent.result[0].home.name.replace(/ /g, '_').toLowerCase(),
        displayName: remoteEvent.result[0].home.name,
        country: remoteEvent.result[0].home.cc,
        imageId: remoteEvent.result[0].home.imageId,
      });

      await newTeam.save();
    }

    const awayTeam = await Team.findById(remoteEvent.result[0].away.id);

    if (!awayTeam) {
      const newTeam = new Team({
        _id: remoteEvent.result[0].away.id,
        name: remoteEvent.result[0].away.name.replace(/ /g, '_').toLowerCase(),
        displayName: remoteEvent.result[0].away.name,
        country: remoteEvent.result[0].away.cc,
        imageId: remoteEvent.result[0].away.imageId,
      });

      await newTeam.save();
    }

    const league = await League.findById(remoteEvent.result[0].league.id);

    if (!league) {
      const newLeague = new League({
        _id: remoteEvent.result[0].league.id,
        name: remoteEvent.result[0].league.name
          .replace(/ /g, '_')
          .toLowerCase(),
        displayName: remoteEvent.result[0].league.name,
        country: remoteEvent.result[0].league.cc,
      });

      await newLeague.save();
    }

    const newEvent = new Event({
      _id: remoteEvent.event_id,
      sport: remoteEvent.sport_id,
      home_team: remoteEvent.result[0].home.id,
      away_team: remoteEvent.result[0].away.id,
      league: remoteEvent.result[0].league.id,
      date: remoteEvent.time,
      odds_updated: remoteEvent.odds_updated,
      bets_placed: 0,
      odds: {main: remoteEvent.odds[0].sp},
    });

    await newEvent.save();
  }
};

export default syncEvents;
