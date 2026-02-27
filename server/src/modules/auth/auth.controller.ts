import { Request, Response, NextFunction } from "express";
import * as service from "./auth.service";
import Token from "./token.model";
import { signAccessToken } from "../../utils/jwt";
import env from "../../config/env";

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
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, displayName } = req.body;
    const user = await service.signup(email, password, displayName);
    res.status(201).json({ message: "User created. Verify your email." });
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = String(req.query.token || "");
    await service.verifyEmail(token);
    res.json({ message: "Email verified" });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const { accessToken } = await service.login(email, password, req, res);
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { accessToken } = await service.refresh(req, res);
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await service.logout(req, res);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// Called after Passport GoogleStrategy
export const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user: any = req.user;
    if (!user)
      return res.status(400).json({ message: "Authentication failed" });

    const accessToken = signAccessToken(String(user._id));
    const { rawToken } = await Token.createToken(user._id, {
      type: "REFRESH",
      ttlDays: env.REFRESH_TOKEN_TTL_DAYS,
      userAgent: req.get("user-agent") || null,
      ip: req.ip || null,
    });

    setRefreshCookie(res, rawToken);

    // Redirect to app; client can call /me to obtain profile using cookie
    res.redirect(env.APP_URL);
  } catch (err) {
    next(err);
  }
};

export default {
  signup,
  verifyEmail,
  login,
  refresh,
  logout,
  googleCallback,
};
