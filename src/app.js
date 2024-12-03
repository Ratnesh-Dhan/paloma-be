import "dotenv/config";
import express from "express";
import cors from "cors";

import routes from "./routes/index.js";

const app = express();

app.use(
  cors({
    // origin: process.env.ALLOWED_ORIGINS?.split(",") || "http://localhost:3000",
    origin: process.env.ALLOWED_ORIGINS,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-Chat-UUID"],
    // allowedHeaders: ["*"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export default app;
