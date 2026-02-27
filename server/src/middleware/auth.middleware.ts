import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const auth = req.get("authorization") || "";
    if (!auth.startsWith("Bearer "))
      return res.status(401).json({ message: "Unauthorized" });
    const token = auth.replace(/^Bearer\s+/, "");
    const payload = verifyAccessToken(token);
    (req as any).userId = payload.sub;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default requireAuth;
