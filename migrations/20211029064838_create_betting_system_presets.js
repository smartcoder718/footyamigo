exports.up = function(knex) {
  return knex.schema.createTable("betting_system_presets", table => {
    //table.increments("id").primary();
    table
      .integer("strategy_id")
      .unsigned()
      .notNullable()
      .references("strategies.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .integer("betting_system_id")
      .unsigned()
      .notNullable()
      .references("betting_systems.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.primary(["strategy_id", "betting_system_id"]);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("betting_system_presets");
};
