const { Model, raw } = require("objection");

const MongoStrategy = require("../mongomodels/Strategy");
const MongoFixture = require("../mongomodels/Fixture");
const Pick = require("../mongomodels/Pick");
const uuid = require("uuid");
const axios = require("axios");
const { where } = require("../mongomodels/Fixture");

class Strategy extends Model {
  static get tableName() {
    return "strategies";
  }
  static get jsonAttributes() {
    return ["timer", "leagues"];
  }

  static get relationMappings() {
    // Importing models here is a one way to avoid require loops.
    const User = require("./User");
    const PreMatchStrategyRule = require("./PreMatchStrategyRule");
    const InPlayStrategyRule = require("./InPlayStrategyRule");
    const Outcome = require("./Outcome");
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "strategies.user_id",
          to: "users.id",
        },
      },

      outcome: {
        relation: Model.HasOneRelation,
        modelClass: Outcome,
        join: {
          from: "strategies.outcome_id",
          to: "outcomes.id",
        },
      },
      strategy_prematch_rules: {
        relation: Model.HasManyRelation,
        modelClass: PreMatchStrategyRule,
        join: {
          from: "strategies.id",
          to: "strategy_prematch_rules.strategy_id",
        },
      },
      strategy_inplay_rules: {
        relation: Model.HasManyRelation,
        modelClass: InPlayStrategyRule,
        join: {
          from: "strategies.id",
          to: "strategy_inplay_rules.strategy_id",
        },
      },
    };
  }
}
const strategy_public_fields = [
  "id",
  "slug",
  "title",
  "is_public",
  "is_preset",
  "timer",
  "note",
  "type",
  "picks_sent",
  "hit_rate",
  "strike_rate",
  "outcome_id",
  "leagues",
  "trusted",
  "preset_id",
  "active",
  "user_id",
];

const strategy_admin_fields = [
  "id",
  "title",
  "is_public",
  "is_preset",
  "timer",
  "note",
  "picks_sent",
  "fixtures_found",
  "type",
  "hit_rate",
  "strike_rate",
  "outcome_id",
  "leagues",
  "trusted",
  "active",
  "user_id",
  "preset_id",
  "created_at",
  "updated_at",
];

// function formatStrategy(strategy) {
//   //console.log(strategy.outcomes);
//   if (!strategy.outcomes )
//   strategy.outcomes = strategy.outcomes["outcome_id"];
//   return strategy;
// }

Strategy.reschedule = async function (strategy_id) {
  try {
    const config = { headers: {} };
    const url = process.env.CANCEL_PREMATCH_ALERTS_ENDPOINT + strategy_id;
    const res = await axios.put(url, {}, config);
    // console.log(res.data, "LAMBDA TRIGGERED");
  } catch (error) {
    console.log("Reschedule Error", error);
  }
};

Strategy.findById = async function (id, user_id, user_is_pro = false) {
  var strategy = await this.query()
    .findOne({
      id,
      user_id,
    })
    .orWhere(function () {
      const condition = this.where({ id });

      return user_is_pro ? condition : condition.where({ is_public: true });
    })
    .withGraphFetched("strategy_prematch_rules")
    .withGraphFetched("strategy_inplay_rules")
    .withGraphFetched({
      outcome: {
        $modify: ["includeRule"],
      },
    })
    //.withGraphFetched("outcomes")
    .select(...strategy_public_fields);
  return strategy;
};

// Strategy.query()
//   .select("id")
//   .then(strategies => {
//     strategies = strategies.map(x => x.id);
//     console.log(strategies);
//     MongoStrategy.deleteMany({ id: { $nin: strategies } }).then(mongos => {
//       console.log(mongos);
//     });
//   });
// Strategy.findPublicById = async function(id) {
//   var strategy = await this.query()
//     .findOne({
//       id,
//       is_public: true
//     })
//     .withGraphFetched("strategy_prematch_rules")
//     .withGraphFetched("strategy_inplay_rules")
//     .withGraphFetched({
//       outcome: {
//         $modify: ["includeRule"]
//       }
//     })
//     //.withGraphFetched("outcomes")
//     .select(...strategy_public_fields);
//   return strategy;
// };

// Strategy.findById = async function(slug, user_id) {
//   var strategy = await this.query()
//     .findOne({
//       slug
//     })
//     .where(function() {
//       this.where({ user_id }).orWhere({ is_public: true });
//     })
//     .withGraphFetched("strategy_prematch_rules")
//     .withGraphFetched("strategy_inplay_rules")
//     //.withGraphFetched("outcomes")
//     .select(...strategy_public_fields);
//   return strategy;
// };

Strategy.countForUser = function (user_id, type) {
  return this.query().where({ user_id, type }).resultSize();
};

// Strategy.countForUser(1, "in-play").then(x=> console.log(x))
Strategy.findForMongo = function () {
  return this.query()
    .withGraphFetched({
      strategy_prematch_rules: {
        $modify: ["includeRule"],
      },
      strategy_inplay_rules: {
        $modify: ["includeRule"],
      },
      outcome: {
        $modify: ["includeRule"],
      },
    })
    .select("*");
};

Strategy.findByIdWithRule = async function (id, trx) {
  var strategy = await this.query(trx)
    .findOne({
      id,
    })
    .withGraphFetched({
      strategy_prematch_rules: {
        $modify: ["includeRule"],
      },
      strategy_inplay_rules: {
        $modify: ["includeRule"],
      },
      outcome: {
        $modify: ["includeRule"],
      },
      user: {
        $modify: ["withSub"],
      },
    })
    .select(...strategy_admin_fields);
  return strategy;
};

Strategy.findWithRule = async function () {
  var strategies = await this.query()
    .withGraphFetched(
      {
        strategy_prematch_rules: {
          $modify: ["includeRule"],
        },

        outcome: {
          $modify: ["includeRule"],
        },
        /* strategy_inplay_rules: {
          second_rule: true,
          first_rule: true
        }*/
      }
      //  "strategy_prematch_rules(includeRule), strategy_inplay_rules.[first_rule,second_rule]"
    )
    .select(...strategy_public_fields)
    .modifiers({});
  //strategies.map(strategy => formatStrategy(strategy));

  return strategies;
};

Strategy.findInPlayWithRule = async function (trx) {
  var strategies = await this.query(trx)
    .where({
      type: "in-play",
    })
    .withGraphFetched(
      {
        strategy_prematch_rules: {
          $modify: ["includeRule"],
        },
        strategy_inplay_rules: {
          $modify: ["includeRule"],
        },
        outcome: {
          $modify: ["includeRule"],
        },
      }
      //  "strategy_prematch_rules(includeRule), strategy_inplay_rules.[first_rule,second_rule]"
    );
  //strategies.map(strategy => formatStrategy(strategy));

  return strategies;
  //.select(...strategy_public_fields)
};

Strategy.findInPlayRestApi = async function () {
  var strategies = await this.query()
    .where({
      type: "in-play",
    })
    .withGraphFetched(
      {
        strategy_prematch_rules: {
          $modify: ["includeRule"],
        },
        strategy_inplay_rules: {
          $modify: ["includeRule"],
        },
        outcomes: {
          $modify: ["includeRule"],
        },
      }
      //  "strategy_prematch_rules(includeRule), strategy_inplay_rules.[first_rule,second_rule]"
    );
  return strategies;
  //.select(...strategy_public_fields)
};

Strategy.updateHitrates = async function (user_id, type) {
  const strategies = await this.query()
    .where({
      user_id,
      type,
    })
    .select("id");
  var strategy_ids = strategies.map((s) => s.id);
  var picks = await Pick.aggregate([
    {
      $match: { strategy_id: { $in: strategy_ids }, status: "sent" },
    },
    { $group: { _id: "$strategy_id", sent: { $sum: 1 } } },
  ]);
  var count = Object.assign(
    {},
    ...picks.map((pick) => {
      return {
        [pick._id]: pick.sent,
      };
    })
  );
  for (var strategy of strategies) {
    strategy["picks_sent"] = count[strategy.id] || 0;
  }
  if (strategies.length) {
    return await Strategy.knex()
      .table("strategies")
      .insert(strategies)
      .onConflict()
      .merge();
  }
  return strategies;

  // return strategies;
};

Strategy.findAll = async function (
  type,
  user_id,
  page = 1,
  mode,
  filterBy = "all",
  sortBy = "status",
  search
) {
  page = Math.max(Number(page || 1), 0);
  const perPage = 20;
  const skip = (page - 1) * perPage;
  var extraParams;
  switch (filterBy) {
    case "active":
      extraParams = { active: true };
      break;
    case "inactive":
      extraParams = { active: false };
      break;
    default:
      extraParams = {};
  }

  const query = this.query()
    //.withGraphFetched("strategy_prematch_rules")
    .select(
      "hit_rate",
      "id",
      "title",
      "strike_rate",
      "picks_sent",
      "trusted",
      "updated_at",
      "active",
      "slug"
    )
    .where({ type, ...extraParams })
    .withGraphFetched({
      outcome: {
        $modify: ["includeRule"],
      },
    });
  switch (sortBy) {
    case "picks_sent":
      query.orderBy([
        { column: "picks_sent", order: "desc" },
        { column: "trusted", order: "desc" },
      ]);
      break;
    case "hit_rate":
      if (type == "in-play") {
        query.orderBy([
          { column: "strike_rate", order: "desc" },
          { column: "trusted", order: "desc" },
        ]);
      } else {
        query.orderBy([
          { column: "hit_rate", order: "desc" },
          { column: "trusted", order: "desc" },
        ]);
      }

      break;
    case "name":
      query.orderBy([
        { column: "title", order: "asc" },
        { column: "trusted", order: "desc" },
      ]);
      break;
    case "updated_at":
      query.orderBy([
        { column: "updated_at", order: "desc" },
        { column: "trusted", order: "desc" },
      ]);
      break;
    default:
      query.orderBy([
        { column: "trusted", order: "desc" },
        { column: "hit_rate", order: "desc" },
      ]);
  }

  // console.log("DEBUG WHY QUERY IS EMPTY", query.toKnexQuery().toString());
  var strategies, totalCount;
  if (search) {
    query.where("title", "like", "%" + search + "%");
  }
  switch (mode) {
    case "explore-alerts":
      query
        .where({
          is_public: true,
        })
        .whereNull("preset_id")
        .whereNot("is_preset", true)
        .whereNot({ user_id });
      var [total, strategies] = await Promise.all([
        query.resultSize(),
        query.offset(skip).limit(perPage),
      ]);

      break;
    case "preset-alerts":
      query.where({
        is_preset: true,
        is_public: true,
      });
      var [total, strategies] = await Promise.all([
        query.resultSize(),
        query.offset(skip).limit(perPage),
      ]);

      break;
    default:
      await Strategy.updateHitrates(user_id, type);
      await query.where({
        user_id,
      });
      var [total, strategies] = await Promise.all([
        query.resultSize(),
        query.offset(skip).limit(perPage),
      ]);

    // console.log("PICKS", picks);
  }

  return [total, strategies];
};

Strategy.findAllByAdmin = function (type, user_id, page = 1) {
  page = Math.max(Number(page), 0);
  const perPage = 10;
  const skip = (page - 1) * perPage;

  const query = this.query()
    //.withGraphFetched("strategy_prematch_rules")
    .select("*")
    .where({ type, user_id })
    .orderBy([
      { column: "trusted", order: "desc" },
      { column: "picks_sent", order: "desc" },
    ])
    .withGraphFetched({
      outcome: {
        $modify: ["includeRule"],
      },
    })
    .offset(skip)
    .limit(10);

  return query;
};

Strategy.findActiveByAdmin = function (type, user_id, page = 1) {
  page = Math.max(Number(page), 0);
  const perPage = 100;
  const skip = (page - 1) * perPage;

  const query = this.query()
    //.withGraphFetched("strategy_prematch_rules")
    .select("title", "id")
    .where({ is_preset: true })
    .orderBy([
      { column: "trusted", order: "desc" },
      { column: "picks_sent", order: "desc" },
    ])
    .offset(skip)
    .limit(perPage);

  return query;
};

Strategy.findByUserIds = function (user_ids) {
  return this.query()
    .withGraphFetched({
      strategy_prematch_rules: true,
      strategy_inplay_rules: true,
    })
    .select(...strategy_public_fields)
    .whereIn("user_id", user_ids)
    .where("type", "in-play")
    .where("active", true);
};

Strategy.getTotalCount = function () {
  return this.query().resultSize();
};

Strategy.getUserStrategies = function (user_id, limit = 4) {
  return this.query()
    .where({
      user_id,
    })
    .orderBy("picks_sent", "DESC")
    .limit(limit);
};

Strategy.getOtherStrategies = function (user_id, limit = 4) {
  return this.query()
    .whereNot({
      user_id,
    })
    .where({
      is_public: true,
    })
    .where("picks_sent", ">", "10")
    .whereNull("preset_id")
    .orderBy("strike_rate", "DESC")
    .limit(limit);
};

Strategy.syncWithMongo = async function (id) {
  const data = await Strategy.findByIdWithRule(id);
  await MongoStrategy.findOneAndUpdate(
    { id },
    { $set: data },
    {
      upsert: true,
    }
  );
  return data;
};
Strategy.trust = function (id, user_id) {
  return this.transaction(async (trx) => {
    const strategy = await this.query(trx)
      .patch({ trusted: true })
      .findOne({ id, user_id });
    await MongoStrategy.findOneAndUpdate(
      { id, "user.id": user_id },
      { trusted: true }
    );
    return strategy;
  });
};

Strategy.updateLeagues = function (id, user_id, leagues) {
  return this.transaction(async (trx) => {
    const strategy = await this.query(trx)
      .patch({ leagues })
      .findOne({ id, user_id });
    await MongoStrategy.findOneAndUpdate(
      { id, "user.id": user_id },
      { leagues: leagues }
    );
    return strategy;
  });
};

Strategy.excludeLeague = function (id, user_id, league_id) {
  return this.transaction(async (trx) => {
    const strategy = await this.query(trx)
      .select("leagues")
      .findOne({ id, user_id });
    await this.query(trx)
      .patch({ leagues: strategy.leagues.filter((id) => id != league_id) })
      .findOne({ id, user_id });
    await Strategy.syncWithMongo(id);
    return strategy;
  });
};

Strategy.untrust = function (id, user_id) {
  return this.transaction(async (trx) => {
    const strategy = await this.query(trx)
      .patch({ trusted: false })
      .findOne({ id, user_id });
    await MongoStrategy.findOneAndUpdate(
      { id, "user.id": user_id },
      { trusted: false }
    );
    return strategy;
  });
};

Strategy.togglePresetByAdmin = async function (id) {
  return this.transaction(async (trx) => {
    const strategy = await this.query(trx).findOne({ id });
    await strategy.$query().patchAndFetch({ is_preset: raw("NOT is_preset") });

    await MongoStrategy.findOneAndUpdate(
      { id },
      { is_preset: strategy.is_preset }
    );
    return strategy;
  });
};
Strategy.togglePublicByAdmin = async function (id) {
  return this.transaction(async (trx) => {
    const strategy = await this.query(trx).findOne({ id });
    await strategy.$query().patchAndFetch({ is_public: raw("NOT is_public") });

    await MongoStrategy.findOneAndUpdate(
      { id },
      { is_public: strategy.is_public }
    );
    return strategy;
  });
};

Strategy.toggle = async function (id, user_id) {
  return this.transaction(async (trx) => {
    const strategy = await this.query(trx).findOne({ id, user_id });
    // console.log("BEFORE", strategy);
    await strategy.$query().patchAndFetch({ active: raw("NOT active") });
    console.log("AFTER", strategy);
    await MongoStrategy.findOneAndUpdate(
      { id, "user.id": user_id },
      { active: strategy.active }
    );
    if (!strategy.active) {
      await Pick.cancelAlerts(id, user_id);
    } else {
      await Strategy.reschedule(strategy.id);
    }
    return strategy;
  });
};

Strategy.create = async function (body, type, user_id, preset_id) {
  var {
    id,
    title,
    strategy_prematch_rules,
    strategy_inplay_rules,
    outcome_id,
    is_public,
    timer,
    note,
    leagues,
  } = body;

  return await this.transaction(async (trx) => {
    var strategy;
    if (id) {
      const strategy_old = await Strategy.query(trx).findOne({ id, user_id });
      strategy = await strategy_old.$query(trx).patchAndFetch({
        title,
        is_public,
        timer,
        note,
        leagues,
        type,
        outcome_id,
        preset_id: null,
      });
    } else {
      strategy = await Strategy.query(trx).insert({
        title,
        is_public,
        timer,
        note,
        leagues,
        type,
        outcome_id,
        user_id,
        slug: uuid.v4(),
        preset_id,
      });
    }

    if (strategy_prematch_rules.length) {
      await trx
        .table("strategy_prematch_rules")
        .where("strategy_id", strategy.id)
        .del();

      await trx
        .insert(
          strategy_prematch_rules.map((rule) => {
            delete rule["id"];
            return {
              ...rule,
              strategy_id: strategy.id,
              values: JSON.stringify(rule.values),
            };
          })
        )
        .into("strategy_prematch_rules")
        .onConflict()
        .merge();
    }

    if (type == "in-play") {
      await trx
        .table("strategy_inplay_rules")
        .where("strategy_id", strategy.id)
        .del();

      await trx
        .table("strategy_inplay_rules")
        .insert(
          strategy_inplay_rules.map((rule) => {
            delete rule["id"];
            return {
              ...rule,
              timer: JSON.stringify(rule.timer),
              strategy_id: strategy.id,
            };
          })
        )
        .onConflict()
        .merge();
    }
    const data = await Strategy.findByIdWithRule(strategy.id, trx);
    await MongoStrategy.findOneAndUpdate(
      { id: strategy.id },
      { $set: data },
      {
        upsert: true,
      }
    );
    if (type == "pre-match") {
      await Strategy.reschedule(strategy.id);
    }

    return strategy;
  });
};

Strategy.createCopy = async function (id, user_id) {
  var strategy = await this.query().findOne({ id, user_id });
  delete strategy.id;
  delete strategy.created_at;
  delete strategy.updated_at;
  delete strategy.slug;
  strategy.active = false;
  return await Strategy.query().insert(strategy);
};

Strategy.import = async function (id, user_id, user_is_pro) {
  var strategy = await Strategy.findById(id, user_id, user_is_pro);
  const preset_id = strategy.is_preset ? strategy.id : undefined;
  delete strategy.id;
  await Strategy.create(strategy, strategy["type"], user_id, preset_id);
};

Strategy.deleteById = function (id, user_id) {
  return this.transaction(async (trx) => {
    await this.query(trx).delete().where({
      id,
      user_id,
    });
    await Pick.cancelAlerts(id, user_id);
    return await MongoStrategy.deleteById(id, user_id);
  });
};

Strategy.updateHitrate = function (id, user_id) {
  return this.query().where({
    is_preset: true,
    active: true,
    type,
  });
};

Strategy.findAllPreset = function (type) {
  return this.query().where({
    is_preset: true,
    active: true,
    type,
  });
};

Strategy.findAllInPlay = function (type) {
  return this.query().where({
    is_preset: true,
    active: true,
    type,
  });
};

Strategy.findPresetById = function (id) {
  return this.query().where({
    is_preset: true,
    active: true,
    id,
  });
};

Strategy.search = function (searchText, type) {
  var extraParams;
  if (type == "upcoming") {
    extraParams = {
      status: { $nin: ["FT", "FT_PEN"] },
      timestamp: { $gte: startOfDay },
    };
  } else {
    extraParams = {
      status: { $in: ["FT", "FT_PEN"] },
      timestamp: { $lte: endOfDay },
    };
  }

  return this.query([
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

// Strategy.query()
//   .select()
//   .then(strategies => {
//     strategies.forEach(async strategy => {
//       await Strategy.query()
//         .patch({ slug: uuid.v4() })
//         .findById(strategy.id);
//     });
//   });

Strategy.syncAllWithMongo = async function () {
  const strategies = await Strategy.query().select("id").orderBy("id", "DESC");
  var count = 0;
  for (var strategy of strategies) {
    const { id } = strategy;
    const data = await Strategy.findByIdWithRule(id);
    const inser = await MongoStrategy.findOneAndUpdate(
      { id },
      { $set: data },
      {
        upsert: true,
      }
    );

    count++;
    console.log("INSERTED", count, strategies.length);
  }
};

Strategy.updateTimer = async function () {
  const strategy_ids = await Strategy.knexQuery()
    .table("strategy_inplay_rules")
    .whereNull("timer")
    .distinct()
    .pluck("strategy_id");

  const strategies = await Strategy.query()
    .whereIn("id", strategy_ids)
    .select("id", "timer");
  console.log("strategies", strategies);
  for (var strategy of strategies) {
    const { id } = strategy;
    console.log(strategy, "HEHE");
    await Strategy.knexQuery()
      .table("strategy_inplay_rules")
      .update({
        timer: JSON.stringify(strategy.timer),
      })
      .where({ strategy_id: strategy.id })
      .whereNull("timer");
    // const data = await Strategy.findByIdWithRule(id);
    // await MongoStrategy.findOneAndUpdate(
    //   { id },
    //   { $set: data },
    //   {
    //     upsert: true
    //   }
    // );
  }
};

Strategy.updatePresetItems = async function (preset_id) {
  // const preset = await Strategy.findByIdWithRule(id);
  const strategies_under_preset = await Strategy.query()
    .where({ preset_id })
    .select("id", "user_id");
  const unique = {};
  for (var strategy of strategies_under_preset) {
    unique[strategy.user_id] = strategy.id;
  }
  for (var user_id in unique) {
    const id = unique[user_id];
    const delete_count = await Strategy.query()
      .delete()
      .whereNot("id", id)
      .where({ preset_id, user_id });
    console.log(user_id, id, preset_id, "DELETED", delete_count);
  }
  // Strategy.query().delete().where({user_id: })

  // for (var strategy of strategies_under_preset) {
  //   // const body = { ...preset };
  //   // delete body["is_preset"];
  //   console.log(strategy.id, "DOING", preset_id);
  //   await Strategy.import(preset_id, strategy.user_id, true);
  //   await Strategy.deleteById(strategy.id, strategy.user_id);
  //   // await Strategy.create(body, "in-play", preset.user_id, preset.id);
  //   console.log(strategy.id, "DONE");
  // }
};
Strategy.updatePresets = async function () {
  const preset_ids = await Strategy.query()
    .where({ is_preset: true, type: "in-play" })
    .pluck("id");

  for (var preset_id of preset_ids) {
    await Strategy.updatePresetItems(preset_id);
  }
  console.log(preset_ids);
};

// Strategy.updateTimer().then(x => console.log(x));
// Strategy.updatePresets().then(x => console.log(x));
// Strategy.syncAllWithMongo().then(x => console.log(x));
//   .select()
//   .then(strategies => {
//     strategies.forEach(async strategy => {
//       await Strategy.query()
//         .patch({ slug: uuid.v4() })
//         .findById(strategy.id);
//     });
//   });

Strategy.updateUser = function (changeEvent) {
  const fullDocument = changeEvent.fullDocument;
  const { id: user_id } = fullDocument;
  delete fullDocument.password;
  const strategies = context.services
    .get("mongodb-atlas")
    .db("footyamigo")
    .collection("strategies");
  return strategies.updateMany({ user_id }, { $set: { user: fullDocument } });
};
module.exports = Strategy;
