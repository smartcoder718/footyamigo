const { Model } = require("objection");

class SubscriptionDetail extends Model {
  static get tableName() {
    return "subscription_details";
  }
}

SubscriptionDetail.create = function(data) {
  return this.query().insert(data);
};

SubscriptionDetail.cancel = function(subscription_id) {
  console.log("cancelled", subscription_id);
  return this.query()
    .patch({ update_url: null, cancel_url: null })
    .where({ subscription_id });
};

module.exports = SubscriptionDetail;
