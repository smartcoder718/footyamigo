const { Model } = require("objection");

class Transaction extends Model {
  static get tableName() {
    return "transactions";
  }
  static modifiers = {
    withPlan(query) {
      query.leftJoinRelated("plan").select("plan.*", "transactions.*");
    }
  };

  static get relationMappings() {
    // Importing models here is a one way to avoid require loops.
    const Plan = require("./Plan");
    const User = require("./User");

    return {
      plan: {
        relation: Model.BelongsToOneRelation,
        modelClass: Plan,
        join: {
          from: "transactions.plan_id",
          to: "plans.id"
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "transactions.user_id",
          to: "users.id"
        }
      }
    };
  }
}

Transaction.create = function(data) {
  return this.transaction(async trx => {
    const transaction = await Transaction.query(trx)
      .insert(data)
      .onConflict()
      .merge();
    return transaction;
  });
};

Transaction.findLatest = function(email) {
  return this.query()
    .findOne({ status: "success", email })
    .modify("withPlan");
};

Transaction.update = function(checkout_id, data) {
  return this.query()
    .update(data)
    .where({ checkout_id });
};

Transaction.updateStatus = function(checkout_id, status) {
  return this.query()
    .update({ status })
    .where({ checkout_id });
};

module.exports = Transaction;
