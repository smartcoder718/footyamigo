const { Model } = require("objection");

class ScheduledAlert extends Model {
  static get tableName() {
    return "scheduled_alerts";
  }
}

ScheduledAlert.findPending = function() {
  const beginTime = moment()
    .subtract(30, "seconds")
    .unix();
  const endTime = moment()
    .add(30, "seconds")
    .unix();
  return this.query()
    .whereBetween("timestamp", [beginTime, endTime])
    .where("status", "pending");
};

ScheduledAlert.deleteById = function(id) {
  return this.query().deleteById(id);
};

module.exports = ScheduledAlert;
