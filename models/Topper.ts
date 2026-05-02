import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITopper extends Document {
  name: string;
  board: string;
  studentClass: string;
  percentage?: number;
  imageUrl: string;
  created_at: Date;
  updated_at: Date;
}

const TopperSchema = new Schema<ITopper>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    board: {
      type: String,
      required: true,
      trim: true,
    },
    studentClass: {
      type: String,
      required: true,
      trim: true,
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    versionKey: false,
  }
);

TopperSchema.index({ percentage: -1, created_at: -1 });

// Delete the cached model so schema changes (like adding `percentage`) are
// always picked up — both in Next.js dev hot-reload and after a deployment.
delete mongoose.models["Topper"];
const Topper: Model<ITopper> = mongoose.model<ITopper>("Topper", TopperSchema);

export default Topper;
