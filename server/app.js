import express from "express";
import dotenv from "dotenv";

import locationRoute from "./routes/location.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/location", locationRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
