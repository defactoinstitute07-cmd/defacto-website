import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITopper extends Document {
  name: string;
  classExam: string;
  achievement: string;
  year: string;
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
    classExam: {
      type: String,
      required: true,
      trim: true,
    },
    achievement: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      required: true,
      trim: true,
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

TopperSchema.index({ year: -1, created_at: -1 });

const Topper: Model<ITopper> =
  mongoose.models.Topper || mongoose.model<ITopper>("Topper", TopperSchema);

export default Topper;
