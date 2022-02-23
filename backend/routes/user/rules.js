const express = require("express");
const router = express.Router();
const { Rule, Strategy } = require("../../db");



router.get("/pre-match", async (req, res) => {
  try {
    const pre_match_rules = await Rule.findAllPreMatch();
    // const pre_match_rules_obj = rulesAsObject(pre_match_rules);
    res.json(pre_match_rules);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.get("/in-play", async (req, res) => {
  try {
    const in_play_rules = await Rule.findAllInPlay();
    // const in_play_rules_obj = rulesAsObject(in_play_rules);
    res.json(in_play_rules);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

module.exports = router;

