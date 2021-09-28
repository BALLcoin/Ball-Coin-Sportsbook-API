import express, {Request, Response} from 'express';
import Sport from '../models/Sport';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const sports = await Sport.find({
      market_groups: {$exists: true, $ne: []},
    }).sort({display_name: 1});

    res.json(sports);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message || err);
  }
});

export default router;
