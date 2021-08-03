import express, {Request, Response} from 'express';
import Event from '../models/Event';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const skipIndex = (page - 1) * limit;

    const events = await Event.find()
      .sort({height: -1})
      .limit(limit)
      .skip(skipIndex)
      .exec();

    const count = await Event.countDocuments();

    res.json({events, currentPage: page, totalPages: Math.ceil(count / limit)});
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message || err);
  }
});

export default router;
