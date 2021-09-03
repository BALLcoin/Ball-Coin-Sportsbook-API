import {model, Schema, Model, Document} from 'mongoose';

export interface IMessage extends Document {
  user?: string;
  date: Date;
  roomId: string;
  body: string;
}

const Message: Model<IMessage> = model(
  'Message',
  new Schema(
    {
      user: {
        required: true,
        type: String,
        ref: 'User',
      },
      date: {
        index: true,
        required: true,
        type: Date,
      },
      roomId: {
        index: true,
        required: true,
        type: String,
      },
      body: {
        required: true,
        type: String,
      },
    },
    {versionKey: false},
  ),
  'messages',
);

export default Message;
