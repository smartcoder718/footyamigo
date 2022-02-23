const { Model } = require("objection");

class Market extends Model {
  static get tableName() {
    return "markets";
  }
}

Market.findActive = function () {
  return this.query().where({
    active: true,
  })
};

Market.bulkCreate = function (items) {
  items = items.map((item) => {
    const { id, name, category, active } = item;
    return {
      id,
      name,
      category,
      active,
    };
  });
  return this.knex().table("markets").insert(items).onConflict("id").merge();
};

module.exports = Market;
