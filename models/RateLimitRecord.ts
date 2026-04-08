import mongoose, { Document, Model, Schema } from "mongoose";

export interface IRateLimitRecord extends Document {
  scope: string;
  key_hash: string;
  hits: number;
  window_started_at: Date;
  blocked_until?: Date | null;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
}

const RateLimitRecordSchema = new Schema<IRateLimitRecord>(
  {
    scope: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      index: true,
    },
    key_hash: {
      type: String,
      required: true,
      trim: true,
      minlength: 64,
      maxlength: 64,
    },
    hits: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    window_started_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
    blocked_until: {
      type: Date,
      default: null,
    },
    expires_at: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 1000 * 60 * 60 * 24),
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

RateLimitRecordSchema.index({ scope: 1, key_hash: 1 }, { unique: true });
RateLimitRecordSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

const RateLimitRecord: Model<IRateLimitRecord> =
  mongoose.models.RateLimitRecord ||
  mongoose.model<IRateLimitRecord>("RateLimitRecord", RateLimitRecordSchema);

export default RateLimitRecord;
