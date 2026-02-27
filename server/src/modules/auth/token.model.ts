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
  type: "EMAIL_VERIFY" | "REFRESH" | "RESET_PASSWORD";
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
  ttlMinutes?: number;
  userAgent?: string | null;
  ip?: string | null;
  familyId?: string | null;
  type?: "EMAIL_VERIFY" | "REFRESH" | "RESET_PASSWORD";
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

    // token type determines intended use and TTL semantics
    type: {
      type: String,
      enum: ["EMAIL_VERIFY", "REFRESH", "RESET_PASSWORD"],
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
    ttlMinutes,
    userAgent = null,
    ip = null,
    familyId = null,
    type = "REFRESH",
  }: ICreateTokenOptions = {},
): Promise<{ tokenDoc: IToken; rawToken: string }> {
  const rawToken = crypto.randomBytes(64).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  const expiresAt = new Date();
  if (typeof ttlMinutes === "number") {
    expiresAt.setMinutes(expiresAt.getMinutes() + ttlMinutes);
  } else {
    expiresAt.setDate(expiresAt.getDate() + ttlDays);
  }

  const tokenDoc: IToken = await this.create({
    user: userId,
    type,
    tokenHash,
    expiresAt,
    familyId:
      type === "REFRESH"
        ? (familyId ?? crypto.randomBytes(16).toString("hex"))
        : null,
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
  type?: "EMAIL_VERIFY" | "REFRESH" | "RESET_PASSWORD",
): Promise<IToken> {
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const query: any = { tokenHash };
  if (type) query.type = type;
  const tokenDoc = await this.findOne(query).populate("user");

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
  type?: "EMAIL_VERIFY" | "REFRESH" | "RESET_PASSWORD",
): Promise<void> {
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const query: any = { tokenHash };
  if (type) query.type = type;
  await this.findOneAndUpdate(query, {
    isRevoked: true,
    revokedAt: new Date(),
  });
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
