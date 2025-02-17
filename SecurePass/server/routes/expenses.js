import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { insertData, findDataByUserId, deleteDataById, deleteAllDataByUserId } from "../models/ExpensesModel.js";
import Encrypter from "../utils/Encrypter.js";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {

    const { date, type, category, subCategory, occurrence, amount, card, description } = req.body;
    console.log("added new entry to the expenses", req.body)
    const encryptedData = {
      username: req.user.id,
      date: date,
      type: type,
      category: category,
      subCategory: subCategory,
      occurrence: occurrence,
      amount: amount,
      card: card,
      description: description,
      createdAt: new Date(),
    };

    const result = await insertData(encryptedData);
    return res.status(201).json({ message: "Data added successfully", insertedId: result.insertedId });
  } catch (err) {
    console.error("Error adding data:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/all", verifyToken, async (req, res) => {
  console.log("Request for all expenses data received")
  try {
    const entries = await findDataByUserId(req.user.id);
    const allEntries = entries.map(entry => ({
      username: req.user.id,
      date: entry.date,
      type: entry.type,
      category: entry.category,
      subCategory: entry.subCategory,
      occurrence: entry.occurrence,
      amount: entry.amount,
      card: entry.card,
      description: entry.description,
    }));
    console.log('sendingd all expenses data', allEntries);
    return res.status(200).json(allEntries);
  } catch (err) {
    console.error("Error fetching data:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/one", verifyToken, async (req, res) => {
  try {
    const { dataId } = req.body;
    if (!dataId) return res.status(400).json({ message: "Missing dataId" });

    const result = await deleteDataById(dataId);
    if (result.deletedCount === 0) return res.status(404).json({ message: "Entry not found" });

    return res.status(200).json({ message: "Entry deleted successfully" });
  } catch (err) {
    console.error("Error deleting entry:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/all", verifyToken, async (req, res) => {
  try {
    console.log("request to delete all expenses received.");
    const result = await deleteAllDataByUserId(req.user.id);
    console.log("Result of Delete", result);
    if (result.deletedCount === 0) {
      let temp = res.status(403).json({ message: "No entries found to delete" });
      console.log('Sending', temp.body)
      return temp;
    }

    return res.status(200).json({ message: `${result.deletedCount} entries deleted successfully` });
  } catch (err) {
    console.error("Error deleting all entries:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/bulk", verifyToken, async (req, res) => {
  try {
    const { expenses } = req.body;
    if (!expenses || !Array.isArray(expenses) || expenses.length === 0) {
      return res.status(400).json({ message: "Invalid CSV data" });
    }

    const encryptedData = expenses.map(expense => ({
      username: req.user.id,
      date: expense.date,
      type: expense.type,
      category: expense.category,
      subCategory: expense.subCategory,
      occurrence: expense.occurrence,
      amount: expense.amount,
      card: expense.card,
      description: expense.description,
      createdAt: new Date(),
    }));

    const result = await insertData(encryptedData); // Ensure `insertData` supports bulk insert
    return res.status(201).json({ message: "Expenses added successfully", insertedCount: result.insertedCount });
  } catch (err) {
    console.error("Error adding expenses:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
