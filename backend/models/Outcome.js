const { Model } = require("objection");

class Outcome extends Model {
  static get tableName() {
    return "outcomes";
  }

  static modifiers = {
    includeRule(query) {
      query.select("outcomes.*");
    }
  };
}

Outcome.findActive = function() {
  return this.query().where({
    active: true
  }).orderBy("label", "ASC");
};

Outcome.bulkCreate = function(items) {
  items = items.map(item => {
    const { id, code, is_bet_builder, active, label } = item;
    return {
      id,
      code,
      is_bet_builder,
      label,
      active
    };
  });
  return this.knex()
    .table("outcomes")
    .insert(items)
    .onConflict("id")
    .merge();
};

Outcome.findBetBuilders = function() {
  return this.query().where({
    is_bet_builder: true,
    active: true
  });
};

module.exports = Outcome;
