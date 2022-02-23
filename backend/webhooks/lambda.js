const express = require("express");
const router = express.Router();

const { Transaction, User, Plan } = require("@root/db");

router.post("/unlink-telegram", async (req, res) => {
  const { user_id } = req.body;
  await User.delTelegram(user_id)
});

module.exports = router;
