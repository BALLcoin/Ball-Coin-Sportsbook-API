import {model, Schema, Model, Document} from 'mongoose';

export interface ILeague extends Document {
  name: string;
  displayName: string;
  country: string;
}

const League: Model<ILeague> = model(
  'League',
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
      country: {
        index: true,
        required: false,
        type: String,
      },
    },
    {versionKey: false},
  ),
  'leagues',
);

export default League;
