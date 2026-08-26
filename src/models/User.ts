import mongoose, { Schema, models, model } from "mongoose";

export interface IUser {
  _id: string;
  name?: string;
  email: string;
  image?: string;
  plan: "free" | "pro";
  googleId?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripeSubscriptionStatus?: string;
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
    stripeCustomerId: { type: String, index: true, sparse: true },
    stripeSubscriptionId: { type: String, index: true, sparse: true },
    stripeSubscriptionStatus: { type: String },
    dailyUsageCount: { type: Number, default: 0 },
    dailyUsageDate: { type: String, default: "" },
  },
  { timestamps: true }
);

export default (models.User as mongoose.Model<IUser>) ||
  model<IUser>("User", UserSchema);
