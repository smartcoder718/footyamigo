const express = require("express");
const router = express.Router();
const { League, Country } = require("../../db");

router.get("/", async (req, res) => {
  try {
    const leagues = await League.findAll();
    res.json(leagues);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.get("/countries", async (req, res) => {
  try {
    const countries = await League.groupByCountries();
    res.json(countries);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

module.exports = router;
