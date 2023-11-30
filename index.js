require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5054;

const app = express();

app.use(express.json());
app.use(cors());

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    app.listen(PORT, () => console.log(`Server 🚀started🚀 on port: ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

start();
