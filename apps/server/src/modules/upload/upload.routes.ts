import { Router } from "express";
import requireAuth from "../../middleware/auth.middleware.js";
import { uploadMiddleware } from "../../middleware/upload.middleware.js";
import { upload } from "./upload.controller.js";

const router = Router();
router.post("/", requireAuth, uploadMiddleware, upload);
export default router;
