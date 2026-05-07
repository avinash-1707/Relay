import { Request, Response, NextFunction } from "express";
import { Readable } from "stream";
import cloudinary from "../../config/cloudinary.js";

function resourceType(mime: string): "image" | "video" | "raw" {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("audio/") || mime.startsWith("video/")) return "video";
  return "raw";
}

export const upload = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file provided" });
      return;
    }

    const { buffer, mimetype, originalname, size } = req.file;
    const rType = resourceType(mimetype);

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: rType, folder: "relay" },
        (err, data) => (err ? reject(err) : resolve(data!)),
      );
      Readable.from(buffer).pipe(stream);
    });

    res.json({
      url: result.secure_url,
      fileType: mimetype,
      fileName: originalname,
      fileSize: size,
    });
  } catch (err) {
    next(err);
  }
};
