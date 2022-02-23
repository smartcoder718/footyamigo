const { Model } = require("objection");

class BettingSystemPreset extends Model {
  static get tableName() {
    return "betting_system_presets";
  }
  static modifiers = {
    includeStrategy(query) {
      query.joinRelated("strategy").select("id", "title", "hit_rate");
    }
  };

  static get relationMappings() {
    const Strategy = require("./Strategy");
    const BettingSystem = require("./BettingSystem");
    return {
      strategy: {
        relation: Model.BelongsToOneRelation,
        modelClass: Strategy,
        join: {
          from: "betting_system_presets.strategy_id",
          to: "strategies.id"
        }
      },
      betting_system: {
        relation: Model.BelongsToOneRelation,
        modelClass: BettingSystem,
        join: {
          from: "betting_system_presets.betting_system_id",
          to: "betting_systems.id"
        }
      }
    };
  }
}

module.exports = BettingSystemPreset;
