import {model, Schema, Model, Document} from 'mongoose';

export interface IEvent extends Document {
  sport: number;
  home_team: number;
  away_team: number;
  league: number;
  date: Date;
  odds_updated: Date;
  bets_placed: number;
  odds: {
    [key: string]: {
      [key: string]: {
        name: string;
        odds: {
          odds: number;
          name: string;
          header?: string;
          handicap?: string;
        }[];
      };
    };
  };
}

const Event: Model<IEvent> = model(
  'Event',
  new Schema(
    {
      _id: Number,
      sport: {
        index: true,
        required: true,
        type: Number,
        ref: 'Sport',
      },
      home_team: {
        index: true,
        required: true,
        type: Number,
        ref: 'Team',
      },
      away_team: {
        index: true,
        required: true,
        type: Number,
        ref: 'Team',
      },
      league: {
        index: true,
        required: true,
        type: Number,
        ref: 'League',
      },
      date: {
        index: true,
        required: true,
        type: Date,
      },
      odds_updated: {
        required: true,
        type: Date,
      },
      bets_placed: {
        required: true,
        type: Number,
      },
      odds: {
        required: true,
        type: Schema.Types.Map,
        of: {
          type: Schema.Types.Map,
          of: {
            name: {required: true, type: String},
            odds: {
              type: [
                {
                  odds: {required: true, type: Number},
                  name: {required: true, type: String},
                  header: String,
                  handicap: String,
                },
              ],
            },
          },
        },
      },
    },
    {versionKey: false},
  ),
  'events',
);

export default Event;
