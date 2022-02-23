const express = require("express");
const router = express.Router();
const { Strategy } = require("@root/db");

router.get("/toggle-preset/:id", async (req, res) => {
  const { id } = req.params;
  const strategies = await Strategy.togglePresetByAdmin(Number(id));
  res.json(strategies);
});


router.get("/toggle-public/:id", async (req, res) => {
  const { id } = req.params;
  const strategies = await Strategy.togglePublicByAdmin(Number(id));
  res.json(strategies);
});

router.get("/", async (req, res) => {
  const { page } = req.query;
  const types = {
    "in-play-alerts": "in-play",
    "pre-match-alerts": "pre-match"
  };
  const type = types[req.query.type];
  const user_id = req.user.user.id;
  const strategies = await Strategy.findAllByAdmin(type, user_id, page);
  res.json(strategies);
});

router.get("/active", async (req, res) => {
  const { page } = req.query;
  const types = {
    "in-play-alerts": "in-play",
    "pre-match-alerts": "pre-match"
  };
  const type = types[req.query.type];
  const user_id = req.user.user.id;
  const strategies = await Strategy.findActiveByAdmin(type, user_id, page);
  res.json(strategies);
});

// router.use("/in-play-alerts", require("./in-play-alerts"));
// router.use("/pre-match-alerts", require("./pre-match-alerts"));

module.exports = router;
