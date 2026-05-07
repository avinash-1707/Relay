import { Request, Response, NextFunction } from "express";
import * as service from "./user.service.js";

const param = (v: string | string[]): string =>
  Array.isArray(v) ? v[0] : v;

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await service.getMe((req as any).userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await service.updateMe((req as any).userId, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const search = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const q = (req.query.q as string) ?? "";
    const users = await service.searchUsers(q, (req as any).userId);
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await service.getUserById(param(req.params.id));
    res.json(user);
  } catch (err) {
    next(err);
  }
};
