import express from "express";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import authRoutes from "./modules/auth/auth.routes.js";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// initialize passport (no sessions)
app.use(passport.initialize());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Running with TSX 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
