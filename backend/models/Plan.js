const { Model } = require("objection");

class Plan extends Model {
  static get tableName() {
    return "plans";
  }
}

Plan.findForAdmin = function() {
  return this.query();
};

Plan.findById = function(id) {
  return this.query().findById(id);
};

Plan.deleteByAdmin = function(id) {
  return this.query().deleteById(id);
};

Plan.createByAdmin = function(body) {
  var { name, price, days, trial } = body;
  return this.query().insert({
    name,
    price,
    days,
    trial
  });
};

Plan.editByAdmin = function(body) {
  var { id, name, price, days, trial } = body;
  return this.query()
    .update({
      name,
      price,
      days,
      trial
    })
    .where("id", id);
};

module.exports = Plan;
