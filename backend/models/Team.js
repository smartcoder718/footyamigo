const { Model } = require("objection");

class Team extends Model {
  static get tableName() {
    return "teams";
  }
}

module.exports = Team;
