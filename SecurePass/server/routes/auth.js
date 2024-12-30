import express from "express";
import db from "../db/connection.js"; // Your MongoDB connection
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    console.log('Register\nReceived from client:', { username, email }); // Avoid logging sensitive info

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const collection = db.collection("users");
    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already taken" });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the "users" collection
    const result = await collection.insertOne({
      username,
      password: hashedPassword,
      email,
    });

    return res
      .status(201)
      .json({ message: "User registered successfully", insertedId: result.insertedId });
  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login\nReceived from client:',  req.body); // Avoid logging sensitive info

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const collection = db.collection("users");
    const user = await collection.findOne({ username });
    console.log('Fetched user from db:', user); // Avoid logging sensitive info

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Compare hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error logging in:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
