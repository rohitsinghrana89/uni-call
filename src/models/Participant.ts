import mongoose, { Schema, Document, Model } from "mongoose";

export interface IParticipant extends Document {
  meeting_Id: string;
  user_Id: string;
  joined_At: Date;
  left_At?: Date | null;
}

const ParticipantSchema = new Schema<IParticipant>(
  {
    meeting_Id: {
      type: String,
      required: [true, "Meeting ID is required"],
      index: true,
    },
    user_Id: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
    joined_At: {
      type: Date,
      default: Date.now,
    },
    left_At: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Participant: Model<IParticipant> =
  mongoose.models.Participant || mongoose.model<IParticipant>("Participant", ParticipantSchema);

export default Participant;
