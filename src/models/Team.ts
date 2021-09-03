import {model, Schema, Model, Document} from 'mongoose';

export interface ITeam extends Document {
  name: string;
  displayName: string;
  country: string;
  imageId: number;
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
      imageId: {
        index: true,
        required: true,
        type: Number,
      },
    },
    {versionKey: false},
  ),
  'teams',
);

export default Team;
