import crypto from "crypto";
import mongoose, { Document, Model, Schema } from "mongoose";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IDeviceInfo {
  userAgent: string | null;
  ip: string | null;
  deviceLabel: string | null;
}

export interface IToken extends Document {
  user: mongoose.Types.ObjectId;
  tokenHash: string;
  deviceInfo: IDeviceInfo;
  expiresAt: Date;
  isRevoked: boolean;
  revokedAt: Date | null;
  familyId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTokenOptions {
  ttlDays?: number;
  userAgent?: string | null;
  ip?: string | null;
  familyId?: string | null;
}

export interface ITokenModel extends Model<IToken> {
  createToken(
    userId: mongoose.Types.ObjectId,
    options?: ICreateTokenOptions,
  ): Promise<{ tokenDoc: IToken; rawToken: string }>;

  verifyToken(rawToken: string): Promise<IToken>;

  revokeToken(rawToken: string): Promise<void>;

  revokeAllForUser(userId: mongoose.Types.ObjectId): Promise<void>;

  getActiveSessions(
    userId: mongoose.Types.ObjectId,
  ): mongoose.Query<IToken[], IToken>;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const deviceInfoSchema = new Schema<IDeviceInfo>(
  {
    userAgent: { type: String, default: null },
    ip: { type: String, default: null },
    deviceLabel: { type: String, default: null },
  },
  { _id: false },
);

const tokenSchema = new Schema<IToken, ITokenModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // SHA-256 hash of the raw token — raw token is never persisted
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    deviceInfo: {
      type: deviceInfoSchema,
      default: () => ({}),
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    familyId: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// TTL index — MongoDB auto-deletes expired tokens, no cron needed
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Revoke entire login family in one query
tokenSchema.index({ familyId: 1, isRevoked: 1 });

// ─── Static methods ───────────────────────────────────────────────────────────

tokenSchema.statics.createToken = async function (
  userId: mongoose.Types.ObjectId,
  {
    ttlDays = 30,
    userAgent = null,
    ip = null,
    familyId = null,
  }: ICreateTokenOptions = {},
): Promise<{ tokenDoc: IToken; rawToken: string }> {
  const rawToken = crypto.randomBytes(64).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + ttlDays);

  const tokenDoc: IToken = await this.create({
    user: userId,
    tokenHash,
    expiresAt,
    familyId: familyId ?? crypto.randomBytes(16).toString("hex"),
    deviceInfo: {
      userAgent,
      ip,
      deviceLabel: userAgent ? userAgent.substring(0, 120) : "Unknown device",
    },
  });

  return { tokenDoc, rawToken };
};

tokenSchema.statics.verifyToken = async function (
  rawToken: string,
): Promise<IToken> {
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const tokenDoc = await this.findOne({ tokenHash }).populate("user");

  if (!tokenDoc) {
    throw new Error("Invalid refresh token");
  }

  if (tokenDoc.isRevoked) {
    // Potential replay attack — revoke the entire family
    await this.updateMany(
      { familyId: tokenDoc.familyId },
      { isRevoked: true, revokedAt: new Date() },
    );
    throw new Error("Token reuse detected — all sessions invalidated");
  }

  if (tokenDoc.expiresAt < new Date()) {
    throw new Error("Refresh token has expired");
  }

  return tokenDoc;
};

tokenSchema.statics.revokeToken = async function (
  rawToken: string,
): Promise<void> {
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  await this.findOneAndUpdate(
    { tokenHash },
    { isRevoked: true, revokedAt: new Date() },
  );
};

tokenSchema.statics.revokeAllForUser = async function (
  userId: mongoose.Types.ObjectId,
): Promise<void> {
  await this.updateMany(
    { user: userId, isRevoked: false },
    { isRevoked: true, revokedAt: new Date() },
  );
};

tokenSchema.statics.getActiveSessions = function (
  userId: mongoose.Types.ObjectId,
) {
  return this.find(
    {
      user: userId,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    },
    "deviceInfo createdAt expiresAt familyId",
  ).sort({ createdAt: -1 });
};

// ─── Model ────────────────────────────────────────────────────────────────────

const Token = (mongoose.models.Token ||
  mongoose.model<IToken, ITokenModel>("Token", tokenSchema)) as ITokenModel;

export default Token;
