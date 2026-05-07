import { Router } from "express";
import requireAuth from "../../middleware/auth.middleware.js";
import * as controller from "./message.controller.js";

const router = Router({ mergeParams: true });

router.get("/", requireAuth, controller.list);
router.post("/", requireAuth, controller.send);
router.patch("/:msgId", requireAuth, controller.edit);
router.delete("/:msgId", requireAuth, controller.remove);

export default router;
