import express from "express";
import { loginUser, logoutUser, registerUser, getUser, refreshToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", getUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshToken);

export default router;