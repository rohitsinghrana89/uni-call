import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  meeting_Id: string;
  sender_Id: string;
  message: string;
  created_At: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    meeting_Id: {
      type: String,
      required: [true, "Meeting ID is required"],
      index: true,
    },
    sender_Id: {
      type: String,
      required: [true, "Sender ID is required"],
      index: true,
    },
    message: {
      type: String,
      required: [true, "Message body is required"],
      trim: true,
    },
    created_At: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "messages",
    timestamps: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

if (mongoose.models.Message && mongoose.models.Message.collection?.name !== "messages") {
  delete mongoose.models.Message;
}

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema, "messages");

export default Message;
