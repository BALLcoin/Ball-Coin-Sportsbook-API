import chalk from 'chalk';
import express, { Request, Response } from 'express';

import config from '../config';
import { getBalance, getDepositAddress, sendFrom } from '../lib/rpc';
import authorization from '../middleware/authorization';
import Bet, { IBetStatus } from '../models/Bet';

const router = express.Router();

router.post('/', authorization(), async (req: Request, res: Response) => {
  try {
    // // Gets the balance
    // const balance = await getBalance(req.uid);

    // // Error if no balance is present
    // if (!balance) {
    //   res.status(500).send('Error placing bet!');
    //   return;
    // }

    // // Error if the stake amount is greater than the balance
    // if (req.body.stake > balance) {
    //   res.status(402).send('Not enough funds!');
    //   return;
    // }

    // // Send funds to the sportsbook wallet
    // const stakeTXID = await sendFrom(
    //   req.uid,
    //   config.addresses.stake,
    //   req.body.stakeAmount,
    //   1,
    //   'sportsbook_bet',
    //   req.uid,
    // );

    // Create and save bet
    // const bet = new Bet({ user: req.uid, stakeTXID, ...req.body });
    const bet = new Bet({ user: req.uid, stakeTXID: 'test', ...req.body });
    await bet.save();

    res.json(bet);
  } catch (err) {
    console.log(chalk.red(err));
    res.status(500).send(err.message || err);
  }
});

router.patch(
  '/:id/payout',
  authorization(true),
  async (req: Request, res: Response) => {
    try {
      // Gets the bet
      const bet = await Bet.findById(req.params.id);
      // Error if no bet is found
      if (!bet) {
        res.status(404).send('Invalid bet id!');
        return;
      }

      // Error if no bet has a status other than won
      if (bet.status !== 'won') {
        res.status(405).send('Status is not won!');
        return;
      }

      // Gets the balance
      const balance = await getBalance('SB-Payout');
      // Error if no balance is present
      if (!balance) {
        res.status(500).send('Error paying out bet!');
        return;
      }

      const amount = req.body.amount || bet.stakeAmount * bet.totalOdds;

      // Error if the payout amount is greater than the balance
      if (amount > balance) {
        res.status(402).send('Not enough funds!');
        return;
      }

      const address = await getDepositAddress(bet.user);

      // Send funds to the sportsbook wallet
      const payoutTxid = await sendFrom(
        config.addresses.payout,
        address,
        amount,
        1,
        `sportsbookBetPayout: ${bet._id}`,
        bet.user,
      );

      // Saves the payout txid and returns the bet
      bet.status = 'paid';
      bet.payoutTxid = payoutTxid;
      bet.payoutAmount = amount;

      await bet.save();
      res.json(bet);
    } catch (err) {
      console.log(chalk.red(err));
      res.status(500).send(err.message || err);
    }
  },
);

router.patch(
  '/:id/void',
  authorization(true),
  async (req: Request, res: Response) => {
    try {
      // Gets the bet
      const bet = await Bet.findById(req.params.id);
      // Error if no bet is found
      if (!bet) {
        res.status(404).send('Invalid bet id!');
        return;
      }

      // Error if no bet has a status other than new, won or lost
      if (
        bet.status !== 'new' &&
        bet.status !== 'won' &&
        bet.status !== 'lost'
      ) {
        res.status(405).send('Status is not new, won or lost!');
        return;
      }

      // Gets the balance
      const balance = await getBalance('SB-Payout');
      // Error if no balance is present
      if (!balance) {
        res.status(500).send('Error voiding bet!');
        return;
      }

      const amount = bet.stakeAmount;

      // Error if the payout amount is greater than the balance
      if (amount > balance) {
        res.status(402).send('Not enough funds!');
        return;
      }

      const address = await getDepositAddress(bet.user);

      // Send funds to the sportsbook wallet
      const payoutTxid = await sendFrom(
        config.addresses.payout,
        address,
        amount,
        1,
        `sportsbookBetVoid: ${bet._id}`,
        bet.user,
      );

      // Saves the payout txid and returns the bet
      bet.status = 'void';
      bet.payoutTxid = payoutTxid;
      bet.payoutAmount = amount;

      await bet.save();
      res.json(bet);
    } catch (err) {
      console.log(chalk.red(err));
      res.status(500).send(err.message || err);
    }
  },
);

router.get('/', authorization(true), async (req: Request, res: Response) => {
  try {
    const status = req.query.status as IBetStatus;

    const bets = await Bet.find({ user: req.uid, status });

    res.json(bets);
  } catch (err) {
    console.log(chalk.red(err));
    res.status(500).send(err.message || err);
  }
});

export default router;
