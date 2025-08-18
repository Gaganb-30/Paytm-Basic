const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user");

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});
