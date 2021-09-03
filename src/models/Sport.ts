import {model, Schema, Model, Document} from 'mongoose';

export interface ISport extends Document {
  name: string;
  displayName: string;
  showImages: boolean;
  hoursFromNowFilters: number[];
  nextDayFlters: number[];
  marketGroups: IMarketGroup[];
}

export type IMarketGroup = IRowMarketGroup | IMultiColumnMarketGroup;

export interface IMarket {
  name: string;
  displayName: string;
  externalName: string;
  handicap: boolean;
  message: string;
  header?: string;
}

export interface IRowMarketGroup {
  parentGroup: string;
  name: string;
  displayName: string;
  type: 'singleRow';
  markets: IMarket[];
}

export interface IMultiColumnMarketGroup {
  parentGroup: string;
  name: string;
  displayName: string;
  type: 'multiRow';
  columns: {
    displayName: string;
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
      displayName: {
        index: true,
        required: true,
        type: String,
      },
    },
    {versionKey: false},
  ),
  'sports',
);

export default Sport;
