// routes/expenses.js
import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  insertData,
  findDataByUserId,
  deleteDataById,
  deleteAllDataByUserId,
} from "../models/expensesModel.js"; // 👈 match actual file casing

const router = express.Router();

/**
 * Create one expense
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { date, type, category, subCategory, occurrence, amount, card, description } = req.body;

    const doc = {
      username: req.user.id, // owner (from verifyToken)
      date,
      type,
      category,
      subCategory,
      occurrence,
      amount,
      card,
      description,
      createdAt: new Date(),
    };

    const result = await insertData(doc);
    return res
      .status(201)
      .json({ message: "Expense added successfully", insertedId: result.insertedId });
  } catch (err) {
    console.error("Error adding expense:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Get all expenses for current user
 */
router.get("/all", verifyToken, async (req, res) => {
  try {
    const entries = await findDataByUserId(req.user.id);

    const allEntries = entries.map((entry) => ({
      expenseId: entry._id?.toString?.() || entry._id,
      username: entry.username,
      date: entry.date,
      type: entry.type,
      category: entry.category,
      subCategory: entry.subCategory,
      occurrence: entry.occurrence,
      amount: entry.amount,
      card: entry.card,
      description: entry.description,
      createdAt: entry.createdAt,
    }));

    return res.status(200).json(allEntries);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Delete one expense by id
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
    console.error("Error deleting expense:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Delete all expenses for current user
 */
router.delete("/all", verifyToken, async (req, res) => {
  try {
    const result = await deleteAllDataByUserId(req.user.id);

    if (!result?.deletedCount) {
      // Not an authorization error; just nothing to delete
      return res.status(404).json({ message: "No entries found to delete" });
    }

    return res
      .status(200)
      .json({ message: `${result.deletedCount} entries deleted successfully` });
  } catch (err) {
    console.error("Error deleting all expenses:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Bulk create expenses (CSV import)
 */
router.post("/bulk", verifyToken, async (req, res) => {
  try {
    const { expenses } = req.body;
    if (!Array.isArray(expenses) || expenses.length === 0) {
      return res.status(400).json({ message: "Invalid CSV data" });
    }

    const docs = expenses.map((e) => ({
      username: req.user.id,
      date: e.date,
      type: e.type,
      category: e.category,
      subCategory: e.subCategory,
      occurrence: e.occurrence,
      amount: e.amount,
      card: e.card,
      description: e.description,
      createdAt: new Date(),
    }));

    // Ensure your model's insertData can handle arrays (bulk insert)
    const result = await insertData(docs);

    // Try to compute inserted count defensively
    const insertedCount =
      result?.insertedCount ??
      (result?.insertedIds ? Object.keys(result.insertedIds).length : undefined) ??
      (Array.isArray(docs) ? docs.length : 1);

    return res
      .status(201)
      .json({ message: "Expenses added successfully", insertedCount });
  } catch (err) {
    console.error("Error adding expenses:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
