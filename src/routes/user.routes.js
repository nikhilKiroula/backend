import { Router } from "express";
import { regsterUser } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(regsterUser)

export default router