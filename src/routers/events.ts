import chalk from 'chalk';
import dayjs from 'dayjs';
import express, { Request, Response } from 'express';

import Event, { IEvent } from '../models/Event';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const sportId = parseInt(req.query.sportId as string) || undefined;
    const hoursFromNowFilter =
      parseInt(req.query.hoursFromNowFilter as string) || undefined;
    const nextDayFilter =
      parseInt(req.query.nextDayFilter as string) || undefined;
    const sortByLeague = req.query.sortByLeague;

    const skipIndex = (page - 1) * limit;

    let query: any = {
      time: { $gt: dayjs().toDate() },
      odds: { $exists: true, $ne: {} },
    };

    if (sportId) {
      query.sport = sportId;
    }

    if (hoursFromNowFilter) {
      query.time = {
        $gt: dayjs().toDate(),
        $lt: dayjs().add(hoursFromNowFilter, 'hour').toDate(),
      };
    }

    if (nextDayFilter) {
      const time =
        dayjs().isoWeekday() <= nextDayFilter
          ? dayjs().isoWeekday(nextDayFilter)
          : dayjs().add(1, 'week').isoWeekday(nextDayFilter);

      query.time = {
        $gte: time.startOf('day').toDate(),
        $lte: time.endOf('day').toDate(),
      };
    }

    const events = await Event.find(query)
      .sort({ league: 1, time: 1 })
      .limit(limit)
      .skip(skipIndex);

    const count = await Event.countDocuments(query);

    if (sortByLeague) {
      const leagues = events.reduce((acc, cur) => {
        if (!acc.length || acc[acc.length - 1].league !== cur.league) {
          acc.push({ league: cur.league, events: [cur] });
          return acc;
        }

        acc[acc.length - 1].events.push(cur);
        return acc;
      }, [] as unknown as [{ league: string; events: IEvent[] }]);

      res.json({
        leagues,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
      });
      return;
    }

    res.json({
      events,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    console.log(chalk.red(err));
    res.status(500).send(err.message || err);
  }
});

export default router;
