import mongoose, {model, Schema, Model, Document} from 'mongoose';

export interface ISport extends Document {
  name: string;
  display_name: string;
  show_images: boolean;
  hours_from_now_filters: number[];
  next_day_filters: number[];
  market_groups: IMarketGroup[];
}

export type IMarketGroup = IRowMarketGroup | IMultiColumnMarketGroup;

export interface IMarket {
  display_name: string;
  handicap: boolean;
  message: string;
  name: string;
  header?: string;
}

export interface IRowMarketGroup {
  main_market_group: string;
  name: string;
  display_name: string;
  type: 'row';
  markets: IMarket[];
}

export interface IMultiColumnMarketGroup {
  main_market_group: string;
  name: string;
  display_name: string;
  type: 'multi_column';
  columns: {
    display_name: string;
    markets: IMarket[];
  }[];
}

const Sport: Model<ISport> = model(
  'Sport',
  new Schema(
    {
      _id: {index: true, required: true, type: Number, unique: true},
      sport: {
        index: true,
        required: true,
        type: Number,
        ref: 'Sport',
      },
      homeTeam: {
        index: true,
        required: true,
        type: Number,
        ref: 'Team',
      },
      awayTeam: {
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
      lastUpdated: {
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
  'sports',
);

export default Sport;
