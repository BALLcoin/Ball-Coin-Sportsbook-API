import { Document, Model, Schema, model } from 'mongoose';

export interface IBet extends Document {
  user: string;
  date: Date;
  status: IBetStatus;
  stakeTXID: string;
  stakeAmount: number;
  payoutTxid?: string;
  payoutAmount?: number;
  totalOdds: number;
  betItems: IBetItem[];
}

export type IBetStatus = 'new' | 'lost' | 'won' | 'paid' | 'void';

export interface IBetItem {
  sport: number;
  event: number;
  marketGroup: string;
  market: string;
  odds: number;
  handicap?: string;
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
      stakeTXID: {
        required: true,
        type: String,
      },
      stakeAmount: {
        required: true,
        type: Number,
      },
      payoutTxid: String,
      payoutAmount: Number,
      totalOdds: {
        required: true,
        type: Number,
      },
      betItems: {
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
              type: String,
              ref: 'Event',
            },
            marketGroup: {
              required: true,
              type: String,
            },
            market: {
              required: true,
              type: String,
            },
            odds: {
              required: true,
              type: Number,
            },
            handicap: {
              required: false,
              type: String,
            },
          },
        ],
      },
    },
    { versionKey: false },
  ),
  'bets',
);

export default Bet;
