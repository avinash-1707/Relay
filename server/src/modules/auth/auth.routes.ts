import express from "express";
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import passport from "../../config/passport.js";
import env from "../../config/env.js";
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

const oauthStateCookie = "google_oauth_state";

router.get("/google", (req, res, next) => {
  const state = crypto.randomBytes(24).toString("hex");
  const secure = process.env.NODE_ENV === "production";

  res.cookie(oauthStateCookie, state, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: 10 * 60 * 1000,
    path: "/api/v1/auth/google/callback",
  });

  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
    state,
  })(req, res, next);
});

router.get(
  "/google/callback",
  (req, res, next) => {
    const stateFromCookie = req.cookies?.[oauthStateCookie];
    const stateFromQuery = String(req.query.state || "");
    res.clearCookie(oauthStateCookie, { path: "/api/v1/auth/google/callback" });

    if (
      !stateFromCookie ||
      !stateFromQuery ||
      stateFromCookie !== stateFromQuery
    ) {
      return res.redirect(`${env.APP_URL}/login?error=oauth_state_mismatch`);
    }

    next();
  },
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${env.APP_URL}/login?error=oauth_failed`,
  }),
  controller.googleCallback,
);

export default router;
