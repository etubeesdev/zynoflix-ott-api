import mongoose, { Schema, Document, Types } from "mongoose";

interface IUserProfile extends Document {
  profilePic?: string;

  contact?: string;
  email: string;
  full_name: string;
  password: string;
  following?: number;
  followingId?: Types.ObjectId[];
  is_active: boolean;
  membership?: string;
}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    profilePic: { type: String, default: "https://i.sstatic.net/l60Hf.png" },
    contact: { type: String },
    email: { type: String, required: true, unique: true },
    full_name: { type: String, required: true },
    password: { type: String, required: true },
    followingId: [
      {
        type: Schema.Types.ObjectId,
        ref: "user_profile",
      },
    ],
    following: Number,
    membership: { type: String, default: "free" },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = mongoose.model<IUserProfile>("user_profile", UserProfileSchema);

export { IUserProfile, User };
