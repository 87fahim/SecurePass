// routes/data.js
import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  insertData,
  findDataByUserId,
  deleteDataById,
  deleteAllDataByUserId,
} from "../models/dataModel.js";
import Encrypter from "../utils/Encrypter.js";

const router = express.Router();

/**
 * Create one password entry (encrypted at rest)
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { dataUsername, dataPassword, dataWebsite, dataNotes } = req.body;

    const encryptedData = {
      username: req.user.id, // owner (from verifyToken)
      dataUsername: Encrypter.encrypt(dataUsername || ""),
      dataPassword: Encrypter.encrypt(dataPassword || ""),
      dataWebsite: Encrypter.encrypt(dataWebsite || ""),
      dataNotes: Encrypter.encrypt(dataNotes || ""),
      createdAt: new Date(),
    };

    const result = await insertData(encryptedData);
    return res
      .status(201)
      .json({ message: "Data added successfully", insertedId: result.insertedId });
  } catch (err) {
    console.error("Error adding data:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Get all password entries for current user (decrypted)
 */
router.get("/all", verifyToken, async (req, res) => {
  try {
    console.log('Fahim')
    const entries
    = await findDataByUserId(req.user.id);

    const decryptedEntries = entries.map((entry) => ({
      dataId: entry._id?.toString?.() || entry._id,
      dataUsername: Encrypter.decrypt(entry.dataUsername),
      dataPassword: Encrypter.decrypt(entry.dataPassword),
      dataWebsite: Encrypter.decrypt(entry.dataWebsite),
      dataNotes: Encrypter.decrypt(entry.dataNotes),
      createdAt: entry.createdAt,
    }));

    return res.status(200).json(decryptedEntries);
  } catch (err) {
    console.error("Error fetching data:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Delete one password entry by id
 */
router.delete("/one", verifyToken, async (req, res) => {
  try {
    const { dataId } = req.body;
    if (!dataId) return res.status(400).json({ message: "Missing dataId" });

    const result = await deleteDataById(dataId);
    if (!result?.deletedCount) {
      return res.status(404).json({ message: "Entry not found" });
    }

    return res.status(200).json({ message: "Entry deleted successfully" });
  } catch (err) {
    console.error("Error deleting entry:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Delete all password entries for current user
 */
router.delete("/all", verifyToken, async (req, res) => {
  try {
    const result = await deleteAllDataByUserId(req.user.id);

    if (!result?.deletedCount) {
      return res.status(404).json({ message: "No entries found to delete" });
    }

    return res
      .status(200)
      .json({ message: `${result.deletedCount} entries deleted successfully` });
  } catch (err) {
    console.error("Error deleting all entries:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
