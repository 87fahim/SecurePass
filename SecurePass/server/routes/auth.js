// server/routes/auth.js
import express from "express";
import db from "../db/connection.js"; // your MongoDB connection
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const collection = await db.collection("users");
    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already taken" });
    }

    // Hash the password before storing it (recommended!)
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the "users" collection
    const result = await collection.insertOne({ username, password: password, email: email});
    return res.status(201).json({ message: "User registered successfully", insertedId: result.insertedId });

  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const collection = await db.collection("users");
    const user = await collection.findOne({ username });
    console.log(user)
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Compare hashed password
    // const match = await bcrypt.compare(password, user.password);
    // if (!match) {
    //   return res.status(401).json({ error: "Invalid username or password" });
    // }

    if(password != user.password){
      return res.status(401).json({error: "Invalid username or password"})
    }

    // If using JWT, generate token here
    // ...

    return res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("Error logging in:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
