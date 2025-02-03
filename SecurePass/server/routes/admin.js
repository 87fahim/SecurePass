import express from "express";
import {
    getAllUsers,
    getAllData,
    deleteUser,
    deleteData,
    updateUser,
    resetUserPassword
} from "../controllers/adminControllers.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// User management routes
router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.put("/user/:id", verifyToken, verifyAdmin, updateUser);
router.delete("/user/:id", verifyToken, verifyAdmin, deleteUser);
router.post("/user/:id/reset-password", verifyToken, verifyAdmin, resetUserPassword);

// Data management routes
router.get("/data", verifyToken, verifyAdmin, getAllData);
router.delete("/data/:id", verifyToken, verifyAdmin, deleteData);

export default router;
