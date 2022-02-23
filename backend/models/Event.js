const { Model } = require("objection");

class Event extends Model {
  // Table name is the only required property.
  static get tableName() {
    return "events";
  }
}

module.exports = Event;
