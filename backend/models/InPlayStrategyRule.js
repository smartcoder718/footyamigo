const { Model } = require("objection");

class InPlayStrategyRule extends Model {
  static get tableName() {
    return "strategy_inplay_rules";
  }
  static get jsonAttributes() {
    return ["values", "timer"];
  }

  static modifiers = {
    includeRule(query) {
      query
        .leftJoinRelated("first_rule")
        .leftJoinRelated("second_rule")
        .select(
          "first_rule.code as first_code",
          "second_rule.code as second_code",
          //"first_rule.label as first_label",
          //"second_rule.label as second_label",
          "first_category",
          "second_category",
          "first_subcategory",
          "second_subcategory",
          "comparator",
          "value",
          "odds_value",
          "first_team",
          "second_team",
          "timer"
        );
    }
  };

  static get relationMappings() {
    // Importing models here is a one way to avoid require loops.
    const Rule = require("./Rule");
    const Strategy = require("./Strategy");
    return {
      first_rule: {
        relation: Model.HasOneRelation,
        modelClass: Rule,
        join: {
          from: "strategy_inplay_rules.first_rule_id",
          to: "rules.id"
        }
      },
      second_rule: {
        relation: Model.HasOneRelation,
        modelClass: Rule,
        join: {
          from: "strategy_inplay_rules.second_rule_id",
          to: "rules.id"
        }
      },
      strategy: {
        relation: Model.BelongsToOneRelation,
        modelClass: Strategy,
        join: {
          from: "strategy_inplay_rules.strategy_id",
          to: "strategies.id"
        }
      }
    };
  }
}

module.exports = InPlayStrategyRule;
