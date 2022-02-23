const { Model } = require("objection");

class AggregateStat extends Model {
  static get tableName() {
    return "aggregate_stats";
  }
  static get jsonAttributes() {
    return [
      "corner_timings_against",
      "corner_timings_all",
      "corner_timings_for",
      "goal_timings_all",
      "goal_timings_against",
      "goal_timings_for",
    ];
  }

}

AggregateStat.upsert = function (data) {
  return this.query().insert(data).onConflict().merge();
};

AggregateStat.findByFixtureId = function (id) {
  return this.query().find(id);
};

module.exports = AggregateStat;
