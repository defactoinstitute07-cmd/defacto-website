import mongoose, { Document, Model, Schema } from "mongoose";

export interface IGalleryItem extends Document {
  image_url: string;
  caption: string;
  tag: "trip" | "social" | "institute" | "institute events";
  created_at: Date;
  updated_at: Date;
}

const GalleryItemSchema = new Schema<IGalleryItem>(
  {
    image_url: {
      type: String,
      required: true,
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
      default: "",
      maxlength: 160,
    },
    tag: {
      type: String,
      enum: ["trip", "social", "institute", "institute events"],
      default: "trip",
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

GalleryItemSchema.index({ created_at: -1 });
GalleryItemSchema.index({ tag: 1, created_at: -1 });

const GalleryItem: Model<IGalleryItem> =
  mongoose.models.GalleryItem ||
  mongoose.model<IGalleryItem>("GalleryItem", GalleryItemSchema);

export default GalleryItem;
