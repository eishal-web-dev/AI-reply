import mongoose, { Schema, models, model } from "mongoose";

export interface IUsageLog {
  _id: string;
  anonId: string;
  count: number;
  date: string; // YYYY-MM-DD
  createdAt: Date;
  updatedAt: Date;
}

const UsageLogSchema = new Schema<IUsageLog>(
  {
    anonId: { type: String, required: true, index: true },
    count: { type: Number, default: 0 },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

UsageLogSchema.index({ anonId: 1, date: 1 }, { unique: true });

export default (models.UsageLog as mongoose.Model<IUsageLog>) ||
  model<IUsageLog>("UsageLog", UsageLogSchema);
