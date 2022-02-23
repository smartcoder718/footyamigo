const { Fixture, QuickAlert } = require("../db");

function checkResult(fixture, { result }) {
  const { home_goals, away_goals } = fixture;
  const home_win = home_goals > away_goals;
  const draw = home_goals == away_goals;
  const away_win = home_goals < away_goals;
  const home_draw = home_win || draw;
  const away_draw = away_win || draw;
  const not_draw = home_win || away_win;
  const rules = {
    home_win,
    draw,
    away_win,
    home_draw,
    away_draw,
    not_draw
  };
  return rules[result];
}

function checkTimer(fixture, { minute, minute_equation }) {
  const { minute:elapsed } = fixture;
  if (minute_equation == "before") {
    return elapsed <= minute;
  } else if (minute_equation == "after") {
    return elapsed > minute;
  }
}

function checkStat(fixture, { equation, value, type }) {
  const { goals, corners, cards } = fixture;
  const actual_values = { goals, corners, cards };
  const actual_value = actual_values[type];
  if (equation == "=") {
    return actual_value == value;
  } else if (equation == "<") {
    return actual_value < value;
  } else if (equation == ">") {
    return actual_value > value;
  }
}

function checkAvailability() {
  return false;
}

function checkOdds() {
  return false;
}

function checkCondition(fixture, condition) {
  const { type } = condition;

  if (type == "odds") {
    return checkOdds(fixture, condition);
  }
  else if (type == "availability") {
    return checkAvailability(fixture, condition);
  }

  {
    if (!checkTimer(fixture, condition)) {
      return false;
    }
    if (type == "result") {
      return checkResult(fixture, condition);
    } else {
      return checkStat(fixture, condition);
    }
  }
}
async function sendQuickAlert(id) {
  const quick_alert = await QuickAlert.findByPk(id);
  await quick_alert.update({ status: "sent" });
  console.log(quick_alert.toJSON(), "HAS BEEN SENT");
}

async function checkFixture(fixture) {
  fixture.quickalerts.forEach(condition => {
    if (checkCondition(fixture, condition)) {
      sendQuickAlert(condition.id);
    }
  });
}

async function findLiveFixtures() {
  const fixtures = await Fixture.findAll({
    where: { id: 18326010 },
    include: [
      "liveodds",
      { model: QuickAlert, as: "quickalerts", where: { status: "pending" } }
    ]
    //status: "LIVE"
  });
  return fixtures;
}

async function findAndSendQuickAlerts() {
  const fixtures = await findLiveFixtures();
  fixtures.forEach(fixture => {
    checkFixture(fixture);
  });

  return null;
}
module.exports = {
  findAndSendQuickAlerts
};
