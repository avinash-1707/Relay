import { useEffect, useRef, useCallback, useState } from "react";
import { useSocket } from "@/providers/SocketProvider";
import { SOCKET_EVENTS } from "@relay/shared";

const TYPING_TIMEOUT_MS = 3000;

export function useTyping(
  conversationId: string | null,
  displayName: string,
) {
  const { socket } = useSocket();
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    if (!socket || !conversationId) return;

    const onStart = ({
      conversationId: cid,
      userId,
      displayName: name,
    }: {
      conversationId: string;
      userId: string;
      displayName: string;
    }) => {
      if (cid !== conversationId) return;
      setTypingUsers((prev) => ({ ...prev, [userId]: name }));
    };

    const onStop = ({
      conversationId: cid,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => {
      if (cid !== conversationId) return;
      setTypingUsers((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
    };

    socket.on(SOCKET_EVENTS.TYPING_START, onStart);
    socket.on(SOCKET_EVENTS.TYPING_STOP, onStop);

    return () => {
      socket.off(SOCKET_EVENTS.TYPING_START, onStart);
      socket.off(SOCKET_EVENTS.TYPING_STOP, onStop);
    };
  }, [socket, conversationId]);

  // Clear typing state on conversation change
  useEffect(() => {
    setTypingUsers({});
  }, [conversationId]);

  const notifyTyping = useCallback(() => {
    if (!socket || !conversationId) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit(SOCKET_EVENTS.TYPING_START, { conversationId, displayName });
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      socket?.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId });
    }, TYPING_TIMEOUT_MS);
  }, [socket, conversationId, displayName]);

  const stopTyping = useCallback(() => {
    if (!socket || !conversationId) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (isTypingRef.current) {
      isTypingRef.current = false;
      socket.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId });
    }
  }, [socket, conversationId]);

  return { typingUsers, notifyTyping, stopTyping };
}
