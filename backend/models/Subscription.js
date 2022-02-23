const { Model } = require("objection");

class Subscription extends Model {
  static get tableName() {
    return "subscriptions";
  }
  static modifiers = {
    withPlan(query) {
      query.leftJoinRelated("plan").select("plan.*", "subscriptions.*");
    },
    withDetails(query) {
      query.leftJoinRelated("subscription_details").select(
        // "transaction.receipt_url",
        // "transaction.status as transaction_status",
        // "subscription_details.update_url",
        // "subscription_details.cancel_url"
        "subscription_details.*"
      );
    }
  };

  static get relationMappings() {
    // Importing models here is a one way to avoid require loops.
    const Plan = require("./Plan");
    const User = require("./User");
    const Transaction = require("./Transaction");
    const SubscriptionDetail = require("./SubscriptionDetail");
    return {
      plan: {
        relation: Model.BelongsToOneRelation,
        modelClass: Plan,
        join: {
          from: "subscriptions.plan_id",
          to: "plans.id"
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "subscriptions.email",
          to: "users.email"
        }
      },
      subscription_details: {
        relation: Model.HasOneRelation,
        modelClass: SubscriptionDetail,
        join: {
          from: "subscriptions.subscription_id",
          to: "subscription_details.subscription_id"
        }
      },
      transaction: {
        relation: Model.HasOneRelation,
        modelClass: Transaction,
        join: {
          from: "subscriptions.checkout_id",
          to: "transactions.checkout_id"
        }
      }
    };
  }
}

async function cancelSubscription(order_id, trx) {
  const subscription = await Subscription.query().findOne({ order_id });

  return subscription.$relatedQuery("subscription_details", trx).update({
    update_url: null,
    cancel_url: null
  });
}

Subscription.cancel = async function(order_id, data) {
  const trx = await Subscription.startTransaction();
  await cancelSubscription(order_id, data, trx);
  return await trx.commit();
};

Subscription.update = function(order_id, data) {
  return this.query()
    .update(data)
    .where({ order_id });
};

// Subscription.query()
//   .modify("withPlan")
//   .modify("withDetails")
//   .then(x => {
//     console.log("SUB", x);
//   });

module.exports = Subscription;
