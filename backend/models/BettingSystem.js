const { Model, raw } = require("objection");

class BettingSystem extends Model {
  static get tableName() {
    return "betting_systems";
  }
  
  static get relationMappings() {
    // Importing models here is a one way to avoid require loops.
    const BettingSystemPreset = require("./BettingSystemPreset");

    return {
      presets: {
        relation: Model.HasManyRelation,
        modelClass: BettingSystemPreset,
        join: {
          from: "betting_systems.id",
          to: "betting_system_presets.betting_system_id"
        }
      }
    };
  }
}

BettingSystem.findActive = function() {
  return this.query().where({ active: true });
};
BettingSystem.findOne = function(id) {
  return this.query()
    .findOne({ id })
    .where({ active: true })
    .withGraphFetched("presets(includeStrategy)");
};

BettingSystem.findForAdmin = async function() {
  const betting_systems = await this.query().withGraphFetched("presets");
  return betting_systems.map(b => {
    return {
      ...b,
      presets: b.presets.map(preset => preset.strategy_id)
    };
  });
};

BettingSystem.toggleByAdmin = function(id) {
  return this.query().patchAndFetchById(id, { active: raw("NOT active") });
};

BettingSystem.deleteByAdmin = function(id) {
  return this.query().deleteById(id);
};

BettingSystem.createByAdmin = function(body) {
  var {
    title,
    description,
    roi,
    video_embed,
    video_description,
    learn,
    active,
    presets
  } = body;
  return this.transaction(async trx => {
    const betting_system = await BettingSystem.query(trx).insert({
      title,
      description,
      roi,
      video_embed,
      video_description,
      learn,
      active
    });
    if (presets.length) {
      await trx
        .table("betting_system_presets")
        .where("betting_system_id", betting_system.id)
        .del();

      await trx
        .insert(
          presets.map(strategy_id => {
            //delete preset["id"];
            return {
              strategy_id,
              betting_system_id: betting_system.id
            };
          })
        )
        .into("betting_system_presets");
    }
    return betting_system;
  });
};

BettingSystem.updateByAdmin = function(body) {
  var {
    id,
    title,
    description,
    roi,
    video_embed,
    video_description,
    learn,
    active,
    presets
  } = body;
  return this.transaction(async trx => {
    const betting_system = await BettingSystem.query(trx).patchAndFetchById(
      id,
      {
        title,
        description,
        roi,
        video_embed,
        video_description,
        learn,
        active
      }
    );

    await trx
      .table("betting_system_presets")
      .where("betting_system_id", betting_system.id)
      .del();
    if (presets.length) {
      await trx
        .insert(
          presets.map(strategy_id => {
            //delete preset["id"];
            return {
              strategy_id,
              betting_system_id: betting_system.id
            };
          })
        )
        .into("betting_system_presets");
    }
    return betting_system;
  });
};

module.exports = BettingSystem;
