const { Model } = require("objection");
const { raw } = require("objection");

class ValueBet extends Model {
  static get tableName() {
    return "value_bets";
  }
  static get jsonAttributes() {
    return ["leagues"];
  }

  static get relationMappings() {
    const ValueBetRule = require("./ValueBetRule");

    return {
      rules: {
        relation: Model.HasManyRelation,
        modelClass: ValueBetRule,
        join: {
          from: "value_bets.id",
          to: "value_bet_rules.value_bet_id",
        },
      },
    };
  }
}

ValueBet.findForAdmin = function () {
  return this.query().withGraphFetched("rules");
};

ValueBet.toggleByAdmin = function (id) {
  return this.query().patchAndFetchById(id, { active: raw("NOT active") });
};

ValueBet.deleteByAdmin = function (id) {
  return this.query().deleteById(id);
};

ValueBet.createByAdmin = function (body) {
  var { title, rules, outcomes, note, leagues } = body;
  return this.query().upsertGraph(
    {
      title,
      rules,
      outcomes,
      note,
      leagues,
    },
    { relate: ["rules"] }
  );
};
module.exports = ValueBet;
