import Router from "express";
import { generateToken } from "../controllers/exploreController.js";

const router = Router();

router.post("/token", generateToken);

export default router;

