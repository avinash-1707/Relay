import express from "express";
import rateLimit from "express-rate-limit";
import passport from "../../config/passport.js";
import controller from "./auth.controller.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/signup", authLimiter, controller.signup);
router.post("/login", authLimiter, controller.login);
router.get("/verify-email", controller.verifyEmail);

router.post("/refresh", controller.refresh);
router.post("/logout", controller.logout);

router.get("/google", passport.authenticate("google", { session: false }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  controller.googleCallback,
);

export default router;
