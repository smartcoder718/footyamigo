exports.up = function(knex) {
  return knex.schema.createTable("bet_builder_rules", table => {
    // table.increments("id").primary();
    table
      .integer("bet_builder_id")
      .unsigned()
      .references("bet_builders.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .integer("rule_id")
      .notNullable()
      .unsigned()
      .references("rules.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.enum("location", ["overall", "home", "away"]);
    table.enum("team", ["both", "home", "away"]);
    table.enum("comparator", ["<=", ">=", "=", "!=", "<", ">"]);
    table.integer("value");
    table.json("values");
    table.string("category").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("bet_builder_rules");
};
