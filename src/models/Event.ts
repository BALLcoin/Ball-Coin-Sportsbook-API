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
    id: string;
    ss: string;
    time_str: string;
    add_time: string;
    [key: string]: string;
  };
}

export interface IEvent extends Document {
  sport: number;
  home_team: number;
  away_team: number;
  league: number;
  time: Date;
  time_status: ETimeStatus;
  odds_updated?: Date;
  odds?: IEventOdds;
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
      time: {
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
        required: false,
        type: Date,
      },
      odds: {
        required: false,
        type: {type: Schema.Types.Map, of: String},
      },
    },
    {versionKey: false},
  ),
  'events',
);

export default Event;
