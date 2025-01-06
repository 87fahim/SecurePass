
import express from "express";
import db from "../db/connection.js"; 
import { verifyToken } from "../middleware/auth.js";
import Encrypter from "./Encrypter.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const { dataUsername, dataPassword, dataWebsite, dataNotes } = req.body;
    // console.log("Adding data to db: ", dataUsername, dataPassword, dataWebsite, dataNotes );
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
    // console.log(req.user.id);
    const result = await dataCollection.insertOne({
      username: req.user.id,
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
router.get("/all", verifyToken, async (req, res) => {
  try {
    console.log("Reading data from db: ", req.body);
    const dataCollection = db.collection("data");
    // console.log(req.user);
    // console.log(req.user._id);
    // console.log(req.user.id);
    const entries = await dataCollection
      .find({ username: req.user.id })
      .toArray();
    // console.log("Data from db: ", entries);
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
router.delete("/one", verifyToken, async (req, res) => {
  try {
    const { dataId } = req.body;
    console.log("delete one entry:", req.body);
    console.log(req.user);
    if (!dataId) {
      return res.status(400).json({ message: "Missing dataId" });
    }

    const dataCollection = db.collection("data");

    // Validate ObjectId format
    let objectId;
    try {
      objectId = new ObjectId(dataId);
    } catch (err) {
      return res.status(400).json({ message: "Invalid dataId format" });
    }

    // Find the entry in the database
    const entry = await dataCollection.findOne({ _id: objectId });
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    console.log("Entry from ui:", entry);
    if (entry.username !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this entry" });
    }

    // Delete the entry
    await dataCollection.deleteOne({ _id: objectId });

    return res.status(200).json({ message: "Entry deleted successfully" });
  } catch (err) {
    console.error("Error deleting entry:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
// router.delete("/", verifyToken, async (req, res) => {
//   try {
//     const { dataId } = req.body;
//     console.log('Recieved ID from click to deleted:', dataId);
//     if (!dataId) {
//       return res.status(400).json({ message: "Missing dataId" });
//     }

//     const dataCollection = db.collection("data");

//     const entry = await dataCollection.findOne({ "_id": new ObjectId(dataId) });
//     console.log(entry);
//     if (!entry || entry.username !== req.user.username) {
//       return res.status(403).json({ message: "Unauthorized or entry not found" });
//     }

//     // Perform deletion
//     await dataCollection.deleteOne({ _id: new ObjectId(dataId) });

//     return res.status(200).json({ message: "Entry deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting entry:", err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// });

router.delete("/all", verifyToken, async (req, res) => {
  try {
    const dataCollection = db.collection("data");

    // Delete all entries for the current user
    const result = await dataCollection.deleteMany({ username: req.user.id });

    console.log(`Deleted ${result.deletedCount} entries for user ${req.user.username}`);
    return res.status(200).json({ message: `${result.deletedCount} entries deleted successfully` });
  } catch (err) {
    console.error("Error deleting all entries:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
