const { router } = requirre("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { authenticateToken } = require("../../middlewares/auth");

const JWT_SECRET = process.env.JWT_SECRET;

const signupBody = zod.object({
  firstName: zod.string(),
  lastName: zod.string(),
  userName: zod.string(),
  firstName: zod.string(),
});
router.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      msg: "Incorrect Inputs !!",
    });
  }

  const existingUser = await User.findOne({
    userName: req.body.userName,
  });
  if (!existingUser) {
    return res.status(411).json({
      msg: "Username alredy taken !!",
    });
  }
  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    password: req.body.password,
  });
  const token = jwt.sign(
    {
      userID: user._id,
    },
    JWT_SECRET
  );
  res.json({
    message: "User created successfully",
    token: token,
  });
});

const signinBody = zod.object({
  userName: zod.string(),
  password: zod.string(),
});
router.post("/signin", async (req, res) => {
  const success = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      msg: "Incorrect Inputs !!",
    });
  }

  const user = await User.findOne({ userName: req.body.userName });
  if (!user) {
    return res.status(404).json({
      msg: "User not found !!",
    });
  }
  if (user.password !== req.body.password) {
    return res.status(401).json({
      msg: "Incorrect password !!",
    });
  }
  const token = jwt.sign(
    {
      userID: user._id,
    },
    JWT_SECRET
  );
  res.json({
    message: "User signed in successfully",
    token: token,
  });
});

const updateBody = zod.object({
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
  password: zod.string().optional(),
});
router.put("/", authenticateToken, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      msg: "Incorrect Inputs !!",
    });
  }
  await User.findOneAndUpdate({ _id: req.user.userID }, req.body);
  res.json({
    message: "User updated successfully",
  });
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [{ firstName: { $regex: filter } }, { lastName: { $regex: filter } }],
  });
  res.json({
    user: users.map((user) => ({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
    })),
  });
});

module.exports = router;
