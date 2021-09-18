import express, {Request, Response} from 'express';
import dayjs from 'dayjs';

import Event from '../models/Event';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const sport_id = parseInt(req.query.sport_id as string) || undefined;
    const hours_from_now_filter =
      parseInt(req.query.hours_from_now_filter as string) || undefined;
    const next_day_filter =
      parseInt(req.query.next_day_filter as string) || undefined;

    const skipIndex = (page - 1) * limit;

    let query: any = {time: {$gt: dayjs().toDate()}, odds: {$exists: true}};

    if (sport_id) {
      query.sport = sport_id;
    }

    if (hours_from_now_filter !== undefined) {
      query.time = {
        $gt: dayjs().toDate(),
        $lt: dayjs().add(hours_from_now_filter, 'hour').toDate(),
      };
    }

    if (next_day_filter !== undefined) {
      const time =
        dayjs().isoWeekday() <= next_day_filter
          ? dayjs().isoWeekday(next_day_filter)
          : dayjs().add(1, 'week').isoWeekday(next_day_filter);

      query.time = {
        $gte: time.startOf('day').toDate(),
        $lte: time.endOf('day').toDate(),
      };
    }

    const events = await Event.find(query)
      .sort({time: 1})
      .limit(limit)
      .skip(skipIndex)
      .populate('home_team')
      .populate('away_team')
      .populate('league')
      .exec();

    const count = await Event.countDocuments(query);

    res.json({events, currentPage: page, totalPages: Math.ceil(count / limit)});
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message || err);
  }
});

export default router;
