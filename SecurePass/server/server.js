// server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

import auth from "./routes/auth.js";
import data from "./routes/data.js";
import adminRoutes from "./routes/admin.js";
import expenses from "./routes/expenses.js";
import chess from "./routes/chess.js";

const PORT = process.env.PORT || 5050;
const app = express();

// CORS must allow credentials and your dev origin
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "PUT", "POST", "DELETE"],
  })
);

app.use(cookieParser()); // ✅ read HttpOnly cookies
app.use(express.json());

app.use("/admin", adminRoutes);
app.use("/api/auth", auth);
app.use("/api/data", data);
app.use("/api/expenses", expenses);
app.use("/api/chess", chess);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
