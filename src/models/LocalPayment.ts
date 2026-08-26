import mongoose, { Schema, models, model } from "mongoose";

export interface ILocalPayment {
  _id: string;
  userId: string;
  email: string;
  method: "raast" | "easypaisa" | "jazzcash" | "other";
  reference: string;
  amount: number;
  currency: "PKR";
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const LocalPaymentSchema = new Schema<ILocalPayment>(
  {
    userId: { type: String, required: true, index: true },
    email: { type: String, required: true, lowercase: true, index: true },
    method: { type: String, enum: ["raast", "easypaisa", "jazzcash", "other"], required: true },
    reference: { type: String, required: true, trim: true, unique: true },
    amount: { type: Number, default: 499 },
    currency: { type: String, enum: ["PKR"], default: "PKR" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
  },
  { timestamps: true }
);

export default (models.LocalPayment as mongoose.Model<ILocalPayment>) ||
  model<ILocalPayment>("LocalPayment", LocalPaymentSchema);
