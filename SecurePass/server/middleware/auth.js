// server/middleware/auth.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  try {
    // console.log("Authorization token is recieved by server: ", token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Decoded token: ', decoded);
    req.user = decoded; // Attach user info to request

    next();
  } catch (err) {
    console.error("Invalid token:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};
