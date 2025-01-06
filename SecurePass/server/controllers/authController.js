import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from "../db/connection.js";

const getUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header is required" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Access token is required" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database
    const collection = db.collection("users");
    const user = await collection.findOne({ _id: decoded.id });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Exclude sensitive information like password
    const { password, ...userDetails } = user;

    res.json(userDetails);
  } catch (err) {
    console.error("Error getting the user:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    console.log(req.body)
    console.log("Registering User: ", username, password)
    if (!username || !password) {
      return res.status(400).json({ error: "Username, password are required" });
    }

    const collection = db.collection("users");
    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already taken" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await collection.insertOne({
      username,
      password: passwordHash,
      email,
    });

    // res.status(201).json({ message: "User registered successfully" });
    return res
      .status(201)
      .json({ message: "User registered successfully", insertedId: result.insertedId });

  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    console.log(`finding ${username} in data`)
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

    console.log("Creating token for user:", user._id);
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Set refresh token in HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
    });
    console.log("User is logged in with access token:", accessToken);
    res.json({ accessToken });

  } catch (err) {
    console.error("Error logging in:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default { loginUser, registerUser, getUser };
