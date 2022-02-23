const { Model } = require("objection");

class ValueBetRule extends Model {
  static get tableName() {
    return "value_bet_rules";
  }
  static get jsonAttributes() {
    return ["values"];
  }
}

module.exports = ValueBetRule;
