import { Server, Socket } from "socket.io";
import mongoose from "mongoose";
import User from "../modules/user/user.model.js";
import Conversation from "../modules/conversation/conversation.model.js";
import { SOCKET_EVENTS, PresenceEvent } from "@relay/shared";

export async function handlePresenceConnect(
  io: Server,
  socket: Socket,
  userId: string,
): Promise<void> {
  const uid = new mongoose.Types.ObjectId(userId);

  await User.findByIdAndUpdate(uid, {
    isOnline: true,
    socketId: socket.id,
    lastSeen: null,
  });

  const conversations = await Conversation.find(
    { participants: uid },
    { _id: 1 },
  ).lean();

  const roomIds = conversations.map((c) => c._id.toString());
  if (roomIds.length) await socket.join(roomIds);

  const event: PresenceEvent = { userId, isOnline: true, lastSeen: null };
  for (const roomId of roomIds) {
    socket.to(roomId).emit(SOCKET_EVENTS.PRESENCE_UPDATE, event);
  }
}

export async function handlePresenceDisconnect(
  io: Server,
  socket: Socket,
  userId: string,
): Promise<void> {
  const uid = new mongoose.Types.ObjectId(userId);
  const lastSeen = new Date();

  await User.findByIdAndUpdate(uid, {
    isOnline: false,
    socketId: null,
    lastSeen,
  });

  const conversations = await Conversation.find(
    { participants: uid },
    { _id: 1 },
  ).lean();

  const event: PresenceEvent = {
    userId,
    isOnline: false,
    lastSeen: lastSeen.toISOString(),
  };

  for (const c of conversations) {
    io.to(c._id.toString()).emit(SOCKET_EVENTS.PRESENCE_UPDATE, event);
  }
}
