// password-manager/server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
  try {
    const { username, password, publicKey } = req.body;
    if (!username || !password || !publicKey) {
      return res.status(400).json({ error: "Username, password, and publicKey are required" });
    }

    // Check if user already exists
    // const existingUser = await User.findOne({ username });
    // if (existingUser) {
    //   return res.status(409).json({ error: "Username already taken" });
    // }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ username, passwordHash, publicKey });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
