import mongoose from "mongoose";
import Message from "./message.model.js";
import Conversation from "../conversation/conversation.model.js";

const SENDER_SELECT = "displayName email avatar about isOnline lastSeen";
const DEFAULT_LIMIT = 30;

export async function getMessages(
  userId: string,
  conversationId: string,
  before?: string,
  limit = DEFAULT_LIMIT,
) {
  const uid = new mongoose.Types.ObjectId(userId);
  const cid = new mongoose.Types.ObjectId(conversationId);

  const conv = await Conversation.findOne(
    { _id: cid, participants: uid },
    { _id: 1 },
  );
  if (!conv) throw new Error("Conversation not found");

  const query: Record<string, unknown> = { conversation: cid };
  if (before) query.createdAt = { $lt: new Date(before) };

  const rows = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(limit + 1)
    .populate("sender", SENDER_SELECT)
    .populate("replyTo", "body sender isDeleted");

  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore
    ? page[page.length - 1].createdAt.toISOString()
    : null;

  return { messages: page.reverse(), hasMore, nextCursor };
}

export async function sendMessage(
  userId: string,
  conversationId: string,
  body: string,
  messageType: "text" | "image" | "file" | "audio" | "video" | "system" = "text",
  replyTo?: string | null,
) {
  const uid = new mongoose.Types.ObjectId(userId);
  const cid = new mongoose.Types.ObjectId(conversationId);

  const conv = await Conversation.findOne(
    { _id: cid, participants: uid },
    { _id: 1 },
  );
  if (!conv) throw new Error("Conversation not found");

  const message = await Message.create({
    conversation: cid,
    sender: uid,
    body: body.trim(),
    messageType,
    replyTo: replyTo ? new mongoose.Types.ObjectId(replyTo) : null,
  });

  await message.populate("sender", SENDER_SELECT);
  return message;
}

export async function editMessage(
  userId: string,
  messageId: string,
  newBody: string,
) {
  const uid = new mongoose.Types.ObjectId(userId);
  const msg = await Message.findById(messageId);
  if (!msg) throw new Error("Message not found");
  if (msg.sender.toString() !== uid.toString()) throw new Error("Forbidden");
  if (msg.isDeleted) throw new Error("Cannot edit a deleted message");
  msg.applyEdit(newBody);
  await msg.save();
  return msg;
}

export async function deleteMessage(userId: string, messageId: string) {
  const uid = new mongoose.Types.ObjectId(userId);
  const msg = await Message.findById(messageId);
  if (!msg) throw new Error("Message not found");
  if (msg.sender.toString() !== uid.toString()) throw new Error("Forbidden");
  msg.softDelete();
  await msg.save();
  return msg;
}
