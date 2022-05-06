import { Document, Model, Schema, model } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  picture?: string;
  phoneNumber?: string;
  email?: string;
}

const User: Model<IUser> = model(
  'User',
  new Schema(
    {
      _id: String,
      name: String,
      picture: String,
      phoneNumber: String,
      email: String,
    },
    { versionKey: false },
  ),
  'users',
);

export default User;
