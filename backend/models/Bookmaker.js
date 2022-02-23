const { Model } = require("objection");

class Bookmaker extends Model {
  static get tableName() {
    return "bookmakers";
  }
}


Bookmaker.findAll = function () {
  return this.query();
};

Bookmaker.bulkCreate = function (items) {
  items = items.map((item) => {
    const { id, name, logo } = item;
    return {
      id,
      name,
      logo,
    };
  });
  return this.knex().table("bookmakers").insert(items).onConflict("id").merge();
};

module.exports = Bookmaker;
