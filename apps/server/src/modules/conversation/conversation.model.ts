import mongoose, { Document, Model, Schema } from "mongoose";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IParticipantMeta {
  user: mongoose.Types.ObjectId;
  unreadCount: number;
  isArchived: boolean;
  isMuted: boolean;
  deletedAt: Date | null;
}

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  isGroup: boolean;
  groupName: string | null;
  groupAvatar: string | null;
  groupAdmin: mongoose.Types.ObjectId | null;
  lastMessage: mongoose.Types.ObjectId | null;
  lastMessageAt: Date | null;
  participantMeta: IParticipantMeta[];
  createdAt: Date;
  updatedAt: Date;

  incrementUnreadForOthers(senderId: mongoose.Types.ObjectId): void;
  markAsRead(userId: mongoose.Types.ObjectId): void;
}

export interface IConversationModel extends Model<IConversation> {
  findOrCreateDirect(
    userA: mongoose.Types.ObjectId,
    userB: mongoose.Types.ObjectId,
  ): Promise<{ conversation: IConversation; isNew: boolean }>;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const participantMetaSchema = new Schema<IParticipantMeta>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    unreadCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isMuted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false },
);

const conversationSchema = new Schema<IConversation, IConversationModel>(
  {
    participants: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      validate: {
        validator: (arr: mongoose.Types.ObjectId[]) => arr.length >= 2,
        message: "A conversation must have at least 2 participants",
      },
    },

    isGroup: {
      type: Boolean,
      default: false,
    },

    groupName: {
      type: String,
      trim: true,
      maxlength: [100, "Group name cannot exceed 100 characters"],
      default: null,
    },

    groupAvatar: {
      type: String,
      default: null,
    },

    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    lastMessageAt: {
      type: Date,
      default: null,
      index: true,
    },

    participantMeta: {
      type: [participantMetaSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

conversationSchema.index({ participants: 1, lastMessageAt: -1 });
conversationSchema.index({ participants: 1, isGroup: 1 }, { background: true });

// ─── Virtuals ─────────────────────────────────────────────────────────────────

conversationSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "conversation",
});

// ─── Instance methods ─────────────────────────────────────────────────────────

conversationSchema.methods.incrementUnreadForOthers = function (
  senderId: mongoose.Types.ObjectId,
): void {
  this.participantMeta.forEach((meta: IParticipantMeta) => {
    if (meta.user.toString() !== senderId.toString()) {
      meta.unreadCount += 1;
    }
  });
};

conversationSchema.methods.markAsRead = function (
  userId: mongoose.Types.ObjectId,
): void {
  const meta = this.participantMeta.find(
    (m: IParticipantMeta) => m.user.toString() === userId.toString(),
  );
  if (meta) meta.unreadCount = 0;
};

// ─── Static methods ───────────────────────────────────────────────────────────

conversationSchema.statics.findOrCreateDirect = async function (
  userA: mongoose.Types.ObjectId,
  userB: mongoose.Types.ObjectId,
): Promise<{ conversation: IConversation; isNew: boolean }> {
  const sorted = [userA, userB].sort((a, b) =>
    a.toString().localeCompare(b.toString()),
  );

  let conversation = await this.findOne({
    isGroup: false,
    participants: { $all: sorted, $size: 2 },
  });

  if (conversation) return { conversation, isNew: false };

  conversation = await this.create({
    isGroup: false,
    participants: sorted,
    participantMeta: sorted.map((id: mongoose.Types.ObjectId) => ({
      user: id,
    })),
  });

  return { conversation, isNew: true };
};

// ─── Model ────────────────────────────────────────────────────────────────────

const Conversation = (mongoose.models.Conversation ||
  mongoose.model<IConversation, IConversationModel>(
    "Conversation",
    conversationSchema,
  )) as IConversationModel;

export default Conversation;
