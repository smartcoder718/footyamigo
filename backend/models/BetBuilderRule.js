const { Model } = require("objection");

class BetBuilderRule extends Model {
  static get tableName() {
    return "bet_builder_rules";
  }
  static get jsonAttributes() {
    return ["values"];
  }
  static modifiers = {
    includeRule(query) {
      query
        .joinRelated("rule")
        .select(
          "bet_builder_rules.*",
          "code",
          "rule.category as rule_category",
          "overall",
          "home",
          "label",
          "away"
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
          from: "bet_builder_rules.rule_id",
          to: "rules.id"
        }
      }
    };
  }
}

module.exports = BetBuilderRule;
