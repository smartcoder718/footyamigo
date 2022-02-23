const { Model } = require("objection");

class LocalCountry extends Model {
  static get tableName() {
    return "local_countries";
  }
}

LocalCountry.findForAdmin = function() {
  return this.query().orderBy("name");
};

LocalCountry.findById = function(id) {
  return this.query().findById(id);
};

LocalCountry.deleteByAdmin = function(id) {
  return this.query().deleteById(id);
};

LocalCountry.createByAdmin = function(body) {
  var { name, payment_url, currency, pro_price } = body;
  return this.query().insert({
    name,
    payment_url,
    currency,
    pro_price
  });
};

LocalCountry.editByAdmin = function(body) {
  var { id, name, payment_url, currency, pro_price } = body;
  return this.query()
    .update({
      name,
      payment_url,
      currency,
      pro_price
    })
    .where("id", id);
};

module.exports = LocalCountry;
