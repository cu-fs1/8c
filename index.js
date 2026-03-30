import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import loggerMiddleware from "./middleware/logger.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import logger from "./config/logger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);
// Rate limiter is applied granularly in routes to allow for different limits per endpoint

// Routes
app.use("/users", authRoutes);

// Base Route
app.get("/", (req, res) => {
  res.send("Welcome to the Banking API!");
});

// Error Handling Middleware (must be last)
app.use(errorMiddleware);


// Start Server
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
