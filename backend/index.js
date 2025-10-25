const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const { PositionModel } = require("./models/PositionModel");

const app = express();
const PORT = process.env.PORT || 3002;
const MONGO_URL = process.env.MONGO_URL;

app.get("/addPositions", async (req, res) => {
  let tempPositions = [
    {
      product: "CNC",
      name: "EVEREADY",
      qty: 2,
      avg: 316.27,
      price: 312.35,
      net: "+0.58%",
      day: "-1.24%",
      isLoss: true,
    },
    {
      product: "CNC",
      name: "JUBLFOOD",
      qty: 1,
      avg: 3124.75,
      price: 3082.65,
      net: "+10.04%",
      day: "-1.35%",
      isLoss: true,
    },
  ];

  tempPositions.forEach((item) => {
    let newPosition = new PositionModel({
      product: item.product,
      name: item.name,
      qty: item.qty,
      avg: item.avg,
      price: item.price,
      net: item.net,
      day: item.day,
      isLoss: item.isLoss,
    });
    newPosition.save();
  });
  res.send("Done!");
});

if (!MONGO_URL) {
  console.error("MONGO_URL not found in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB connected!");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  });
