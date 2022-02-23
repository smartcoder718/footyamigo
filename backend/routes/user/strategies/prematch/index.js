const express = require("express");
const moment = require("moment");
const router = express.Router();
const { Strategy, Fixture } = require("@root/db");

const { buildPreMatchQuery } = require("@querybuilders/StrategyQueryBuilder");

async function getPastResults(strategy, page = 1) {
  const TimeNow = moment()
    .utc()
    .unix();
  const timestamp = { [Op.lte]: TimeNow };
  const order = [["timestamp", "DESC"]];
  console.log(strategy.outcomes);
  const fixtures = await getResults({ strategy, timestamp, order, page });
  return fixtures.map(fixture => {
    fixture = fixture.toJSON();
    var is_hit = true;
    for (var outcome of strategy.outcomes) {
      is_hit = is_hit && testOutcome(outcome, fixture);
    }
    fixture.is_hit = is_hit;
    console.log(is_hit);
    return fixture;
  });
}

router.get("/results/", async (req, res) => {
  try {
    const { id, page, date } = req.query;
    const strategy = await Strategy.findByIdWithRule(id);
    // console.log(strategy);
    const fixtures = await Fixture.findResults(strategy, "past", date, page);
    res.json({
      fixtures
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: true, message: "Internal server error" });
  }
});
router.get("/upcoming/", async (req, res) => {
  try {
    const { id, page, date } = req.query;
    const strategy = await Strategy.findByIdWithRule(id);
    // console.log(strategy);
    const fixtures = await Fixture.findResults(
      strategy,
      "upcoming",
      date,
      page
    );
    res.json({
      fixtures
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: true, message: "Internal server error" });
  }
});

// router.get("/", async (req, res) => {
//   const user_id = req.user.user.id;
//   const strategies = await Strategy.findAll("pre-match", user_id);
//   res.json(strategies);
// });

// router.get("/preset-alerts", async (req, res) => {
//   const user_id = req.user.user.id;
//   const strategies = await Strategy.findAll(
//     "pre-match",
//     user_id,
//     "preset-alerts"
//   );
//   res.json(strategies);
// });

// router.get("/explore-alerts", async (req, res) => {
//   const user_id = req.user.user.id;
//   const strategies = await Strategy.findAll(
//     "pre-match",
//     user_id,
//     "explore-alerts"
//   );
//   res.json(strategies);
// });

const { body, validationResult } = require("express-validator");

router.post(
  "/create",
  body("title").isLength({ min: 3, max: 50 }),
  body("strategy_prematch_rules").isArray({ min: 3, max: 20 }),
  async (req, res) => {
    try {
      const user_id = req.user.user.id;
      const strategy = await Strategy.create(req.body, "pre-match", user_id);
      // console.log("CREATED", strategy);
      //user.addStrategies(strategy)
      try {
        //await myScheduler.schedulePreMatchAlerts(strategy, user_id);
      } catch (error) {
        //console.log(error, "ERROR WHEN SCHEDULING FILTER", strategy);
      }

      res.send({ success: true, message: "Strategy created" });
    } catch (err) {
      console.error(err);
      res.status(500).send({ success: true, message: "Internal server error" });
    }
  }
);

// router.get("/id/:id", async (req, res) => {
//   try {
//     var { id } = req.params;
//     var strategy = await Strategy.findById(id);
//     res.send(strategy);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ success: true, message: "Internal server error" });
//   }
// });

module.exports = router;
