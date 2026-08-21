import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  created_At: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    created_At: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "users",
    timestamps: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

if (mongoose.models.User && (mongoose.models.User.collection?.name !== "users" || mongoose.models.User.db?.name !== "video_conference")) {
  delete mongoose.models.User;
}

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema, "users");

export default User;
