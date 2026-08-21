import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMeeting extends Document {
  meetingCode: string;
  title: string;
  host_Id: string;
  password?: string;
  created_At: Date;
  ended_At?: Date | null;
  isLocked?: boolean;
}

const MeetingSchema = new Schema<IMeeting>(
  {
    meetingCode: {
      type: String,
      required: [true, "Meeting code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    host_Id: {
      type: String,
      required: [true, "Host ID is required"],
      trim: true,
    },
    password: {
      type: String,
      default: null,
    },
    created_At: {
      type: Date,
      default: Date.now,
    },
    ended_At: {
      type: Date,
      default: null,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "meetings",
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

if (mongoose.models.Meeting && mongoose.models.Meeting.collection?.name !== "meetings") {
  delete mongoose.models.Meeting;
}

const Meeting: Model<IMeeting> = mongoose.models.Meeting || mongoose.model<IMeeting>("Meeting", MeetingSchema, "meetings");

export default Meeting;
