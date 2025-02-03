// server/middleware/auth.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log("from verifyToken, token received: ", token)
  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  try {
    console.log("From verifyToken: ", token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request

    next();
  } catch (err) {
    console.error("Invalid token:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
      const usersCollection = db.collection("users");
      const user = await usersCollection.findOne({ _id: new ObjectId(req.user.id) });

      if (!user || user.role !== "admin") {
          return res.status(403).json({ message: "Admin access required" });
      }
      next();
  } catch (error) {
      res.status(500).json({ message: "Authorization error", error });
  }
};