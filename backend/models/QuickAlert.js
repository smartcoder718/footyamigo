const { Model } = require("objection");

class QuickAlert extends Model {
  static get tableName() {
    return "quick_alerts";
  }
}

module.exports = QuickAlert;
