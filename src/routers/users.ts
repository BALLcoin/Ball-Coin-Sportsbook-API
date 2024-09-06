import chalk from 'chalk';
import express, { Request, Response } from 'express';

import { getBalance } from '../lib/rpc';
import authorization from '../middleware/authorization';

const router = express.Router();

router.get(
  '/me/balance',
  authorization(),
  async (req: Request, res: Response) => {
    try {
      const balance = await getBalance(req.uid);

      if (!balance) {
        res.status(500).send('Error getting balance');
        return;
      }

      res.json(balance);
    } catch (err) {
      console.log(chalk.red(err));
      res.status(500).send(err.message || err);
    }
  },
);

export default router;
