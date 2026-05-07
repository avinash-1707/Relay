import { Request, Response, NextFunction, RequestHandler } from "express";

type FieldRule = { required?: boolean };
type Schema = Record<string, FieldRule>;

export function validate(schema: Schema): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    for (const [field, rules] of Object.entries(schema)) {
      const val = req.body[field];
      if (rules.required && (val === undefined || val === null || val === "")) {
        res.status(400).json({ message: `${field} is required` });
        return;
      }
    }
    next();
  };
}
