
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserById, findUserByUsername, insertUser } from "../models/userModel.js";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: "Username already taken" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await insertUser({ username, password: passwordHash, email });

    return res.status(201).json({ message: "User registered successfully", insertedId: result.insertedId });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    console.log('request: ', req.body)
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const user = await findUserByUsername(username);
    console.log('User found', user)
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    console.log('password match:', match)
    if (!match) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    res.json({ roles: [2000, 3000], accessToken: accessToken });
  } catch (err) {
    console.error("Error logging in:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get User
export const getUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header is required" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Access token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, ...userDetails } = user;
    res.json(userDetails);
  } catch (err) {
    console.error("Error getting the user:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Refresh Token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden, invalid refresh token." });
      }
      const newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ accessToken: newAccessToken });
    });
  } catch (err) {
    console.error("Error refreshing token:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Logout User
export const logoutUser = async (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
};

