import mongoose, {model, Schema, Model, Document} from 'mongoose';

export interface IEvent extends Document {
  sport: number;
  home_team: number;
  away_team: number;
  league: number;
  date: Date;
  last_updated: Date;
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
      _id: {index: true, required: true, type: Number, unique: true},
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
        ref: 'Sport',
      },
      date: {
        index: true,
        required: true,
        type: Date,
      },
      last_updated: {
        required: true,
        type: Date,
      },
      odds: {
        required: true,
        type: mongoose.Schema.Types.Map,
        of: {
          required: true,
          type: mongoose.Schema.Types.Map,
          of: {
            name: {required: true, type: String},
            odds: {
              required: true,
              type: [
                {
                  odds: {required: true, type: Number},
                  name: {required: true, type: String},
                  header: {required: false, type: String},
                  handicap: {required: false, type: String},
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
