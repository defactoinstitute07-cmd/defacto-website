import mongoose, { Document, Model, Schema } from "mongoose";

export interface IFaculty extends Document {
  name: string;
  designation: string;
  image_url: string;
  created_at: Date;
  updated_at: Date;
}

const FacultySchema = new Schema<IFaculty>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
      index: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    image_url: {
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
  },
);

FacultySchema.index({ created_at: -1 });
FacultySchema.index({ name: 1, designation: 1 });

const Faculty: Model<IFaculty> =
  mongoose.models.Faculty || mongoose.model<IFaculty>("Faculty", FacultySchema);

export default Faculty;
