const express = require("express");
const router = express.Router();
const moment = require("moment");
const { Fixture } = require("@root/db");

const H2HFormatter = require("./H2HFormatter");

const h2hformatter = new H2HFormatter();
const Sportmonks = require("@root/uploaders/Sportmonks");
const API = new Sportmonks();

router.get("/results/", async (req, res) => {
  try {
    var { fixture_id } = req.query;
    return res.send(await getResults(fixture_id));
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});
router.get("/:fixture_id", async (req, res) => {
  try {
    const { fixture_id } = req.params;
    const fixture = await Fixture.fetchStats(fixture_id);
    return res.send(fixture);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

function getAll(ApiData) {
  return {
    home: h2hformatter.overall_stats(ApiData.home),
    away: h2hformatter.overall_stats(ApiData.away),
    all: h2hformatter.overall_stats(ApiData.all)
  };
}

async function getResults(fixture_id) {
  var fixture = await Fixture.findOne(
    {
      fixture_id
    },
    { home_id: 1, away_id: 1, season_id: 1 }
  );
  // console.log("FIX", fixture);
  var { home_id, away_id, season_id } = fixture;
  var h2hApiData = await API.getHead2Head(home_id, away_id);
  // console.log(h2hApiData);
  var h2h = h2hformatter.overall_stats(h2hApiData);

  var homeApiData = await API.getTeamFixturesMinimal(home_id, season_id);
  var awayApiData = await API.getTeamFixturesMinimal(away_id, season_id);

  var home = getAll(homeApiData);
  var away = getAll(awayApiData);
  const res = {
    h2h,
    home,
    away
  };
  await Fixture.findOneAndUpdate(
    { fixture_id },
    { h2h_results: res, h2h_updated: true }
  );
  return res;
}

module.exports = router;
