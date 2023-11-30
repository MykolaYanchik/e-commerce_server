require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const errorMiddlevare = require("./middlewares/errors");

const PORT = process.env.PORT || 5054;

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/api", authRouter);
app.use(errorMiddlevare);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    app.listen(PORT, () => console.log(`Server 🚀started🚀 on port: ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

start();
