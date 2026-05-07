import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import authRoutes from "./modules/auth/auth.routes.js";
import dbConnect from "./config/db.js";
import env from "./config/env.js";

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

// initialize passport (no sessions)
app.use(passport.initialize());

app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Running with TSX 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
