const { Model } = require("objection");

class PreMatchStrategyRule extends Model {
  static get tableName() {
    return "strategy_prematch_rules";
  }
  static get jsonAttributes() {
    return ["values"];
  }
  static modifiers = {
    includeRule(query) {
      query
        .joinRelated("rule")
        .select(
          "code",
          "category",
          "overall",
          "home",
          "label",
          "away",
          "direct",
          "strategy_prematch_rules.*"
        );
    }
  };

  static get relationMappings() {
    // Importing models here is a one way to avoid require loops.
    const Rule = require("./Rule");
    const Strategy = require("./Strategy");
    return {
      rule: {
        relation: Model.HasOneRelation,
        modelClass: Rule,
        join: {
          from: "strategy_prematch_rules.rule_id",
          to: "rules.id"
        }
      },
      strategy: {
        relation: Model.BelongsToOneRelation,
        modelClass: Strategy,
        join: {
          from: "strategy_prematch_rules.strategy_id",
          to: "strategies.id"
        }
      }
    };
  }
}

module.exports = PreMatchStrategyRule;
