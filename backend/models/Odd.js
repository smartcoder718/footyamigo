const { Model } = require("objection");

class Odd extends Model {
  // Table name is the only required property.
  static get tableName() {
    return "odds";
  }
}

Odd.find = function (fixture_id, type) {
  console.log(fixture_id, type)
  return this.query().findOne({
    fixture_id,
    type,
  });
};
/*
Odd.query().delete().whereNull("home_win").then(res=> {
  console.log(res)
})*/
/*

Odd.findPeak = function (fixture_id) {
  return this.query()
    .where({
      fixture_id,
      type: "peakodds",
    })
    .findOne();
};


Odd.findPrematch = function (fixture_id) {
  return this.query()
    .where({
      fixture_id,
      type: "preodds",
    })
    .findOne();
};

Odd.findLive= function (fixture_id) {
  return this.query()
    .where({
      fixture_id,
      type: "liveodds",
    })
    .findOne();
};
*/

module.exports = Odd;
