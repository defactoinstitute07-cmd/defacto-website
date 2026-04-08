import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  password_hash: string;
  role: "admin";
  is_active: boolean;
  session_version: number;
  two_factor_enabled: boolean;
  two_factor_secret?: string | null;
  two_factor_pending_secret?: string | null;
  two_factor_backup_code_hashes: string[];
  two_factor_enabled_at?: Date | null;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date | null;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 160,
      index: true,
    },
    password_hash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
      index: true,
    },
    is_active: {
      type: Boolean,
      default: true,
      index: true,
    },
    session_version: {
      type: Number,
      default: 0,
      min: 0,
    },
    two_factor_enabled: {
      type: Boolean,
      default: false,
    },
    two_factor_secret: {
      type: String,
      default: null,
      select: false,
    },
    two_factor_pending_secret: {
      type: String,
      default: null,
      select: false,
    },
    two_factor_backup_code_hashes: {
      type: [String],
      default: [],
      select: false,
    },
    two_factor_enabled_at: {
      type: Date,
      default: null,
    },
    last_login_at: {
      type: Date,
      default: null,
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

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1, is_active: 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
export type UserId = Types.ObjectId;
