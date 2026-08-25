import mongoose, { Schema, models, model } from "mongoose";

export interface IReply {
  _id: string;
  userId: string;
  inputExcerpt: string;
  output: string;
  action: string;
  tone: string;
  language: string;
  context: string;
  saved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReplySchema = new Schema<IReply>(
  {
    userId: { type: String, required: true, index: true },
    inputExcerpt: { type: String, required: true },
    output: { type: String, required: true },
    action: { type: String, required: true },
    tone: { type: String, required: true },
    language: { type: String, required: true },
    context: { type: String, required: true },
    saved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default (models.Reply as mongoose.Model<IReply>) ||
  model<IReply>("Reply", ReplySchema);
