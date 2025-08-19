require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user");
const accountRouter = require("./routes/account");
const { authenticateToken } = require("./middlewares/auth");
const connectMongoDB = require("./connection");

const PORT = process.env.PORT || 8000;
const app = express();
const MONGOURL = process.env.MONGO_URL;

connectMongoDB(MONGOURL).then(() => {
  console.log("Connected to MongoDB");
});

app.use(cors());
app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/account", authenticateToken, accountRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});
