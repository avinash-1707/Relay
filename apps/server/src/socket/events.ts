import { Server, Socket } from "socket.io";
import mongoose from "mongoose";
import Message from "../modules/message/message.model.js";
import Conversation from "../modules/conversation/conversation.model.js";
import { SOCKET_EVENTS, SocketMessagePayload } from "@relay/shared";

const SENDER_SELECT = "displayName email avatar about isOnline lastSeen";

export function registerMessageEvents(
  io: Server,
  socket: Socket,
  userId: string,
): void {
  socket.on(
    SOCKET_EVENTS.MESSAGE_SEND,
    async (payload: SocketMessagePayload) => {
      try {
        const uid = new mongoose.Types.ObjectId(userId);
        const cid = new mongoose.Types.ObjectId(payload.conversationId);

        const conv = await Conversation.findOne(
          { _id: cid, participants: uid },
          { _id: 1 },
        );
        if (!conv) return;

        const message = await Message.create({
          conversation: cid,
          sender: uid,
          body: payload.body.trim(),
          messageType: payload.messageType ?? "text",
          replyTo: payload.replyTo
            ? new mongoose.Types.ObjectId(payload.replyTo)
            : null,
        });

        await message.populate("sender", SENDER_SELECT);

        io.to(payload.conversationId).emit(SOCKET_EVENTS.MESSAGE_NEW, message);
      } catch (err) {
        console.error("[socket message:send]", (err as Error).message);
      }
    },
  );

  socket.on(
    SOCKET_EVENTS.MESSAGE_READ,
    async ({
      messageId,
      conversationId,
    }: {
      messageId: string;
      conversationId: string;
    }) => {
      try {
        const uid = new mongoose.Types.ObjectId(userId);
        const msg = await Message.findById(messageId);
        if (!msg) return;
        msg.markReadBy(uid);
        await msg.save();
        io.to(conversationId).emit(SOCKET_EVENTS.MESSAGE_STATUS, {
          messageId,
          conversationId,
          deliveryStatus: msg.deliveryStatus,
          readBy: { userId, readAt: new Date().toISOString() },
        });
      } catch (err) {
        console.error("[socket message:read]", (err as Error).message);
      }
    },
  );
}
