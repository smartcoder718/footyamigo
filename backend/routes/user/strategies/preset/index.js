const express = require("express");
const router = express.Router();
const { Strategy } = require("../../../../db");

router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    const strategies = await Strategy.findAllPreset(type);
    res.json(strategies);
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: true, message: "Internal server error" });
  }
});

router.get("/id", async (req, res) => {
  try {
    const { id } = req.query;
    const strategy = await Strategy.findPresetById(id);
    res.json(strategy);
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: true, message: "Internal server error" });
  }
});

module.exports = router;
