import { Router } from "express";
import requireAuth from "../../middleware/auth.middleware.js";
import * as controller from "./conversation.controller.js";

const router = Router();

router.get("/", requireAuth, controller.list);
router.post("/", requireAuth, controller.findOrCreate);
router.get("/:id", requireAuth, controller.getOne);
router.patch("/:id/read", requireAuth, controller.read);
router.patch("/:id/mute", requireAuth, controller.mute);
router.patch("/:id/archive", requireAuth, controller.archive);

export default router;
