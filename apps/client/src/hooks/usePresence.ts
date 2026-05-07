import { useEffect, useState } from "react";
import { useSocket } from "@/providers/SocketProvider";
import { SOCKET_EVENTS, PresenceEvent } from "@relay/shared";

interface PresenceState {
  isOnline: boolean;
  lastSeen: string | null;
}

export function usePresence(): Record<string, PresenceState> {
  const { socket } = useSocket();
  const [presence, setPresence] = useState<Record<string, PresenceState>>({});

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = (event: PresenceEvent) => {
      setPresence((prev) => ({
        ...prev,
        [event.userId]: { isOnline: event.isOnline, lastSeen: event.lastSeen },
      }));
    };

    socket.on(SOCKET_EVENTS.PRESENCE_UPDATE, handleUpdate);
    return () => {
      socket.off(SOCKET_EVENTS.PRESENCE_UPDATE, handleUpdate);
    };
  }, [socket]);

  return presence;
}
