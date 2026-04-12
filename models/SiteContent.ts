import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISiteContent extends Document {
  key: string;
  value: string;
  updated_by?: string;
  created_at: Date;
  updated_at: Date;
}

const SiteContentSchema = new Schema<ISiteContent>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    value: {
      type: String,
      required: true,
    },
    updated_by: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    versionKey: false,
  },
);

const SiteContent: Model<ISiteContent> =
  mongoose.models.SiteContent || mongoose.model<ISiteContent>("SiteContent", SiteContentSchema);

export default SiteContent;
