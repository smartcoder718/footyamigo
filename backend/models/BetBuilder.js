const { Model, raw } = require("objection");

class BetBuilder extends Model {
  static get tableName() {
    return "bet_builders";
  }
  static get jsonAttributes() {
    return ["leagues"];
  }
  static get relationMappings() {
    // Importing models here is a one way to avoid require loops.
    const BetBuilderRule = require("./BetBuilderRule");
    const BetBuilderProbability = require("./BetBuilderProbability");
    return {
      rules: {
        relation: Model.HasManyRelation,
        modelClass: BetBuilderRule,
        join: {
          from: "bet_builders.id",
          to: "bet_builder_rules.bet_builder_id"
        }
      },
      probabilities: {
        relation: Model.HasManyRelation,
        modelClass: BetBuilderProbability,
        join: {
          from: "bet_builders.id",
          to: "bet_builder_probabilities.bet_builder_id"
        }
      }
    };
  }
}

BetBuilder.findActive = function() {
  return this.query()
    .where({ active: true })
    .withGraphFetched("rules(includeRule)")

    .withGraphFetched("probabilities(includeRule)");
};

BetBuilder.findForAdmin = function() {
  return this.query().withGraphFetched("rules");
};

BetBuilder.toggleByAdmin = function(id) {
  return this.query().patchAndFetchById(id, { active: raw("NOT active") });
};

BetBuilder.deleteByAdmin = function(id) {
  return this.query().deleteById(id);
};

BetBuilder.createByAdmin = function(body) {
  var { title, outcome, note, leagues } = body;
  return this.transaction(async trx => {
    const bet_builder = await BetBuilder.query(trx).insert({
      title,
      outcome,
      note,
      leagues
    });
    const types = ["rules", "probabilities"];
    for (var type of types) {
      const table_name = "bet_builder_" + type;
      var items = body[type].map(rule => {
        return {
          ...rule,
          bet_builder_id: bet_builder.id
        };
      });
      if (items.length) {
        await trx.table(table_name).insert(items);
      }
    }
    return bet_builder;
  });
};

BetBuilder.findByIdAdmin = function(id) {
  return this.query()
    .findById(id)
    .withGraphFetched("rules")
    .withGraphFetched("probabilities");
};

BetBuilder.editByAdmin = function(body) {
  var { title, outcome, note, leagues, id } = body;
  return this.transaction(async trx => {
    const bet_builder = await BetBuilder.query(trx).patchAndFetchById(id, {
      title,
      outcome,
      note,
      leagues
    });
    const types = ["rules", "probabilities"];
    for (var type of types) {
      const table_name = "bet_builder_" + type;
      await trx
        .table(table_name)
        .where("bet_builder_id", bet_builder.id)
        .del();
      var items = body[type].map(rule => {
        return {
          ...rule,
          bet_builder_id: bet_builder.id
        };
      });
      if (items.length) {
        await trx.table(table_name).insert(items);
      }
    }
    return bet_builder;
  });
};

module.exports = BetBuilder;
