import { Request, Response, NextFunction } from "express";
import * as service from "./conversation.service.js";
import User from "../user/user.model.js";

const param = (v: string | string[]): string =>
  Array.isArray(v) ? v[0] : v;

export const list = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const conversations = await service.listConversations(
      (req as any).userId,
    );
    res.json(conversations);
  } catch (err) {
    next(err);
  }
};

export const findOrCreate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { targetEmail } = req.body;
    if (!targetEmail) {
      res.status(400).json({ message: "targetEmail is required" });
      return;
    }
    const target = await User.findOne({ email: targetEmail.toLowerCase().trim() });
    if (!target) {
      res.status(404).json({ message: "No user found with that email" });
      return;
    }
    if (String(target._id) === String((req as any).userId)) {
      res.status(400).json({ message: "Cannot start a conversation with yourself" });
      return;
    }
    const result = await service.findOrCreateDirect(
      (req as any).userId,
      String(target._id),
    );
    res.status(result.isNew ? 201 : 200).json(result.conversation);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const conv = await service.getConversation(
      (req as any).userId,
      param(req.params.id),
    );
    res.json(conv);
  } catch (err) {
    next(err);
  }
};

export const read = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await service.markRead((req as any).userId, param(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const mute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await service.toggleMute(
      (req as any).userId,
      param(req.params.id),
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const archive = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await service.toggleArchive(
      (req as any).userId,
      param(req.params.id),
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};
