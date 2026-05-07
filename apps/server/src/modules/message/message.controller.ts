import { Request, Response, NextFunction } from "express";
import * as service from "./message.service.js";
import { io } from "../../socket/index.js";
import { SOCKET_EVENTS } from "@relay/shared";

const param = (v: string | string[]): string =>
  Array.isArray(v) ? v[0] : v;

export const list = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { before, limit } = req.query;
    const result = await service.getMessages(
      (req as any).userId,
      param(req.params.conversationId),
      before as string | undefined,
      limit ? Number(limit) : undefined,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const send = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { body, messageType, replyTo } = req.body;
    if (!body?.trim()) {
      res.status(400).json({ message: "body is required" });
      return;
    }
    const conversationId = param(req.params.conversationId);
    const message = await service.sendMessage(
      (req as any).userId,
      conversationId,
      body,
      messageType,
      replyTo,
    );
    io.to(conversationId).emit(SOCKET_EVENTS.MESSAGE_NEW, message);
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
};

export const edit = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { body } = req.body;
    if (!body?.trim()) {
      res.status(400).json({ message: "body is required" });
      return;
    }
    const message = await service.editMessage(
      (req as any).userId,
      param(req.params.msgId),
      body,
    );
    res.json(message);
  } catch (err) {
    next(err);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const message = await service.deleteMessage(
      (req as any).userId,
      param(req.params.msgId),
    );
    res.json(message);
  } catch (err) {
    next(err);
  }
};
