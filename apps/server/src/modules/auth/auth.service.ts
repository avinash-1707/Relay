import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import Token from "./token.model.js";
import User from "../user/user.model.js";
import { signAccessToken } from "../../utils/jwt.js";
import env from "../../config/env.js";
import nodemailer from "nodemailer";

const SALT_ROUNDS = 12;
const OTP_TTL_MINUTES = 10;

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST || undefined,
  port: env.SMTP_PORT || 587,
  auth: env.SMTP_USER
    ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
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
    path: "/api/v1/auth",
  });
};

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const buildOtpEmail = (name: string, code: string) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#060912;font-family:'DM Sans',-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060912;padding:40px 0;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#0D1221;border:1px solid rgba(245,166,35,0.15);border-radius:16px;overflow:hidden;">
        <tr><td height="3" style="background:linear-gradient(90deg,#F5A623,#2B7FFF,#8B5CF6);"></td></tr>
        <tr>
          <td align="center" style="padding:32px 40px 20px;">
            <div style="font-family:monospace;font-size:20px;font-weight:800;letter-spacing:0.15em;color:#F5A623;text-transform:uppercase;">RELAY</div>
            <div style="font-family:monospace;font-size:10px;color:rgba(245,166,35,0.5);letter-spacing:0.2em;margin-top:4px;text-transform:uppercase;">Secure Access // OTP Verification</div>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px 32px;">
            <p style="color:#F0F0F8;font-size:16px;margin:0 0 10px;">Hi ${name},</p>
            <p style="color:rgba(240,240,248,0.5);font-size:14px;line-height:1.6;margin:0 0 28px;">
              Your verification code for Relay is below. It expires in ${OTP_TTL_MINUTES} minutes.
            </p>
            <div style="text-align:center;background:rgba(245,166,35,0.06);border:1px solid rgba(245,166,35,0.2);border-radius:12px;padding:28px;margin-bottom:28px;">
              <div style="font-family:monospace;font-size:44px;font-weight:800;letter-spacing:0.35em;color:#F5A623;text-shadow:0 0 24px rgba(245,166,35,0.4);">${code}</div>
            </div>
            <p style="color:rgba(240,240,248,0.3);font-size:12px;line-height:1.6;margin:0;text-align:center;">
              If you didn't request this code, you can safely ignore this email.<br>
              Never share this code with anyone.
            </p>
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid rgba(245,166,35,0.07);padding:20px 40px;text-align:center;">
            <p style="color:rgba(240,240,248,0.18);font-size:11px;margin:0;letter-spacing:0.02em;">
              &copy; ${new Date().getFullYear()} Relay &middot; Encrypted in transit &middot; SOC 2 Type II
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

const sendOtpEmail = async (to: string, code: string, name: string) => {
  await transporter.sendMail({
    to,
    from: env.SMTP_USER
      ? `Relay <${env.SMTP_USER}>`
      : `no-reply@${new URL(env.SERVER_URL).hostname}`,
    subject: `${code} is your Relay verification code`,
    text: `Your Relay verification code is: ${code}\n\nIt expires in ${OTP_TTL_MINUTES} minutes.\n\nNever share this code with anyone.`,
    html: buildOtpEmail(name, code),
  });
};

export const signup = async (
  email: string,
  password: string,
  displayName: string,
): Promise<{ requiresOtp: boolean }> => {
  const existing = await User.findOne({ email });

  if (existing) {
    if (existing.authProvider !== "local") {
      // Existing OAuth account — save new password + send OTP so they can log in with email/password too
      const hashed = await bcrypt.hash(password, SALT_ROUNDS);
      const code = generateOtp();
      await User.findByIdAndUpdate(existing._id, {
        password: hashed,
        verificationCode: code,
        verificationCodeExpiresAt: new Date(
          Date.now() + OTP_TTL_MINUTES * 60 * 1000,
        ),
      });
      try {
        await sendOtpEmail(existing.email, code, existing.displayName);
      } catch (err) {
        console.error("Failed to send OTP email", err);
      }
      return { requiresOtp: true };
    }
    throw new Error("Email already in use");
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const code = generateOtp();

  await User.create({
    email,
    password: hashed,
    displayName,
    authProvider: "local",
    isEmailVerified: false,
    verificationCode: code,
    verificationCodeExpiresAt: new Date(
      Date.now() + OTP_TTL_MINUTES * 60 * 1000,
    ),
  } as any);

  try {
    await sendOtpEmail(email, code, displayName);
  } catch (err) {
    console.error("Failed to send OTP email", err);
  }

  return { requiresOtp: false };
};

export const verifyOtp = async (
  email: string,
  code: string,
  req: Request,
  res: Response,
) => {
  const user = await User.findOne({ email }).select(
    "+verificationCode +verificationCodeExpiresAt",
  );

  if (!user || !user.verificationCode) {
    throw new Error("Invalid or expired code");
  }

  if (user.verificationCode !== code) {
    throw new Error("Invalid code");
  }

  if (
    !user.verificationCodeExpiresAt ||
    user.verificationCodeExpiresAt < new Date()
  ) {
    throw new Error("Code has expired. Please register again to get a new code.");
  }

  user.verificationCode = null;
  user.verificationCodeExpiresAt = null;
  user.isEmailVerified = true;
  await user.save();

  const accessToken = signAccessToken(String(user._id));

  const { rawToken } = await Token.createToken(
    user._id as any,
    {
      type: "REFRESH",
      ttlDays: env.REFRESH_TOKEN_TTL_DAYS,
      userAgent: req.get("user-agent") || null,
      ip: req.ip || null,
    },
  );

  setRefreshCookie(res, rawToken);

  return { accessToken };
};

export const login = async (
  email: string,
  password: string,
  req: Request,
  res: Response,
) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid credentials");

  if (!user.password)
    throw new Error("This account uses Google sign-in. Please sign in with Google.");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Invalid credentials");

  if (!user.isEmailVerified) throw new Error("Email not verified");

  const accessToken = signAccessToken(String(user._id));

  const { rawToken } = await Token.createToken(user._id as any, {
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
      await Token.revokeToken(raw, "REFRESH");
    } catch {
      // ignore
    }
  }
  res.clearCookie(cookieName, { path: "/api/v1/auth" });
};

export const refresh = async (req: Request, res: Response) => {
  const raw = req.cookies?.[cookieName];
  if (!raw) throw new Error("No refresh token provided");

  const tokenDoc = await Token.verifyToken(raw, "REFRESH");
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

export const getSessionStatus = async (req: Request) => {
  const raw = req.cookies?.[cookieName];
  if (!raw) return { active: false as const };

  try {
    const tokenDoc = await Token.verifyToken(raw, "REFRESH");
    const user = tokenDoc.user as any;
    if (!user) return { active: false as const };
    return {
      active: true as const,
      userId: String(user._id),
      expiresAt: tokenDoc.expiresAt,
    };
  } catch {
    return { active: false as const };
  }
};

export default {
  signup,
  verifyOtp,
  login,
  logout,
  refresh,
  getSessionStatus,
};
