const { Model } = require("objection");

class Result extends Model {
  static get tableName() {
    return "results";
  }
  static modifiers = {
    forFixture(query) {
      query.select("results.ht_score", "results.ft_score");
    },
  };
  static get jsonAttributes() {
    return ["corner_timings_away", "corner_timings_all", "corner_timings_home", "goal_timings_all", "goal_timings_away", "goal_timings_home"];
  }
}

module.exports = Result;
