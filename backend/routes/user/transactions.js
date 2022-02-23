const express = require("express");
const router = express.Router();
const { Transaction } = require("@root/db");

router.get("/latest", async (req, res) => {
  try {
    console.log(req.user.user);
    const transaction = await Transaction.findLatest(req.user.user.email);
    res.send(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: true, message: "Internal server error" });
  }
});

module.exports = router;
