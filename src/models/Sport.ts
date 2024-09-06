import { Document, Model, Schema, model } from 'mongoose';

export interface ISport extends Document {
  name: string;
  displayName: string;
  url: string;
  hoursFromNowFilters: number[];
  nextDayFilters: number[];
  marketGroups: IMarketGroup[];
  [key: string]: any;
}

export interface IMarketGroup {
  name: string;
  displayName: string;
  externalName: string;
  markets: IMarket[];
}

export interface IMarket {
  name: string;
  displayName: string;
  externalName: string;
}

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
      displayName: {
        index: true,
        required: true,
        type: String,
      },
      url: {
        required: true,
        type: String,
      },
      hoursFromNowFilters: {
        required: true,
        type: [Number],
      },
      nextDayFilters: {
        required: true,
        type: [Number],
      },
    },
    { versionKey: false },
  ),
  'sports',
);

export default Sport;
