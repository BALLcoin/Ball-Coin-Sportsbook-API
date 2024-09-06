import { Document, Model, Schema, model } from 'mongoose';

export interface IEvent extends Document {
  sport: number;
  homeTeam: string;
  awayTeam: string;
  homeImage?: string;
  awayImage?: string;
  league: string;
  time: Date;
  oddsUpdated?: Date;
  odds: IEventOdds;
}

export interface IEventOdds {
  [key: string]: {
    handicap?: string;
    markets: { [key: string]: number };
  };
}

const Event: Model<IEvent> = model(
  'Event',
  new Schema(
    {
      sport: {
        index: true,
        required: true,
        type: Number,
        ref: 'Sport',
      },
      homeTeam: {
        index: true,
        required: true,
        type: String,
      },
      awayTeam: {
        index: true,
        required: true,
        type: String,
      },
      homeImage: {
        index: true,
        type: String,
      },
      awayImage: {
        index: true,
        type: String,
      },
      league: {
        index: true,
        required: true,
        type: String,
      },
      time: {
        index: true,
        required: true,
        type: Date,
      },
      oddsUpdated: {
        required: false,
        type: Date,
      },
      odds: {
        required: false,
        type: Schema.Types.Mixed,
      },
    },
    { versionKey: false },
  ),
  'events',
);

export default Event;
