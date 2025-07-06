import express from 'express';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/get-profile", getProfile);
router.get("/get-other-users", getOtherUsers);

export default router;