import {model, Schema, Model, Document} from 'mongoose';

export interface ITeam extends Document {
  name: string;
  display_name: string;
  country?: string;
  image_id?: number;
}

const Team: Model<ITeam> = model(
  'Team',
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
      country: {
        index: true,
        required: false,
        type: String,
      },
      image_id: {
        index: true,
        required: false,
        type: Number,
      },
    },
    {versionKey: false},
  ),
  'teams',
);

export default Team;
