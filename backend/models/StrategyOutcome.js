const { Model } = require("objection");

class StrategyOutcome extends Model {
  static get tableName() {
    return "strategy_outcomes";
  }
  static modifiers = {
    includeRule(query) {
      query
        .joinRelated("outcome")
        .select(
          "code",
          "label",
          "strategy_outcomes.*"
        );
    }
  };

  static get relationMappings() {
    // Importing models here is a one way to avoid require loops.
    const Outcome = require("./Outcome");
    const Strategy = require("./Strategy");
    return {
      outcome: {
        relation: Model.BelongsToOneRelation,
        modelClass: Outcome,
        join: {
          from: "strategy_outcomes.outcome_id",
          to: "outcomes.id"
        }
      },
      strategy: {
        relation: Model.BelongsToOneRelation,
        modelClass: Strategy,
        join: {
          from: "strategy_outcomes.strategy_id",
          to: "strategies.id"
        }
      }
    };
  }
}

module.exports = StrategyOutcome;
