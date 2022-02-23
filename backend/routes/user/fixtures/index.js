const express = require("express");
const router = express.Router();
const moment = require("moment");
const { Country, Fixture } = require("../../../db");
// const { Op } = require("sequelize");
const fs = require("fs");

async function fetchFixturesByDate(date) {
  const beginTime = moment(date, "YYYY-MM-DD").startOf("day").unix();
  const endTime = moment(date, "YYYY-MM-DD").endOf("day").unix();
  let countries = await Country.findAll({
    where: {},
    attributes: ["name", "id", ["iso2", "iso"]],

    include: [
      {
        model: Fixture,
        as: "fixtures",
        where: { timestamp: { [Op.gte]: beginTime, [Op.lte]: endTime } },
        attributes: ["id", "country_id", "timestamp"],
      },
    ],
  });
  const countries_obj = {};
  for (var country of countries) {
    country = country.toJSON();
    const fixture_ids = country.fixtures.map((fixture) => fixture.id);
    const data = {
      ...country,
      fixture_ids,
      fixtures: [],
      hidden: false,
    };
    countries_obj[country.id] = data;
  }

  return countries_obj;
}

router.get("/", async (req, res) => {
  try {
    const date = req.query.date || moment.utc().format("YYYY-MM-DD");
    const fixtures = await Fixture.findByDateGrouped(date);
    return res.send(fixtures);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { searchText, type } = req.query;
    const fixtures = await Fixture.search(searchText, type);
    return res.send(fixtures);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.get("/live", async (req, res) => {
  try {
    const { page } = req.query;
    const fixtures = await Fixture.findLive(page);
    res.json(fixtures);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.post("/sorted", async (req, res) => {
  try {
    const date = req.body.date || moment.utc().format("YYYY-MM-DD");
    const { page, ft_results, sort_by_time, upcoming, filters } = req.body;
    const [fixtures, total] = await Fixture.findByDateSorted(
      date,
      page,
      sort_by_time,
      ft_results,
      upcoming,
      filters
    );
    res.json({ fixtures, total });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.get("/live-feed", async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids || ids.length > 500) {
      return res.send([]);
    }
    const fixtures = await Fixture.findLiveFeed(ids);
    res.json(fixtures);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.get("/ids", async (req, res) => {
  try {
    console.log(req.query.fixture_ids);
    const fixtures = await Fixture.findByIds(req.query.fixture_ids);
    res.json(fixtures);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.get("/:fixture_id", async (req, res) => {
  try {
    const { fixture_id } = req.params;
    const fixture = await Fixture.findByFixtureId(fixture_id);
    res.json(fixture);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

module.exports = router;
