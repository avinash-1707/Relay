import dotenv from "dotenv";

dotenv.config();

const get = (key: string, required = true): string => {
  const v = process.env[key];
  if (required && !v) throw new Error(`Missing env var ${key}`);
  return v ?? "";
};

const env = {
  JWT_ACCESS_SECRET: get("JWT_ACCESS_SECRET"),
  JWT_ACCESS_EXPIRES: get("JWT_ACCESS_EXPIRES", false) || "15m",
  REFRESH_TOKEN_TTL_DAYS: Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7),
  GOOGLE_CLIENT_ID: get("GOOGLE_CLIENT_ID", false) || "",
  GOOGLE_CLIENT_SECRET: get("GOOGLE_CLIENT_SECRET", false) || "",
  APP_URL: get("APP_URL", false) || "http://localhost:3000",
  SMTP_HOST: get("SMTP_HOST", false) || "",
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_USER: get("SMTP_USER", false) || "",
  SMTP_PASS: get("SMTP_PASS", false) || "",
  COOKIE_DOMAIN: get("COOKIE_DOMAIN", false) || "",
};

export default env;
