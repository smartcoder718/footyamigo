const { Model } = require("objection");

class BetBuilderProbability extends Model {
  static get tableName() {
    return "bet_builder_probabilities";
  }

  static modifiers = {
    includeRule(query) {
      query
        .joinRelated("rule")
        .select(
          "bet_builder_probabilities.*",
          "code",
          "category",
          "label"
        );
    }
  };
  static get relationMappings() {
    const Rule = require("./Rule");
    return {
      rule: {
        relation: Model.HasOneRelation,
        modelClass: Rule,
        join: {
          from: "bet_builder_probabilities.rule_id",
          to: "rules.id"
        }
      }
    };
  }
}

module.exports = BetBuilderProbability;
