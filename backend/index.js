const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const { PositionModel } = require("./models/PositionModel");
const { HoldingModel } = require("./models/HoldingModel");
const { OrderModel } = require("./models/OrderModel");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const MONGO_URL = process.env.MONGO_URL;

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Routes
app.get("/api/holdings", async (req, res) => {
  try {
    const holdings = await HoldingModel.find({});
    res.status(200).json({ success: true, data: holdings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/positions", async (req, res) => {
  try {
    const positions = await PositionModel.find({});
    res.status(200).json({ success: true, data: positions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/newOrder", async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    if (!name || !qty || !price || !mode)
      return res.status(400).send("Missing required fields");

    const newOrder = new OrderModel({ name, qty, price, mode });
    await newOrder.save();

    res.status(201).send("Order saved successfully");
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).send("Server error while saving order");
  }
});

// Check for Mongo URL
if (!MONGO_URL) {
  console.error("MONGO_URL not found in .env");
  process.exit(1);
}

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});
