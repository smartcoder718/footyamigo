const express = require("express");
const router = express.Router();
const { Country } = require("../../db");

router.get("/", async (req, res) => {
  try {
    const countries = await Country.findAll();
    res.json(countries);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});
/*
router.get("/id/:id", async (req, res) => {
  try {
    var country = await Country.findOne({
      "homeStats.league_id": 567,
    }).populate("homeStats");
    res.send(country);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});
*/
module.exports = router;
