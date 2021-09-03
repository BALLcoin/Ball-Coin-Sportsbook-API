import {model, Schema, Model, Document} from 'mongoose';

export interface IBet extends Document {
  user: string;
  date: Date;
  status: 'new' | 'lost' | 'won' | 'paid' | 'void';
  stake_txid: string;
  stake_amount: number;
  payout_txid?: string;
  payout_amount?: number;
  total_odds: number;
  bet_items: {
    sport: number;
    event: number;
    market_group: string;
    market: string;
    message: string;
    odds: number;
  }[];
}

const Bet: Model<IBet> = model(
  'Bet',
  new Schema(
    {
      user: {
        index: true,
        required: true,
        type: String,
        ref: 'User',
      },
      date: {
        index: true,
        required: true,
        type: Date,
      },
      status: {
        index: true,
        required: true,
        type: String,
        enum: ['new', 'lost', 'won', 'paid', 'void'],
      },
      stake_txid: {
        required: true,
        type: String,
      },
      stake_amount: {
        required: true,
        type: Number,
      },
      payout_txid: String,
      payout_amount: Number,
      total_odds: {
        required: true,
        type: Number,
      },
      bet_items: {
        required: true,
        type: [
          {
            sport: {
              required: true,
              type: Number,
              ref: 'Sport',
            },
            event: {
              required: true,
              type: Number,
              ref: 'Event',
            },
            market_group: {
              required: true,
              type: String,
            },
            market: {
              required: true,
              type: String,
            },
            message: {
              required: true,
              type: String,
            },
            odds: {
              required: true,
              type: Number,
            },
          },
        ],
      },
    },
    {versionKey: false},
  ),
  'bets',
);

export default Bet;
