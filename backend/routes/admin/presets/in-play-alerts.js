const express = require("express");
const router = express.Router();
const { Strategy } = require("@root/db");


router.get("/", async (req, res) => {
  const user_id = req.user.user.id;
  const strategies = await Strategy.findAllByAdmin("in-play", user_id);
  res.json(strategies);
});

module.exports = router;
