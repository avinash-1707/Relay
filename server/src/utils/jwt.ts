import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import env from "../config/env.js";

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
}

const ACCESS_SECRET: string = env.JWT_ACCESS_SECRET as string;

if (!ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET is not defined");
}

export const signAccessToken = (userId: string): string => {
  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: (env.JWT_ACCESS_EXPIRES as SignOptions["expiresIn"]) ?? "15m",
  };

  return jwt.sign({ sub: userId }, ACCESS_SECRET, options);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const decoded = jwt.verify(token, ACCESS_SECRET);

  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }

  return decoded as AccessTokenPayload;
};

export default {
  signAccessToken,
  verifyAccessToken,
};
