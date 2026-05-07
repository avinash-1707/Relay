import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import authRoutes from "./modules/auth/auth.routes.js";
import conversationRoutes from "./modules/conversation/conversation.routes.js";
import messageRoutes from "./modules/message/message.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import dbConnect from "./config/db.js";
import env from "./config/env.js";
import { initSocket } from "./socket/index.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
await dbConnect();

app.use(
  cors({
    origin: env.APP_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  const startedAt = process.hrtime.bigint();

  res.on("finish", () => {
    const endedAt = process.hrtime.bigint();
    const durationMs = Number(endedAt - startedAt) / 1_000_000;
    const contentLength = res.getHeader("content-length") ?? "-";
    const ip = req.ip || req.socket.remoteAddress || "-";
    const userAgent = req.get("user-agent") || "-";

    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs.toFixed(2)}ms ${contentLength}b ip=${ip} ua="${userAgent}"`,
    );
  });

  next();
});

app.use(passport.initialize());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/conversations", conversationRoutes);
app.use("/api/v1/conversations/:conversationId/messages", messageRoutes);
app.use("/api/v1/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Running with TSX 🚀");
});

app.use(errorMiddleware);

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
