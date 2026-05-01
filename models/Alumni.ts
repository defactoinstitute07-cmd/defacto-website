import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAlumni extends Document {
  name: string;
  achievement: string;
  passingYear?: string;
  imageUrl: string;
  sequence?: number;
  created_at: Date;
  updated_at: Date;
}

const AlumniSchema = new Schema<IAlumni>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    achievement: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    passingYear: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    sequence: {
      type: Number,
      default: 0,
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

AlumniSchema.index({ sequence: 1, created_at: -1 });

const Alumni: Model<IAlumni> =
  mongoose.models.Alumni || mongoose.model<IAlumni>("Alumni", AlumniSchema);

export default Alumni;
