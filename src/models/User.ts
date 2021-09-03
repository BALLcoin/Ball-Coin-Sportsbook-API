import {model, Schema, Model, Document} from 'mongoose';

export interface IUser extends Document {
  name?: string;
  picture?: string;
  phone_number?: string;
  email?: string;
}

const User: Model<IUser> = model(
  'User',
  new Schema(
    {
      _id: String,
      name: String,
      picture: String,
      phone_number: String,
      email: String,
    },
    {versionKey: false},
  ),
  'users',
);

export default User;
