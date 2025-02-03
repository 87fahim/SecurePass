import db from "../db/connection.js";
import { ObjectId } from "mongodb";

/**
 * Get all users (excluding passwords)
 */
export const getAllUsers = async (req, res) => {
    try {
        const usersCollection = db.collection("users");
        const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};

/**
 * Get all stored data
 */
export const getAllData = async (req, res) => {
    try {
        const dataCollection = db.collection("data");
        const data = await dataCollection.find({}).toArray();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data", error });
    }
};

/**
 * Delete a user
 */
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const usersCollection = db.collection("users");
        const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};

/**
 * Delete a stored data record
 */
export const deleteData = async (req, res) => {
    const { id } = req.params;
    try {
        const dataCollection = db.collection("data");
        const result = await dataCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Data not found" });
        }

        res.status(200).json({ message: "Data deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting data", error });
    }
};

/**
 * Update user details
 */
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const usersCollection = db.collection("users");
        const result = await usersCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
};

/**
 * Reset user password
 */
export const resetUserPassword = async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;

    try {
        const usersCollection = db.collection("users");
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const result = await usersCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { password: hashedPassword } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error resetting password", error });
    }
};
