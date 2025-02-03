

// server/index.js
import express from "express";
import cors from "cors";
import auth from "./routes/auth.js";
import data from "./routes/data.js";
import adminRoutes from './routes/admin.js'

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors({origin: "http://localhost:5173", credentials: true, methods: ["GET", "PUT", "POST", "DELETE"]}));

app.use(express.json());
app.use("/api/auth", auth); // Authentication routes
app.use("/api/data", data); // All data-related routes, including add, get, delete
app.use('/admin', adminRoutes);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
