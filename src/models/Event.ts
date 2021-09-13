import {model, Schema, Model, Document} from 'mongoose';

export enum ETimeStatus {
  not_started,
  in_play,
  to_be_fixed,
  ended,
  postponed,
  cancelled,
  walkover,
  interrupted,
  abandoned,
  retired,
  removed = 99,
}

export interface IEventOdds {
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
}

export interface IEvent extends Document {
  sport: number;
  home_team: number;
  away_team: number;
  league: number;
  date: Date;
  time_status: ETimeStatus;
  odds_updated: Date;
  odds: IEventOdds;
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
      time_status: {
        index: true,
        required: true,
        type: Number,
      },
      odds_updated: {
        required: true,
        type: Date,
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
