const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const fs = require("fs");
const StrategySchema = new Schema(
  {
    id: { type: Number, unique: true },
    active: { type: Boolean, index: true },
    is_present: { type: Boolean, index: true },
    is_public: { type: Boolean, index: true },
    user_id: { type: Number, index: true }
  },
  { strict: false }
);
const Strategy = mongoose.model("Strategy", StrategySchema);

// Strategy.findById = function(filter_id, page = 1) {
//   return this.find({
//     user_id
//   })
//     .sort({ created_at: -1 })
//     .limit(limit);
// };

Strategy.deleteById = function(id, user_id) {
  return this.findOneAndDelete({
    id,
    user_id
  });
};

Strategy.cleanDeleted = async function(id, user_id) {
  const StrategySQL = require("../models/Strategy");
  const strategy_ids = await StrategySQL.query().pluck("id");
  // console.log(strategy_ids);
  const old_ones = await this.deleteMany({ id: { $nin: strategy_ids } });
  console.log(old_ones);
};
// setTimeout(y => {
//   Strategy.cleanDeleted().then(x => console.log(x));
// }, 3000);

// Strategy.find().then(async strategies => {
//   const PrematchStrategyRule = require("../models/PreMatchStrategyRule");
//   var strategy_pre_match_rules = [];
//   for (var strategy of strategies) {
//     for (var rule of strategy.strategy_prematch_rules) {
//       strategy_pre_match_rules.push(rule);
//     }
//   }
//   strategy_pre_match_rules = strategy_pre_match_rules.map(x => {
//     var {
//       strategy_id,
//       rule_id,
//       location,
//       team,
//       comparator,
//       value,
//       values
//     } = x;
//     values= JSON.stringify(values)
//     return { strategy_id, rule_id, location, team, comparator, value, values };
//   });
//   await PrematchStrategyRule.knex().table("strategy_prematch_rules").insert(strategy_pre_match_rules).onConflict().merge()
//   // fs.writeFileSync("strategy_prematch.json", JSON.stringify(strategy_pre_match_rules));
// });

// Strategy.find().then(async strategies => {
//   const InPlayStrategyRule = require("../models/InPlayStrategyRule");
//   var strategy_inplay_rules = [];
//   for (var strategy of strategies) {
//     for (var rule of strategy.strategy_inplay_rules) {
//       strategy_inplay_rules.push(rule);
//     }
//   }
//   strategy_inplay_rules = strategy_inplay_rules.map(x => {
//     var {
//       first_rule_id,
//       second_rule_id,
//       first_team,
//       second_team,
//       first_category,
//       second_category,
//       comparator,
//       value,
//       strategy_id,
//       first_subcategory,
//       second_subcategory,
//       odds_value
//     } = x;

//     return {
//       first_rule_id,
//       second_rule_id,
//       first_team,
//       second_team,
//       first_category,
//       second_category,
//       comparator,
//       value,
//       strategy_id,
//       first_subcategory,
//       second_subcategory,
//       odds_value
//     };
//   });
//   await InPlayStrategyRule.knex().table("strategy_inplay_rules").insert(strategy_inplay_rules).onConflict().merge()
//   // fs.writeFileSync("strategy_prematch.json", JSON.stringify(strategy_pre_match_rules));
// });
// console.log(x);
// fs.writeFileSync("deleted.json", JSON.stringify(x));
// Strategy.findOne({ id: 74 }).then(x => console.log(JSON.stringify(x)));

// const StrategySQL = require("../models/Strategy");
// StrategySQL.findForMongo().then(async strategies => {
//   await Strategy.insertMany(strategies);
//   console.log("Strategies", strategies);
// });

module.exports = Strategy;
