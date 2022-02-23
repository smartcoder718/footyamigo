const express = require("express");
const router = express.Router();
const { Outcome } = require("@root/db");

router.get("/", async function (req, res) {
  try {
    const outcomes = await Outcome.findActive();
    res.send(outcomes);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ success: false, message: "Interval server error occured" });
  }
});

module.exports = router;
