// // server/index.js
// import express from "express";
// import cors from "cors";
// import auth from "./routes/auth.js";
// import data from "./routes/data.js";
// const deleteEntryRoute = require('./routes/deleteEntry');


// const PORT = process.env.PORT || 5050;
// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use("/api/auth", auth); // Authentication routes
// app.use("/api/new-entry", data); // Mounts the `data.js` router under /api/new-entry
// app.use('/api/delete-entry', data);
// app.use('/api', deleteEntryRoute);

// // Start the Express server
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

// server/index.js
import express from "express";
import cors from "cors";
import auth from "./routes/auth.js";
import data from "./routes/data.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", auth); // Authentication routes
app.use("/api/data", data); // All data-related routes, including add, get, delete

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
