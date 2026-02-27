import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Request, Response } from "express";
import Token from "./token.model.js";
import User from "../user/user.model.js";
import { signAccessToken } from "../../utils/jwt.js";
import env from "../../config/env.js";
import nodemailer from "nodemailer";

const SALT_ROUNDS = 12; // security: strong bcrypt cost

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST || undefined,
  port: env.SMTP_PORT || 587,
  auth: env.SMTP_USER
    ? {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      }
    : undefined,
});

const cookieName = "refreshToken";

const setRefreshCookie = (res: Response, token: string) => {
  const secure = process.env.NODE_ENV === "production";
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    domain: env.COOKIE_DOMAIN || undefined,
    path: "/api/auth/refresh",
  });
};

export const signup = async (
  email: string,
  password: string,
  displayName: string,
) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already in use");

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    email,
    password: hashed,
    displayName,
    authProvider: "local",
    isEmailVerified: false,
  } as any);

  // Create email verification token (15 minutes)
  const { rawToken } = await Token.createToken(user._id, {
    type: "EMAIL_VERIFY",
    ttlMinutes: 15,
  });

  // Send verification email (best-effort, don't fail signup if email fails)
  try {
    const verifyUrl = `${env.APP_URL}/api/auth/verify-email?token=${rawToken}`;
    await transporter.sendMail({
      to: user.email,
      from: env.SMTP_USER || `no-reply@${new URL(env.APP_URL).hostname}`,
      subject: "Verify your email",
      text: `Click to verify: ${verifyUrl}`,
      html: `<p>Click to verify your email: <a href="${verifyUrl}">Verify Email</a></p>`,
    });
  } catch (err) {
    // Log error server-side; do not leak to client
    console.error("Failed to send verification email", err);
  }

  return user;
};

export const verifyEmail = async (rawToken: string) => {
  const tokenDoc = await Token.verifyToken(rawToken);
  // mark user verified
  const user: any = tokenDoc.user;
  user.isEmailVerified = true;
  await user.save();
  // delete token
  await Token.deleteOne({ _id: tokenDoc._id });
  return user;
};

export const login = async (
  email: string,
  password: string,
  req: Request,
  res: Response,
) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid credentials");

  if (user.authProvider !== "local")
    throw new Error("Use external provider to login");

  const ok = await bcrypt.compare(password, user.password || "");
  if (!ok) throw new Error("Invalid credentials");

  if (!user.isEmailVerified) throw new Error("Email not verified");

  // Issue tokens
  const accessToken = signAccessToken(String(user._id));

  const { rawToken } = await Token.createToken(user._id, {
    type: "REFRESH",
    ttlDays: env.REFRESH_TOKEN_TTL_DAYS,
    userAgent: req.get("user-agent") || null,
    ip: req.ip || null,
  });

  setRefreshCookie(res, rawToken);

  return { accessToken };
};

export const logout = async (req: Request, res: Response) => {
  const raw = req.cookies?.[cookieName];
  if (raw) {
    try {
      // delete token so refresh cannot be used again
      const tokenDoc = await Token.verifyToken(raw);
      await Token.deleteOne({ _id: tokenDoc._id });
    } catch (err) {
      // ignore
    }
  }

  res.clearCookie(cookieName, { path: "/api/auth/refresh" });
  return;
};

export const refresh = async (req: Request, res: Response) => {
  const raw = req.cookies?.[cookieName];
  if (!raw) throw new Error("No refresh token provided");

  // Verify and rotate
  const tokenDoc = await Token.verifyToken(raw);
  // delete old token
  await Token.deleteOne({ _id: tokenDoc._id });

  const user = tokenDoc.user as any;
  if (!user) throw new Error("Invalid refresh token");

  const accessToken = signAccessToken(String(user._id));

  const { rawToken } = await Token.createToken(user._id, {
    type: "REFRESH",
    ttlDays: env.REFRESH_TOKEN_TTL_DAYS,
    userAgent: req.get("user-agent") || null,
    ip: req.ip || null,
    familyId: tokenDoc.familyId ?? undefined,
  });

  setRefreshCookie(res, rawToken);
  return { accessToken };
};

export default {
  signup,
  login,
  logout,
  verifyEmail,
  refresh,
};
