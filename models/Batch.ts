import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IBatch extends Document {
  name: string;
  code: string;
  course: Types.ObjectId;
  created_by: Types.ObjectId;
  academic_year: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const BatchSchema = new Schema<IBatch>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 40,
      unique: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    academic_year: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    is_active: {
      type: Boolean,
      default: true,
      index: true,
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

BatchSchema.index({ code: 1 }, { unique: true });
BatchSchema.index({ course: 1, is_active: 1 });
BatchSchema.index({ created_by: 1, academic_year: 1 });

const Batch: Model<IBatch> =
  mongoose.models.Batch || mongoose.model<IBatch>("Batch", BatchSchema);

export default Batch;
