import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "@relay/shared";

export function registerTypingEvents(
  _io: Server,
  socket: Socket,
  userId: string,
): void {
  socket.on(
    SOCKET_EVENTS.TYPING_START,
    ({
      conversationId,
      displayName,
    }: {
      conversationId: string;
      displayName: string;
    }) => {
      socket
        .to(conversationId)
        .emit(SOCKET_EVENTS.TYPING_START, { conversationId, userId, displayName });
    },
  );

  socket.on(
    SOCKET_EVENTS.TYPING_STOP,
    ({ conversationId }: { conversationId: string }) => {
      socket
        .to(conversationId)
        .emit(SOCKET_EVENTS.TYPING_STOP, { conversationId, userId });
    },
  );
}
