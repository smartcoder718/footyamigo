const express = require("express");
const router = express.Router();
const moment = require("moment");
const { Fixture, Country, knex, Strategy } = require("@root/db");
// const { Op } = require("sequelize");
const fs = require("fs");

function groupByCountry(fixtures) {
  const countries = Object.assign(
    {},
    ...fixtures.map(fixture => {
      return {
        [fixture.country_id]: {
          fixture_ids: [],
          fixtures: [],
          hidden: false,
          id: fixture.country_id,
          iso: fixture.iso,
          name: fixture.country_name
        }
      };
    })
  );
  for (var fixture of fixtures) {
    const { country_id } = fixture;
    countries[country_id].fixtures.push(fixture);
    countries[country_id].fixture_ids.push(fixture.id);
  }
  return countries;
}

router.get("/", async (req, res) => {
  try {
    const strategies = await Strategy.findInPlayRestApi();
    return res.send(strategies);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.get("/countries", async (req, res) => {
  try {
    var date = req.query.date || moment().format("YYYY-MM-DD");
    var countries = await Country.fetchFixtures(date);
    return res.send(countries);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.get("/live", async (req, res) => {
  try {
    const fixtures = await Fixture.findLiveWithAggregates();
    const countries = groupByCountry(fixtures);
    res.json(countries);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.get("/ids", async (req, res) => {
  try {
    var fixtures = await Fixture.findByIds(req.query.ids);

    res.json(fixtures);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.get("/id/:fixture_id", async (req, res) => {
  try {
    var { fixture_id } = req.params;
    var fixture = await Fixture.findOneWithAggregates(fixture_id);
    res.json(fixture);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

module.exports = router;
