import mongoose from "mongoose";
import Conversation from "./conversation.model.js";

const PARTICIPANT_SELECT = "displayName email avatar about isOnline lastSeen";
const LAST_MSG_POPULATE = {
  path: "lastMessage",
  select: "body sender createdAt deliveryStatus isDeleted messageType",
  populate: { path: "sender", select: "displayName avatar" },
};

export async function listConversations(userId: string) {
  const uid = new mongoose.Types.ObjectId(userId);
  return Conversation.find({ participants: uid })
    .sort({ lastMessageAt: -1 })
    .populate("participants", PARTICIPANT_SELECT)
    .populate(LAST_MSG_POPULATE);
}

export async function findOrCreateDirect(userId: string, targetId: string) {
  const userA = new mongoose.Types.ObjectId(userId);
  const userB = new mongoose.Types.ObjectId(targetId);
  return Conversation.findOrCreateDirect(userA, userB);
}

export async function getConversation(userId: string, conversationId: string) {
  const uid = new mongoose.Types.ObjectId(userId);
  const cid = new mongoose.Types.ObjectId(conversationId);
  const conv = await Conversation.findOne({ _id: cid, participants: uid })
    .populate("participants", PARTICIPANT_SELECT)
    .populate(LAST_MSG_POPULATE);
  if (!conv) throw new Error("Conversation not found");
  return conv;
}

export async function markRead(userId: string, conversationId: string) {
  const uid = new mongoose.Types.ObjectId(userId);
  const cid = new mongoose.Types.ObjectId(conversationId);
  const conv = await Conversation.findOne({ _id: cid, participants: uid });
  if (!conv) throw new Error("Conversation not found");
  conv.markAsRead(uid);
  await conv.save();
}

export async function toggleMute(userId: string, conversationId: string) {
  const uid = new mongoose.Types.ObjectId(userId);
  const cid = new mongoose.Types.ObjectId(conversationId);
  const conv = await Conversation.findOne({ _id: cid, participants: uid });
  if (!conv) throw new Error("Conversation not found");
  const meta = conv.participantMeta.find(
    (m) => m.user.toString() === uid.toString(),
  );
  if (!meta) throw new Error("Participant meta not found");
  meta.isMuted = !meta.isMuted;
  await conv.save();
  return { isMuted: meta.isMuted };
}

export async function toggleArchive(userId: string, conversationId: string) {
  const uid = new mongoose.Types.ObjectId(userId);
  const cid = new mongoose.Types.ObjectId(conversationId);
  const conv = await Conversation.findOne({ _id: cid, participants: uid });
  if (!conv) throw new Error("Conversation not found");
  const meta = conv.participantMeta.find(
    (m) => m.user.toString() === uid.toString(),
  );
  if (!meta) throw new Error("Participant meta not found");
  meta.isArchived = !meta.isArchived;
  await conv.save();
  return { isArchived: meta.isArchived };
}
