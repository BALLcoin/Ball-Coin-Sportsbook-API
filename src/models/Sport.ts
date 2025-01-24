import {model, Schema, Model, Document} from 'mongoose';

export interface ISport extends Document {
  name: string;
  display_name: string;
  show_images: boolean;
  hours_from_now_filters: number[];
  next_day_filters: number[];
  market_groups: IMarketGroup[];
  events_updated: Date;
}

export type IMarketGroup = INormalMarketGroup | IHandicappedMarketGroup;

export interface INormalMarketGroup {
  name: string;
  display_name: string;
  external_name: string;
  type: 'normal';
  markets: IMarket[];
}

export interface IMarket {
  name: string;
  display_name: string;
  external_name: string;
  message: string;
}

export interface IHandicappedMarketGroup {
  name: string;
  display_name: string;
  external_name: string;
  type: 'handicapped';
  handicap_type: 'normal' | 'under_over';
  markets: IHandicappedMarket[];
}

export interface IHandicappedMarket {
  name: string;
  display_name: string;
  external_name: string;
  message: string;
}

//todo sport schema
const Sport: Model<ISport> = model(
  'Sport',
  new Schema(
    {
      _id: Number,
      name: {
        index: true,
        required: true,
        type: String,
      },
      display_name: {
        index: true,
        required: true,
        type: String,
      },
      show_images: {
        required: true,
        type: Boolean,
      },
      hours_from_now_filters: {
        required: true,
        type: [Number],
      },
      next_day_filters: {
        required: true,
        type: [Number],
      },
      events_updated: {
        index: true,
        required: true,
        type: Date,
      },
    },
    {versionKey: false},
  ),
  'sports',
);

export default Sport;
