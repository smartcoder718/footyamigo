const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");
const StrategyFormatter = require("@root/formatters/StrategyFormatter");
const Streak = require("./Streak");
const Rule = require("../models/Rule");
const FixtureSchema = new Schema(
  {
    fixture_id: Number,
  },
  { strict: false }
);

// FixtureSchema.index({ fixture_name: 'text', league_name: 'text', country_name: 'text' });

const Fixture = mongoose.model("Fixture", FixtureSchema);
// FixtureSchema.

// createIndex(
//   { fixture_name: 'text', league_name: 'text', country_name: 'text' }
// )
const LIVE_STATUSES = ["LIVE", "HT", "PEN_LIVE", "BREAK", "ET"];

const ACTIVE_STATUSES = [
  "LIVE",
  "HT",
  "PEN_LIVE",
  "BREAK",
  "ET",
  "NS",
  "FT",
  "FT_PEN",
  "AET",
];
Fixture.findByDateGrouped = function (date) {
  date = moment.utc(date, "YYYY-MM-DD").toDate();
  return Fixture.aggregate([
    {
      $match: { date, status: { $in: ACTIVE_STATUSES } },
    },
    {
      $project: { fixture_id: 1, country_name: 1, iso: 1, country_id: 1 },
    },
    {
      $group: {
        _id: "$country_id",
        id: { $first: "$country_id" },
        name: { $first: "$country_name" },
        iso: { $first: "$iso" },
        fixture_ids: { $push: "$fixture_id" },
      },
    },
    { $sort: { name: 1 } },
    {
      $addFields: {
        fixtures: [],
        hidden: true,
      },
    },
  ]);
};

const getRequiredFields = () => {
  return {
    "home.last_25": 0,
    "home.last_7": 0,
    "home.last_5": 0,
    "home.last_10": 0,
    "away.last_25": 0,
    "away.last_7": 0,
    "away.last_5": 0,
    "away.last_10": 0,

    events_json: 0,
    goals_json: 0,
    cards_json: 0,
    //corners_json: 0,
    live_odds: 0,
    result: 0,
  };
};

const getAddFields = () => {
  return {
    ht_score: "$result.ht_score",
    ft_score: "$result.ft_score",
    events: "$events_json",
    corners: "$corners_json",
  };
};

Fixture.findByDateSorted = async function (
  date,
  page = 1,
  sort_by_time = false,
  ft_results = false,
  upcoming = false,
  filters
) {
  page = Math.max(Number(page || 1), 0);
  date = moment.utc(date, "YYYY-MM-DD").toDate();
  const perPage = 20;
  const skip = (page - 1) * perPage;
  const requiredFields = getRequiredFields();
  delete requiredFields["live_odds"];
  var extra_conditions = { status: { $in: ACTIVE_STATUSES } };
  if (ft_results) {
    Object.assign(extra_conditions, { status: { $in: ["FT", "FT_PEN"] } });
  }
  // console.log(upcoming)
  if (upcoming) {
    Object.assign(extra_conditions, {
      status: "NS",
      timestamp: { $gt: moment().unix() },
    });
  }
  // console.log(filters);
  if (filters && filters.length) {
    const pre_match_rules = await Rule.query().findByIds(
      filters.map((filter) => filter.rule_id)
    );
    // console.log(pre_match_rules);
    const pre_match_rules_map = Object.assign(
      {},
      ...pre_match_rules.map((rule) => {
        return {
          [rule.id]: rule,
        };
      })
    );
    console.log(pre_match_rules_map);
    filters = filters.map((filter) => {
      return {
        ...pre_match_rules_map[filter.rule_id],
        ...filter,
      };
    });
    // console.log(filters);
    const formatter = new StrategyFormatter();
    const [pre_match_conditions, pre_match_fields] =
      formatter.query_for_pre_match_rules({ strategy_prematch_rules: filters });
    Object.assign(extra_conditions, { $and: pre_match_conditions });
  }

  const conditions = [
    {
      $match: {
        ...extra_conditions,
        date,
      },
    },
    {
      $sort: { timestamp: 1 },
    },
  ];
  conditions.push(
    ...[
      { $skip: skip },
      { $limit: perPage },
      {
        $addFields: getAddFields(),
      },
      {
        $project: requiredFields,
      },
    ]
  );

  // var [total, strategies] = await Promise.all([
  //   query.resultSize(),
  //   query.offset(skip).limit(perPage),
  // ]);
  // if (sort_by_time) {
  //   query.push({
  //     $sort: { timestamp: 1 }
  //   });
  // }

  const fixtures = await Fixture.aggregate(conditions);
  const total = await Fixture.count({
    ...extra_conditions,
    date,
  });

  return [fixtures, total];
};

Fixture.findByIds = async function (ids) {
  return Fixture.aggregate([
    {
      $match: { fixture_id: { $in: ids.map((id) => Number(id)) } },
    },
    {
      $addFields: getAddFields(),
    },
    {
      $project: getRequiredFields(),
    },
    { $sort: { date_time: 1 } },
  ]);
};

Fixture.findByFixtureId = async function (id) {
  const fixtures = await Fixture.aggregate([
    {
      $match: { fixture_id: Number(id) },
    },
    {
      $addFields: getAddFields(),
    },
    {
      $project: {
        result: 0,
      },
    },
  ]);
  return fixtures[0];
};

Fixture.findLive = async function (page = 1) {
  page = Math.max(Number(page || 1), 0);
  const perPage = 50;
  const skip = (page - 1) * perPage;

  const requiredFields = getRequiredFields();
  delete requiredFields["live_odds"];
  const query = Fixture.aggregate([
    {
      $match: {
        status: { $in: [...LIVE_STATUSES] },
        date_time: {
          $gt: moment.utc().subtract(2, "hours").toDate(),
        },
      },
    },
    { $sort: { timestamp: -1 } },
    { $skip: skip },
    { $limit: perPage },
    {
      $addFields: getAddFields(),
    },
    {
      $project: requiredFields,
    },
  ]);
  const fixtures = await query;
  return fixtures;
};

Fixture.findLiveFeed = async function (ids = []) {
  ids = ids.map((id) => Number(id));
  const requiredFields = getRequiredFields();
  delete requiredFields["live_odds"];
  const query = Fixture.aggregate([
    {
      $match: {
        fixture_id: { $in: ids },
      },
    },
    {
      $addFields: getAddFields(),
    },
    {
      $project: requiredFields,
    },
  ]);
  const fixtures = await query;
  return fixtures;
};

Fixture.findResults = async function (
  strategy,
  type = "past",
  date = moment().utc().unix(),
  page = 1
) {
  page = Math.max(Number(page || 1), 0);
  console.log(date * 1000);
  date = moment
    .utc(date * 1000)
    .startOf("day")
    .toDate();
  const perPage = 50;
  const skip = (page - 1) * perPage;
  // console.log("types is", type);
  const formatter = new StrategyFormatter();
  const match = formatter.format(strategy);
  // console.log(JSON.stringify(match, null, 2));
  // console.log(match)
  var extra = {
    date,
  };
  var date_time = -1;
  if (type == "past") {
    Object.assign(extra, {
      status: { $in: ["FT", "FT_PEN"] },
      result_updated: true,
      "result.ft_score": { $ne: null },
      ["result." + strategy.outcome.code]: { $in: [true, false] },
    });
  } else {
    Object.assign(extra, {
      status: { $nin: ["FT", "FT_PEN"] },
      timestamp: { $gt: moment().unix() },
      //result_updated: true
    });
    date_time = 1;
  }
  Object.assign(match, extra);
  // console.log(match);
  // console.log(strategy.outcome);

  const fixtures = await Fixture.aggregate([
    {
      $match: {
        ...match,
        // $or: [{ "result.home_win": true }, { "result.away_win": true }]
      },
    },
    { $sort: { date_time } },
    { $skip: skip },
    { $limit: perPage },
    {
      $addFields: {
        ...getAddFields(),
        is_hit: { $eq: ["$result." + strategy.outcome.code, true] },
      },
    },
    {
      $project: getRequiredFields(),
    },
  ]);

  //TURN RESULTS TO PICKS
  // const Pick = require("./Pick");

  // for (var fixture of fixtures) {
  //   const sending_time = moment.utc(
  //     (fixture.timestamp - strategy.timer.minute) * 1000
  //   );

  //   await Pick.updateOne(
  //     { fixture_id: fixture["fixture_id"], strategy_id: strategy["id"] },
  //     {
  //       $set: {
  //         fixture_id: fixture["fixture_id"],
  //         user_id: strategy["user_id"],
  //         strategy_id: strategy["id"],
  //         league_id: fixture["league_id"],
  //         type: "pre-match",
  //         status: "sent",
  //         home_name: fixture["home_name"],
  //         away_name: fixture["away_name"],
  //         is_public: strategy["is_public"],
  //         minute: strategy["timer"]["minute"],
  //         extra_minute: null,
  //         sending_time: sending_time.unix(),
  //         _fixture_id: `${fixture["_id"]}`,
  //         _strategy_id: `${strategy["_id"]}`,
  //         created_at: sending_time.toDate(),
  //         updated_at: sending_time.toDate()
  //       }
  //     },
  //     { upsert: true }
  //   );
  // }

  return fixtures;
};

Fixture.getTodaysCount = function () {
  var date = moment.utc().startOf("day").toDate();
  return this.count({ date });
};

Fixture.getLiveCount = function () {
  return this.count({
    status: {
      $in: LIVE_STATUSES,
    },
    date_time: {
      $gt: moment.utc().subtract(2, "hours").toDate(),
    },
  });
};

Fixture.fetchBetBuilders = async function (query, outcome, limit = 100) {
  const now = moment().utc().unix();
  const twoDaysLater = moment().utc().add(2, "days").endOf("day").unix();
  const match = {
    $and: query,
    [`pre_odds.${outcome}`]: { $gt: 0 },
    timestamp: { $gte: now, $lte: twoDaysLater },
  };

  // console.log(JSON.stringify(match, null, 2));
  var extraParams = { $limit: limit };
  const fixtures = await Fixture.aggregate([
    {
      $match: {
        ...match,
        // $or: [{ "result.home_win": true }, { "result.away_win": true }]
      },
    },
    { $sort: { date_time: 1 } },
    // {
    //   $addFields: {
    //     key: { $concat: [ "$item", " - ", "$description" ] },
    //   }
    // },
    extraParams,
    {
      $project: {
        fixture_id: 1,
        home_position: 1,
        away_position: 1,
        fixture_name: 1,
        home_goals: 1,
        away_goals: 1,
        home_name: 1,
        away_name: 1,
        home_logo: 1,
        away_logo: 1,
        country: 1,
        iso: 1,
        is_live: 1,
        minute: 1,
        timestamp: 1,
        status: 1,
        pre_odds: 1,
        ht_score: "$result.ht_score",
        ft_score: "$result.ft_score",
        events: "$events_json",
        [outcome]: "$pre_odds." + outcome,
        key: { $concat: [outcome, "_", { $toString: "$fixture_id" }] },
      },
    },
  ]);

  return fixtures;
};

Fixture.search = function (searchText, type) {
  const startOfDay = moment().startOf("day").unix();
  const endOfDay = moment().add(1, "days").unix();
  var extraParams;
  if (type == "upcoming") {
    extraParams = {
      status: {
        $in: ["LIVE", "HT", "PEN_LIVE", "BREAK", "ET", "NS"],
      },
      timestamp: { $gte: startOfDay },
    };
  } else {
    extraParams = {
      status: { $in: ["FT", "FT_PEN", "AET"] },
      timestamp: { $lte: endOfDay },
    };
  }

  return this.aggregate([
    {
      $match: {
        $text: {
          $search: searchText,
        },
        ...extraParams,
      },
    },
    {
      $sort: {
        timestamp: type == "upcoming" ? 1 : -1,
      },
    },
    {
      $limit: 10,
    },
    {
      $project: {
        fixture_name: 1,
        league_name: 1,
        timestamp: 1,
        fixture_id: 1,
        iso: 1,
        country_name: 1,
        ft_score: "$result.ft_score",
      },
    },
  ]);
};
Fixture.fetchStats = function (fixture_id) {
  return Fixture.findOne({ fixture_id }, { fixture_id: 1, home: 1, away: 1 });
};

Fixture.fetchStreak = async function (conditions, form, market, trial) {
  if (!(form in conditions)) {
    return [];
  }
  const { field, label } = conditions[form];
  const match = {
    status: "NS",
    timestamp: {
      $gte: moment().unix(),
      $lte: moment().add(72, "hours").unix(),
    },
    [`pre_odds.${market}`]: { $gte: 0.01 },
  };

  const project = {
    timestamp: 1,
    date: 1,

    iso: 1,
    fixture_id: 1,
    played: `$${form}.played_${form}`,
    odds: `$pre_odds.${market}`,
    hits_per: `$${field}_per`,
    hits: `$${field}`,
    fixture_id: 1,
    fixture_name: 1,
    country: 1,
    is_live: 1,
    minute: 1,
    timestamp: 1,
    status: 1,
    home_position: 1,
    away_position: 1,
    [market]: "$pre_odds." + market,
  };
  if (!trial) {
    Object.assign(project, {
      key: { $concat: [market, "_", { $toString: "$fixture_id" }] },
      home_name: `$home_name`,
      away_name: `$away_name`,
      home_logo: `$home_logo`,
      away_logo: `$away_logo`,
    });
  }
  if (form == "overall") {
    Object.assign(project, {
      name: "$fixture_name",
      played: { $sum: [`$home.played_overall`, `$away.played_overall`] },
      hits: { $sum: [`$home.${field}`, `$away.${field}`] },
      hits_per: {
        $multiply: [
          {
            $divide: [
              { $sum: [`$home.${field}`, `$away.${field}`] },
              { $sum: [`$home.played_overall`, `$away.played_overall`] },
            ],
          },
          100,
        ],
      },
    });
    Object.assign(match, {
      $and: [
        {
          $expr: {
            $gte: [
              { $sum: [`$home.played_overall`, `$away.played_overall`] },
              12,
            ],
          },
        },
        {
          $expr: {
            $gte: [
              // { $divide: [{ $sum: [`$home.${field}_per`, `$away.${field}_per`] }, 2] },
              // 75
              {
                $multiply: [
                  {
                    $divide: [
                      { $sum: [`$home.${field}`, `$away.${field}`] },
                      {
                        $sum: [`$home.played_overall`, `$away.played_overall`],
                      },
                    ],
                  },
                  100,
                ],
              },
              60,
            ],
          },
        },
      ],
    });
  } else {
    Object.assign(match, {
      [field + "_per"]: { $gte: 30 },
      [`${form}.played_${form}`]: { $gte: 6 },
    });
  }
  const pipeline = [
    {
      $match: match,
    },
    {
      $sort: { [field + "_per"]: -1, timestamp: 1 },
    },
  ];
  if (form == "overall") {
    pipeline.push({
      $addFields: {
        hits: { $sum: [`$home.${field}`, `$away.${field}`] },
        hits_per: {
          $multiply: [
            {
              $divide: [
                { $sum: [`$home.${field}`, `$away.${field}`] },
                { $sum: [`$home.played_overall`, `$away.played_overall`] },
              ],
            },
            100,
          ],
        },
      },
    });
    pipeline.push({
      $sort: { hits_per: -1, timestamp: 1 },
    });
  } else {
    pipeline.push({
      $sort: { [field + "_per"]: -1, timestamp: 1 },
    });
  }
  pipeline.push(
    ...[
      {
        $limit: 100,
      },
      {
        $project: project,
      },
    ]
  );
  const fixtures = await Fixture.aggregate(pipeline);
  return [
    {
      form,
      fixtures,
      label,
    },
  ];
};

Fixture.fetchStreaks = async function (market = "home_win", trial) {
  const streak_rules = require("./streak_rules");
  var { conditions, title, description } = streak_rules[market];
  const home = await Fixture.fetchStreak(conditions, "home", market, trial);
  const away = await Fixture.fetchStreak(conditions, "away", market, trial);
  const overall = await Fixture.fetchStreak(
    conditions,
    "overall",
    market,
    trial
  );
  const streaks = [...home, ...away, ...overall];
  const streak = await Streak.findByMarket(market);
  if (streak) {
    var { title, description, subtitle, header } = streak;
  }
  return { title, description, streaks, subtitle, header };
};
/*
Fixture.updateMany(
  { },
  {
    $rename: {
      "result.u05_1h_away_goals": "result.u05_away_goals_1h",
      "result.u05_1h_home_goals": "result.u05_home_goals_1h",
      "result.u05_2h_away_goals": "result.u05_away_goals_2h",
      "result.u05_2h_home_goals": "result.u05_home_goals_2h",
      "result.u15_1h_away_goals": "result.u15_away_goals_1h",
      "result.u15_1h_home_goals": "result.u15_home_goals_1h",
      "result.u15_2h_away_goals": "result.u15_away_goals_2h",
      "result.u15_2h_home_goals": "result.u15_home_goals_2h",
      "result.o05_1h_away_cards": "result.o05_away_cards_1h",
      "result.o05_1h_away_corners": "result.o05_away_corners_1h",
      "result.o05_1h_away_goals": "result.o05_away_goals_1h",
      "result.o05_1h_cards": "result.o05_cards_1h",
      "result.o05_1h_corners": "result.o05_corners_1h",
      "result.o05_1h_goals": "result.o05_goals_1h",
      "result.u05_1h_goals": "result.u05_goals_1h",
      "result.o05_1h_home_cards": "result.o05_home_cards_1h",
      "result.o05_1h_home_corners": "result.o05_home_corners_1h",
      "result.o05_1h_home_goals": "result.o05_home_goals_1h",
      "result.o05_2h_away_cards": "result.o05_away_cards_2h",
      "result.o05_2h_away_corners": "result.o05_away_corners_2h",
      "result.o05_2h_away_goals": "result.o05_away_goals_2h",
      "result.o05_2h_cards": "result.o05_cards_2h",
      "result.o05_2h_corners": "result.o05_corners_2h",
      "result.o05_2h_goals": "result.o05_goals_2h",
      "result.u05_2h_goals": "result.u05_goals_2h",
      "result.o05_2h_home_cards": "result.o05_home_cards_2h",
      "result.o05_2h_home_corners": "result.o05_home_corners_2h",
      "result.o05_2h_home_goals": "result.o05_home_goals_2h",
      "result.o15_1h_away_cards": "result.o15_away_cards_1h",
      "result.o15_1h_away_corners": "result.o15_away_corners_1h",
      "result.o15_1h_away_goals": "result.o15_away_goals_1h",
      "result.o15_1h_cards": "result.o15_cards_1h",
      "result.o15_1h_corners": "result.o15_corners_1h",
      "result.o15_1h_goals": "result.o15_goals_1h",
      "result.u15_1h_goals": "result.u15_goals_1h",
      "result.o15_1h_home_cards": "result.o15_home_cards_1h",
      "result.o15_1h_home_corners": "result.o15_home_corners_1h",
      "result.o15_1h_home_goals": "result.o15_home_goals_1h",
      "result.o15_2h_away_cards": "result.o15_away_cards_2h",
      "result.o15_2h_away_corners": "result.o15_away_corners_2h",
      "result.o15_2h_away_goals": "result.o15_away_goals_2h",
      "result.o15_2h_cards": "result.o15_cards_2h",
      "result.o15_2h_corners": "result.o15_corners_2h",
      "result.o15_2h_goals": "result.o15_goals_2h",
      "result.u15_2h_goals": "result.u15_goals_2h",
      "result.o15_2h_home_cards": "result.o15_home_cards_2h",
      "result.o15_2h_home_corners": "result.o15_home_corners_2h",
      "result.o15_2h_home_goals": "result.o15_home_goals_2h",
      "result.o25_1h_away_corners": "result.o25_away_corners_1h",
      "result.o25_1h_cards": "result.o25_cards_1h",
      "result.o25_1h_corners": "result.o25_corners_1h",
      "result.o25_1h_home_corners": "result.o25_home_corners_1h",
      "result.o25_2h_away_corners": "result.o25_away_corners_2h",
      "result.o25_2h_cards": "result.o25_cards_2h",
      "result.o25_2h_corners": "result.o25_corners_2h",
      "result.o25_2h_home_corners": "result.o25_home_corners_2h",
      "result.o35_1h_away_corners": "result.o35_away_corners_1h",
      "result.o35_1h_corners": "result.o35_corners_1h",
      "result.o35_1h_home_corners": "result.o35_home_corners_1h",
      "result.o35_2h_away_corners": "result.o35_away_corners_2h",
      "result.o35_2h_corners": "result.o35_corners_2h",
      "result.o35_2h_home_corners": "result.o35_home_corners_2h",
      "result.o45_1h_away_corners": "result.o45_away_corners_1h",
      "result.o45_1h_corners": "result.o45_corners_1h",
      "result.o45_1h_home_corners": "result.o45_home_corners_1h",
      "result.o45_2h_away_corners": "result.o45_away_corners_2h",
      "result.o45_2h_corners": "result.o45_corners_2h",
      "result.o45_2h_home_corners": "result.o45_home_corners_2h",
      "result.o55_1h_corners": "result.o55_corners_1h",
      "result.o55_2h_corners": "result.o55_corners_2h"
    }
  }
).then(x => console.log(x));*/

module.exports = Fixture;
