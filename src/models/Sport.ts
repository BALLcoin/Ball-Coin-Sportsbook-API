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

export type IMarketGroup = ISingleRowMarketGroup | IMultiColumnMarketGroup;

export interface IMarket {
  name: string;
  display_name: string;
  external_name: string;
  handicap: boolean;
  message: string;
  header?: string;
}

export interface ISingleRowMarketGroup {
  parent_group: string;
  name: string;
  display_name: string;
  type: 'single_row';
  markets: IMarket[];
}

export interface IMultiColumnMarketGroup {
  parent_group: string;
  name: string;
  display_name: string;
  type: 'multi_column';
  columns: {
    display_name: string;
    markets: IMarket[];
  }[];
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
