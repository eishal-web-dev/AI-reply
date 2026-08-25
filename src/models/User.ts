import mongoose, { Schema, models, model } from "mongoose";

export interface IUser {
  _id: string;
  name?: string;
  email: string;
  image?: string;
  plan: "free" | "pro";
  googleId?: string;
  dailyUsageCount: number;
  dailyUsageDate: string; // YYYY-MM-DD, resets the counter
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    image: { type: String },
    plan: { type: String, enum: ["free", "pro"], default: "free" },
    googleId: { type: String },
    dailyUsageCount: { type: Number, default: 0 },
    dailyUsageDate: { type: String, default: "" },
  },
  { timestamps: true }
);

export default (models.User as mongoose.Model<IUser>) ||
  model<IUser>("User", UserSchema);
