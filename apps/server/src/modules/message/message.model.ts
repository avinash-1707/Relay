import mongoose, { Document, Model, Schema } from "mongoose";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export type MessageType =
  | "text"
  | "image"
  | "file"
  | "audio"
  | "video"
  | "system";
export type DeliveryStatus = "sent" | "delivered" | "read";

export interface IReadReceipt {
  user: mongoose.Types.ObjectId;
  readAt: Date;
}

export interface IAttachment {
  url: string;
  fileType: string;
  fileName: string | null;
  fileSize: number | null;
}

export interface IReaction {
  emoji: string;
  users: mongoose.Types.ObjectId[];
}

export interface IMessage extends Document {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  body: string;
  messageType: MessageType;
  attachments: IAttachment[];
  replyTo: mongoose.Types.ObjectId | null;
  deliveryStatus: DeliveryStatus;
  readBy: IReadReceipt[];
  isDeleted: boolean;
  deletedAt: Date | null;
  isEdited: boolean;
  editedAt: Date | null;
  reactions: IReaction[];
  createdAt: Date;
  updatedAt: Date;

  markReadBy(userId: mongoose.Types.ObjectId): void;
  softDelete(): void;
  applyEdit(newBody: string): void;
}

export interface IMessageGetPageOptions {
  page?: number;
  limit?: number;
  before?: Date | null;
}

export interface IMessageModel extends Model<IMessage> {
  getMessagePage(
    conversationId: mongoose.Types.ObjectId,
    options?: IMessageGetPageOptions,
  ): mongoose.Query<IMessage[], IMessage>;
}

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const readReceiptSchema = new Schema<IReadReceipt>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    readAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const attachmentSchema = new Schema<IAttachment>(
  {
    url: { type: String, required: true },
    fileType: { type: String, required: true },
    fileName: { type: String, default: null },
    fileSize: { type: Number, default: null },
  },
  { _id: false },
);

const reactionSchema = new Schema<IReaction>(
  {
    emoji: { type: String, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { _id: false },
);

// ─── Schema ───────────────────────────────────────────────────────────────────

const messageSchema = new Schema<IMessage, IMessageModel>(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: [true, "Message must belong to a conversation"],
      index: true,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Message must have a sender"],
      index: true,
    },

    body: {
      type: String,
      trim: true,
      maxlength: [4096, "Message body cannot exceed 4096 characters"],
      default: "",
    },

    messageType: {
      type: String,
      enum: ["text", "image", "file", "audio", "video", "system"],
      default: "text",
    },

    attachments: {
      type: [attachmentSchema],
      default: [],
    },

    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    deliveryStatus: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },

    readBy: {
      type: [readReceiptSchema],
      default: [],
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    editedAt: {
      type: Date,
      default: null,
    },

    reactions: {
      type: [reactionSchema],
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

messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ conversation: 1, sender: 1, deliveryStatus: 1 });

// ─── Hooks ────────────────────────────────────────────────────────────────────

messageSchema.post("save", async function (doc: IMessage) {
  try {
    const Conversation = mongoose.model("Conversation");
    const conversation = await Conversation.findById(doc.conversation);
    if (!conversation) return;

    conversation.lastMessage = doc._id;
    conversation.lastMessageAt = doc.createdAt;
    conversation.incrementUnreadForOthers(doc.sender);

    await conversation.save();
  } catch (err) {
    console.error(
      "[Message post-save hook] Failed to update conversation:",
      (err as Error).message,
    );
  }
});

// ─── Instance methods ─────────────────────────────────────────────────────────

messageSchema.methods.markReadBy = function (
  userId: mongoose.Types.ObjectId,
): void {
  const alreadyRead = this.readBy.some(
    (r: IReadReceipt) => r.user.toString() === userId.toString(),
  );

  if (!alreadyRead) {
    this.readBy.push({ user: userId, readAt: new Date() });
    this.deliveryStatus = "read";
  }
};

messageSchema.methods.softDelete = function (): void {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.body = "";
  this.attachments = [];
  this.reactions = [];
};

messageSchema.methods.applyEdit = function (newBody: string): void {
  this.body = newBody.trim();
  this.isEdited = true;
  this.editedAt = new Date();
};

// ─── Model ────────────────────────────────────────────────────────────────────

const Message = (mongoose.models.Message ||
  mongoose.model<IMessage, IMessageModel>(
    "Message",
    messageSchema,
  )) as IMessageModel;

export default Message;
