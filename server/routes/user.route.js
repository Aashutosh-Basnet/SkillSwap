import express from 'express';


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", );
router.get("/get-profile");
router.get("/get-other-users");

export default router;