const express = require("express");
const router = express.Router();
const { Odd } = require("@root/db");
const attributes = require("./odd_attributes");

router.get("/", async (req, res) => {
  try {
    const { fixture_id } = req.query;
    const peak_odds = await Odd.find(fixture_id, "peakodds");
    const pre_odds = await Odd.find(fixture_id, "preodds");
    res.json({ peak_odds, pre_odds, attributes });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

module.exports = router;
