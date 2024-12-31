
import express from "express";
import db from "../db/connection.js"; 
import { verifyToken } from "../middleware/auth.js";
import Encrypter from "./Encrypter.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const { dataUsername, dataPassword, dataWebsite, dataNotes } = req.body;

    const encryptedUsername = Encrypter.encrypt(dataUsername);
    const encryptedPassword = Encrypter.encrypt(dataPassword);
    const encryptedWebsite = Encrypter.encrypt(dataWebsite);
    const encryptedNotes = Encrypter.encrypt(dataNotes);
    if (
      typeof encryptedUsername !== "string" ||
      typeof encryptedPassword !== "string" ||
      typeof encryptedWebsite !== "string" ||
      typeof encryptedNotes !== "string"
    ) {
      return res.status(500).json({
        message: "Encryptin data failed. Data was not saved.",
        data: { dataUsername, dataPassword, dataWebsite, dataNotes },
      });
    }
    console.log(encryptedUsername, encryptedPassword, encryptedWebsite,encryptedNotes )
    const dataCollection = db.collection("data");

    const result = await dataCollection.insertOne({
      username: req.user.username,
      dataUsername: encryptedUsername,
      dataPassword: encryptedPassword,
      dataWebsite: encryptedWebsite,
      dataNotes: encryptedNotes,
      createdAt: new Date(),
    });

    return res.status(201).json({
      message: "Data added successfully",
      data: { dataUsername, dataPassword, dataWebsite, dataNotes },
    });
  } catch (err) {
    console.error("Error adding data:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get all data entries for the authenticated user
router.get("/", verifyToken, async (req, res) => {
  try {
    const dataCollection = db.collection("data");
    const entries = await dataCollection
      .find({ username: req.user.username })
      .toArray();

    const decryptedEntries = entries.map((entry) => ({
      dataId: entry._id,
      dataUsername: Encrypter.decrypt(entry.dataUsername),
      dataPassword: Encrypter.decrypt(entry.dataPassword),
      dataWebsite: Encrypter.decrypt(entry.dataWebsite),
      dataNotes: Encrypter.decrypt(entry.dataNotes),
    }));

    return res.status(200).json(decryptedEntries);
  } catch (err) {
    console.error("Error fetching data:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a data entry
router.delete("/", verifyToken, async (req, res) => {
  try {
    const { dataId } = req.body;
    console.log('Recieved ID from click to deleted:', dataId);
    if (!dataId) {
      return res.status(400).json({ message: "Missing dataId" });
    }

    const dataCollection = db.collection("data");

    const entry = await dataCollection.findOne({ "_id": new ObjectId(dataId) });
    console.log(entry);
    if (!entry || entry.username !== req.user.username) {
      return res.status(403).json({ message: "Unauthorized or entry not found" });
    }

    // Perform deletion
    await dataCollection.deleteOne({ _id: new ObjectId(dataId) });

    return res.status(200).json({ message: "Entry deleted successfully" });
  } catch (err) {
    console.error("Error deleting entry:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/all", verifyToken, async (req, res) => {
  try {
    const dataCollection = db.collection("data");

    // Delete all entries for the current user
    const result = await dataCollection.deleteMany({ username: req.user.username });

    console.log(`Deleted ${result.deletedCount} entries for user ${req.user.username}`);
    return res.status(200).json({ message: `${result.deletedCount} entries deleted successfully` });
  } catch (err) {
    console.error("Error deleting all entries:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
