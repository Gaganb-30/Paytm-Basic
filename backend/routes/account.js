const { Router } = require("express");
const { startSession } = require("mongoose");
const Account = require("../models/account");

const router = Router();

router.get("/balance", async (req, res) => {
  const account = await Account.findOne({ userID: req.user.userID });
  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }
  res.status(200).json({ balance: account.balance });
});

router.post("/transfer", async (req, res) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const { toUserID, amount } = req.body;
    const fromAccount = await Account.findOne({
      userID: req.user.userID,
    }).session(session);

    if (!fromAccount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Sender account not found" });
    }

    if (fromAccount.balance < amount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const toAccount = await Account.findOne({
      userID: toUserID,
    }).session(session);

    if (!toAccount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Recipient account not found" });
    }

    await Account.updateOne(
      {
        userID: req.user.userID,
      },
      {
        $inc: { balance: -amount },
      }
    ).session(session);

    await Account.updateOne(
      {
        userID: toUserID,
      },
      {
        $inc: { balance: amount },
      }
    ).session(session);

    await session.commitTransaction();
    session.endSession();
    res.json({ message: "Transfer successful" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Transfer failed", error: error.message });
  }
});

module.exports = router;
