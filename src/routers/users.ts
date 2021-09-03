import express, {Request, Response} from 'express';
import authorization from '../middleware/authorization';
import {getBalance} from '../lib/rpc';

const router = express.Router();

router.get(
  '/me/balance',
  authorization(),
  async (req: Request, res: Response) => {
    try {
      if (!req.uid) {
        res.status(500).send('Error getting balance');
        return;
      }

      const balance = await getBalance(req.uid);

      if (!balance) {
        res.status(500).send('Error getting balance');
        return;
      }

      res.json(balance);
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || err);
    }
  },
);

export default router;
