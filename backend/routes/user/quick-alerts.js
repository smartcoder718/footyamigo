const express = require("express");
const router = express.Router();
const { Fixture, QuickAlert } = require("../../../db");

async function createQuickAlert({
  fixture_id,
  note,
  equation,
  market,
  market_key,
  market_label,
  market_name,
  minute,
  minute_equation,
  odds,
  odds_type,
  planner,
  result,
  type,
  value,
}) {
  const fixture = await Fixture.findOne({ where: { fixture_id } });
  const { timestamp: fixture_time } = fixture;
  let data;
  const required = {
    fixture_time,
    fixture_id,
    note,
    type,
    planner,
  };
  if (type == "odds") {
    data = {
      market,
      market_key,
      market_label,
      market_name,
      odds,
      odds_type,
    };
  } else {
    data = {
      equation,
      minute,
      minute_equation,
    };
    if (type == "result") {
      data["result"] = result;
    } else {
      data["value"] = value;
    }
  }
  const quick_alert = await QuickAlert.create({ ...required, ...data });
  return quick_alert;
}
router.post("/create", async (req, res) => {
  try {
    const quick_alert = await createQuickAlert(req.body);
    res.json(quick_alert);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

module.exports = router;
