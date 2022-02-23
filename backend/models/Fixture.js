const { Model, raw } = require("objection");
const moment = require("moment");
const e = require("express");

class Fixture extends Model {
  // Table name is the only required property.
  static get tableName() {
    return "fixtures";
  }

  static get jsonAttributes() {
    return ["weather"];
  }

  static get modifiers() {
    return {
      filterByDate(builder, date) {
        const startOfDay = moment(date)
          .startOf("day")
          .unix();
        const endOfDay = moment(date)
          .endOf("day")
          .unix();
        builder.whereBetween("timestamp", [startOfDay, endOfDay]);
      },
      selectIdOnly(builder) {
        builder.select("id");
      },
      liveGames(builder) {
        const hour_ago = moment
          .utc()
          .subtract(1, "hour")
          .unix();
        builder.where({ status: "LIVE" }).where("timestamp", ">", hour_ago);
      }
    };
  }

  static get relationMappings() {
    // Importing models here is a one way to avoid require loops.
    const AggregateStat = require("./AggregateStat");
    const Probability = require("./Probability");
    const Stat = require("./Stat");
    const Result = require("./Result");
    const Odd = require("./Odd");
    const League = require("./League");
    const Event = require("./Event");
    const Country = require("./Country");

    return {
      events: {
        relation: Model.HasManyRelation,
        modelClass: Event,
        join: {
          from: "fixtures.id",
          to: "events.fixture_id"
        }
      },
      result: {
        relation: Model.HasOneRelation,
        modelClass: Result,
        join: {
          from: "fixtures.id",
          to: "results.fixture_id"
        }
      },
      league: {
        relation: Model.BelongsToOneRelation,
        modelClass: League,
        join: {
          from: "fixtures.league_id",
          to: "leagues.id"
        }
      },
      country: {
        relation: Model.BelongsToOneRelation,
        modelClass: Country,
        join: {
          from: "fixtures.country_id",
          to: "countries.id"
        }
      },
      home_aggregates: {
        relation: Model.HasManyRelation,
        modelClass: AggregateStat,
        join: {
          from: "fixtures.id",
          to: "aggregate_stats.fixture_id"
        },
        filter(builder) {
          builder.where("location", "home");
        }
      },

      away_aggregates: {
        relation: Model.HasManyRelation,
        modelClass: AggregateStat,
        join: {
          from: "fixtures.id",
          to: "aggregate_stats.fixture_id"
        },
        filter(builder) {
          builder.where("location", "away");
        }
      },
      home: {
        relation: Model.HasOneRelation,
        modelClass: AggregateStat,
        join: {
          from: "fixtures.id",
          to: "aggregate_stats.fixture_id"
        },
        filter(builder) {
          builder.where("location", "home").where("type", "all");
        }
      },

      away: {
        relation: Model.HasOneRelation,
        modelClass: AggregateStat,
        join: {
          from: "fixtures.id",
          to: "aggregate_stats.fixture_id"
        },
        filter(builder) {
          builder.where("location", "away").where("type", "all");
        }
      },
      preodds: {
        relation: Model.HasOneRelation,
        modelClass: Odd,
        join: {
          from: "fixtures.id",
          to: "odds.fixture_id"
        },
        filter(builder) {
          builder.where("type", "preodds");
        }
      },
      liveodds: {
        relation: Model.HasOneRelation,
        modelClass: Odd,
        join: {
          from: "fixtures.id",
          to: "odds.fixture_id"
        },
        filter(builder) {
          builder.where("type", "liveodds");
        }
      },
      peakodds: {
        relation: Model.HasOneRelation,
        modelClass: Odd,
        join: {
          from: "fixtures.id",
          to: "odds.fixture_id"
        },
        filter(builder) {
          builder.where("type", "peakodds");
        }
      },
      probability: {
        relation: Model.HasOneRelation,
        modelClass: Probability,
        join: {
          from: "fixtures.id",
          to: "probabilities.fixture_id"
        }
      },

      home_stat: {
        relation: Model.HasOneRelation,
        modelClass: Stat,
        join: {
          from: "fixtures.id",
          to: "stats.fixture_id"
        },
        filter(builder) {
          builder.where("location", "home");
        }
      },
      away_stat: {
        relation: Model.HasOneRelation,
        modelClass: Stat,
        join: {
          from: "fixtures.id",
          to: "stats.fixture_id"
        },
        filter(builder) {
          builder.where("location", "away");
        }
      }
    };
  }
}

Fixture.findUpcoming = function(conditions) {
  const query = this.query().withGraphJoined(
    "[home(overallStats),away(overallStats)]",
    {
      joinOperation: "rightJoin"
    }
  );
  for (var condition of conditions) {
    query.where(condition);
  }
  return query.modifiers({
    overallStats: builder => {
      builder.where("type", "100");
    }
  });
};

Fixture.findById = function(id) {
  return this.query().findById(id);
};

function formatRawFixture(rawFixture) {
  const {
    fixtures,
    probability,
    league,
    result,
    country,
    home_stats,
    away_stats,
    pre_odds,
    live_odds,
    peak_odds,
    home,
    away,
    events
  } = rawFixture;
  return {
    ...league,
    ...country,
    ...result,
    probability,
    stats: {
      home: home_stats,
      away: away_stats
    },
    pre_odds,
    live_odds,
    peak_odds,
    home,
    away,
    events,
    ...fixtures
  };
}
function fixtureQuery() {
  return Fixture.query()
    .select(
      "fixtures.*",
      "probability.*",
      "result.*",
      "league.*",
      "country.*",
      "home_stats.*",
      "away_stats.*",
      "pre_odds.*",
      "live_odds.*",
      "peak_odds.*",
      "home.*",
      "away.*"
    )
    .leftJoinRelated("probability")
    .leftJoinRelated("league(forFixture)")
    .leftJoinRelated("result(forFixture)")
    .leftJoinRelated("country(forFixture)")
    .leftJoin("stats as home_stats", function() {
      this.on("fixtures.id", "=", "home_stats.fixture_id").andOn(
        "fixtures.home_id",
        "=",
        "home_stats.team_id"
      );
    })
    .leftJoin("stats as away_stats", function() {
      this.on("fixtures.id", "=", "away_stats.fixture_id").andOn(
        "fixtures.away_id",
        "=",
        "away_stats.team_id"
      );
    })
    .leftJoin("odds as pre_odds", function() {
      this.on("fixtures.id", "=", "pre_odds.fixture_id").andOn(
        "pre_odds.type",
        "=",
        raw("'preodds'")
      );
    })
    .leftJoin("odds as live_odds", function() {
      this.on("fixtures.id", "=", "live_odds.fixture_id").andOn(
        "live_odds.type",
        "=",
        raw("'liveodds'")
      );
    })
    .leftJoin("odds as peak_odds", function() {
      this.on("fixtures.id", "=", "peak_odds.fixture_id").andOn(
        "live_odds.type",
        "=",
        raw("'peakodds'")
      );
    })
    .leftJoin("aggregate_stats as home", function() {
      this.on("fixtures.id", "=", "home.fixture_id")
        .andOn("home.type", "=", raw("'all'"))
        .andOn("home.team_id", "=", "fixtures.home_id");
    })
    .leftJoin("aggregate_stats as away", function() {
      this.on("fixtures.id", "=", "away.fixture_id")
        .andOn("away.type", "=", raw("'all'"))
        .andOn("away.team_id", "=", "fixtures.away_id");
    })
    .options({ nestTables: true });
}

Fixture.findOneWithAggregates = async function(id) {
  const rawFixture = await fixtureQuery().findById(id);
  const fixtureWithEvents = await Fixture.query()
    .findById(id)
    .withGraphFetched("events");
  rawFixture["events"] = fixtureWithEvents["events"];
  return formatRawFixture(rawFixture);
};

Fixture.getTodaysCount = function() {
  const startOfDay = moment
    .utc()
    .startOf("day")
    .unix();
  const endOfDay = moment
    .utc()
    .endOf("day")
    .unix();
  return this.query()
    .whereBetween("timestamp", [startOfDay, endOfDay])
    .resultSize();
};

Fixture.getTodays = function() {
  const startOfDay = moment
    .utc()
    .startOf("day")
    .unix();
  const endOfDay = moment
    .utc()
    .endOf("day")
    .unix();
  return this.query().whereBetween("timestamp", [startOfDay, endOfDay]);
};

Fixture.getLiveCount = function() {
  const hour_ago = moment
    .utc()
    .subtract(1, "hour")
    .unix();
  return this.query()
    .where({ status: "LIVE" })
    .where("timestamp", ">", hour_ago)
    .resultSize();
};

Fixture.fetchLive = function() {
  const hour_ago = moment
    .utc()
    .subtract(1, "hour")
    .unix();
  return this.query()
    .withGraphFetched({
      home_stat: true,
      probability: true,
      away_stat: true,
      preodds: true,
      liveodds: true,
      peakodds: true
    })
    .where({ status: "LIVE" })
    .where("timestamp", ">", hour_ago);
};

Fixture.findByTeamSeasonId = function({
  team_id,
  timestamp,
  season_id,
  limit,
  keys,
  aggregate_keys
}) {
  const subQuery = this.query()
    .leftJoinRelated("result")
    //.where("status", "FT")
    .select(...aggregate_keys)
    .where("home_id", team_id)
    .orWhere("away_id", team_id)
    .where("timestamp", "<", timestamp)
    .where("season_id", season_id)
    .orderBy("timestamp", "desc");
  if (limit) {
    subQuery.limit(limit);
  }
  subQuery.as("subquery");

  const query = this.query()
    .select(...keys)
    .from(subQuery);
  //console.log(query.toKnexQuery().toString());
  return query;
  //, "home_id", "away_id", "timestamp", "season_id")
};

Fixture.findByIds = async function(ids) {
  console.log(ids, "IDS");
  const rawFixtures = await fixtureQuery().whereIn("fixtures.id", ids);
  const fixturesWithEvents = await Fixture.query()
    .whereIn("fixtures.id", ids)
    .withGraphFetched("events");
  //console.log(rawFixtures, "ARW");
  const hasMap = Object.assign(
    {},
    ...fixturesWithEvents.map(rawFixture => {
      return {
        [rawFixture.id]: rawFixture
      };
    })
  );
  console.log(rawFixtures.length, "ITEMS");
  return rawFixtures.map(rawFixture => {
    rawFixture["events"] = hasMap[rawFixture.fixtures.id]["events"];
    return formatRawFixture(rawFixture);
  });
};

function populateMore(fixture) {
  var team_types = {
    winning_team: null,
    losing_team: null,
    favorite: null,
    underdog: null,
    favorite_playing_away: null,
    underdog_playing_away: null,
    favorite_playing_home: null,
    underdog_playing_home: null
  };
  var odd_types = ["pre_odds", "live_odds", "peak_odds"];

  if (fixture["stats"]["home"]["goals"] == fixture["stats"]["away"]["goals"]) {
    team_types["winning_team"] = null;
    team_types["losing_team"] = null;
  } else if (
    fixture["stats"]["home"]["goals"] > fixture["stats"]["away"]["goals"]
  ) {
    team_types["winning_team"] = "home";
    team_types["losing_team"] = "away";
  } else {
    team_types["winning_team"] = "away";
    team_types["losing_team"] = "home";
  }
  if (
    fixture["pre_odds"]["home_win"] ==
    fixture["pre_odds"]["away_win"]
  ) {
    team_types["underdog"] = null;
    team_types["favorite"] = null;
    team_types["favorite_playing_away"] = null;
    team_types["underdog_playing_away"] = null;
    team_types["favorite_playing_home"] = null;
    team_types["underdog_playing_home"] = null;
  } else if (
    fixture["pre_odds"]["home_win"] >
    fixture["pre_odds"]["away_win"]
  ) {
    team_types["underdog"] = "home";
    team_types["favorite"] = "away";
    team_types["favorite_playing_away"] = "away";
    team_types["underdog_playing_home"] = "home";
  } else {
    team_types["underdog"] = "away";
    team_types["favorite"] = "home";
    team_types["underdog_playing_away"] = "away";
    team_types["favorite_playing_home"] = "home";
  }

  for (var odd_type of odd_types) {
    fixture[odd_type]["home"] = {
      ft_result: fixture[odd_type]["home_win"],
      ht_result: fixture[odd_type]["home_win_ht"],
      dnb: fixture[odd_type]["dnb_home"]
    };
    fixture[odd_type]["away"] = {
      ft_result: fixture[odd_type]["away_win"],
      ht_result: fixture[odd_type]["away_win_ht"],
      dnb: fixture[odd_type]["dnb_away"]
    };
  }
  for (var team_type in team_types) {
    var team = team_types[team_type];
    fixture["stats"][team_type] = fixture["stats"][team];
    fixture["pre_odds"][team_type] = fixture["pre_odds"][team];
    fixture["live_odds"][team_type] = fixture["live_odds"][team];
    fixture["peak_odds"][team_type] = fixture["peak_odds"][team];
  }
  return fixture;
}
Fixture.findByIdsExtended = async function(ids) {
  const fixtures = await this.findByIds(ids);
  return fixtures.map(fixture => populateMore(fixture));
};

Fixture.findWithAggregates = async function(date = new Date()) {
  const startOfDay = moment
    .utc(date)
    .startOf("day")
    .unix();
  const endOfDay = moment
    .utc(date)
    .endOf("day")
    .unix();
  const rawFixtures = await this.query()
    .whereBetween("timestamp", [startOfDay, endOfDay])
    .select("id");

  return Fixture.findByIds(rawFixtures.map(fixture => fixture.id));
};

Fixture.findExtendedWithAggregates = async function(date = new Date()) {
  const startOfDay = moment
    .utc(date)
    .startOf("day")
    .unix();
  const endOfDay = moment
    .utc(date)
    .endOf("day")
    .unix();
  const rawFixtures = await this.query()
    .where({ status: "LIVE" })
    //.whereBetween("timestamp", [startOfDay, endOfDay])
    .select("id");

  return Fixture.findByIdsExtended(rawFixtures.map(fixture => fixture.id));
};

Fixture.findLiveWithAggregates = async function() {
  const hour_ago = moment()
    .subtract(1, "day")
    .unix();

  const rawFixtures = await fixtureQuery()
    .where("status", "LIVE")
    .where("timestamp", ">", hour_ago);
  const fixturesWithEvents = await Fixture.query()
    .where("status", "LIVE")
    .where("timestamp", ">", hour_ago)
    .withGraphFetched("events");
  //console.log(rawFixtures, "ARW");
  const hasMap = Object.assign(
    {},
    ...fixturesWithEvents.map(rawFixture => {
      return {
        [rawFixture.id]: rawFixture
      };
    })
  );
  console.log(rawFixtures.length, "ITEMS");
  return rawFixtures.map(rawFixture => {
    rawFixture["events"] = hasMap[rawFixture.fixtures.id]["events"];
    return formatRawFixture(rawFixture);
  });
};

Fixture.findByIdsOlds = function(ids) {
  return this.query()
    .select("league.*", "fixtures.*")
    .leftJoinRelated("league")
    .withGraphFetched({
      probability: true,
      home_stat: true,
      away_stat: true,
      preodds: true,
      home: true,
      away: true,
      liveodds: true,
      peakodds: true
    })
    .findByIds(ids);
};

Fixture.create = function(data) {
  return this.query().upsertGraph(data, {
    relate: [
      "probability",
      "result",
      "home_stat",
      "away_stat",
      "preodds",
      "liveodds",
      "peakodds"
    ],
    insertMissing: true
  });
};

function stringifyJson(myObject) {
  Object.keys(myObject).map(function(key) {
    if (typeof myObject[key] == "object") {
      myObject[key] = JSON.stringify(myObject[key]);
    }
  });
}
Fixture.bulkCreate = function(fixtures) {
  const separated = {
    fixture: { table_name: "fixtures", items: [] },
    probability: { table_name: "probabilities", items: [] },
    result: { table_name: "results", items: [] },
    home_stat: { table_name: "stats", items: [] },
    away_stat: { table_name: "stats", items: [] },
    preodds: { table_name: "odds", items: [] },
    liveodds: { table_name: "odds", items: [] },
    peakodds: { table_name: "odds", items: [] }
  };
  for (var fixture of fixtures) {
    for (var key in fixture) {
      const data = fixture[key];
      if (data) {
        stringifyJson(data);
        separated[key].items.push(data);
      }
    }
  }
  console.log(JSON.stringify(separated, null, 2));
  return this.transaction(async trx => {
    for (var key in separated) {
      if (separated[key].items.length) {
        await trx
          .insert(separated[key].items)
          .into(separated[key].table_name)
          .onConflict()
          .merge();
      }
    }
  });
};

// const data = {
//   team_id: 94165,
//   timestamp: 1631950300,
//   season_id: 18175,
//   limit: 100,
// };
// Fixture.findByTeamSeasonId(data).then((lesson) =>
//   console.log("LESSON", lesson)
// );
module.exports = Fixture;
