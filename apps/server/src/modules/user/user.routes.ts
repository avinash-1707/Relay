import { Router } from "express";
import requireAuth from "../../middleware/auth.middleware.js";
import * as controller from "./user.controller.js";

const router = Router();

router.get("/me", requireAuth, controller.getMe);
router.patch("/me", requireAuth, controller.updateMe);
router.get("/search", requireAuth, controller.search);
router.get("/:id", requireAuth, controller.getById);

export default router;
