import mongoose, { Document, Model, Schema } from "mongoose";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IUser extends Document {
  email: string;
  displayName: string;
  password?: string;
  authProvider: "local" | "google" | "github";
  providerId: string | null;
  avatar: string | null;
  about: string;
  isOnline: boolean;
  lastSeen: Date | null;
  socketId: string | null;
  isEmailVerified: boolean;
  emailVerificationToken: string | null;
  passwordResetToken: string | null;
  passwordResetExpiresAt: Date | null;
  isDeactivated: boolean;
  createdAt: Date;
  updatedAt: Date;

  toPublicProfile(): IUserPublicProfile;
}

export interface IUserPublicProfile {
  _id: mongoose.Types.ObjectId;
  displayName: string;
  email: string;
  avatar: string | null;
  about: string;
  isOnline: boolean;
  lastSeen: Date | null;
  createdAt: Date;
}

export interface IUserModel extends Model<IUser> {
  searchUsers(
    query: string,
    excludeUserId: mongoose.Types.ObjectId,
  ): mongoose.Query<IUser[], IUser>;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const userSchema = new Schema<IUser, IUserModel>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
      index: true,
    },

    displayName: {
      type: String,
      required: [true, "Display name is required"],
      trim: true,
      minlength: [2, "Display name must be at least 2 characters"],
      maxlength: [50, "Display name cannot exceed 50 characters"],
    },

    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    authProvider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },

    providerId: {
      type: String,
      default: null,
    },

    avatar: {
      type: String,
      default: null,
    },

    about: {
      type: String,
      trim: true,
      maxlength: [139, "About status cannot exceed 139 characters"],
      default: "Hey there! I am using Connect.",
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
      default: null,
    },

    socketId: {
      type: String,
      default: null,
      select: false,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
      default: null,
      select: false,
    },

    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },

    passwordResetExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },

    isDeactivated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

userSchema.index({ authProvider: 1, providerId: 1 });
userSchema.index({ displayName: "text", email: "text" });

// ─── Virtuals ─────────────────────────────────────────────────────────────────

userSchema.virtual("conversations", {
  ref: "Conversation",
  localField: "_id",
  foreignField: "participants",
});

// ─── Instance methods ─────────────────────────────────────────────────────────

userSchema.methods.toPublicProfile = function (): IUserPublicProfile {
  return {
    _id: this._id,
    displayName: this.displayName,
    email: this.email,
    avatar: this.avatar,
    about: this.about,
    isOnline: this.isOnline,
    lastSeen: this.lastSeen,
    createdAt: this.createdAt,
  };
};

// ─── Static methods ───────────────────────────────────────────────────────────

userSchema.statics.searchUsers = function (
  query: string,
  excludeUserId: mongoose.Types.ObjectId,
) {
  return this.find(
    {
      $text: { $search: query },
      _id: { $ne: excludeUserId },
      isDeactivated: false,
    },
    { score: { $meta: "textScore" } },
  )
    .sort({ score: { $meta: "textScore" } })
    .select("displayName email avatar about isOnline lastSeen")
    .limit(20);
};

// ─── Model ────────────────────────────────────────────────────────────────────

const User = (mongoose.models.User ||
  mongoose.model<IUser, IUserModel>("User", userSchema)) as IUserModel;

export default User;
