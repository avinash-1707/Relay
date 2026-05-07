import { Server } from "socket.io";
import http from "http";
import { verifyAccessToken } from "../utils/jwt.js";
import env from "../config/env.js";
import { handlePresenceConnect, handlePresenceDisconnect } from "./presence.js";
import { registerMessageEvents } from "./events.js";
import { registerTypingEvents } from "./typing.js";

export let io: Server;

export function initSocket(server: http.Server): Server {
  io = new Server(server, {
    cors: {
      origin: env.APP_URL,
      credentials: true,
    },
    transports: ["websocket"],
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token as string | undefined;
      if (!token) return next(new Error("Unauthorized"));
      const payload = verifyAccessToken(token);
      (socket as any).userId = payload.sub as string;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = (socket as any).userId as string;
    await handlePresenceConnect(io, socket, userId);
    registerMessageEvents(io, socket, userId);
    registerTypingEvents(io, socket, userId);
    socket.on("disconnect", () => handlePresenceDisconnect(io, socket, userId));
  });

  return io;
}
