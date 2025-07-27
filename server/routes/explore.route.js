import Router from "express";
import { generateToken } from "../controllers/explore.controller.js";

const router = Router();

router.post("/token", generateToken);

export default router;

