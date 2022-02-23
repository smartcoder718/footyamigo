exports.up = function(knex) {
  return knex.schema.createTable("bet_builder_probabilities", table => {
    // table.increments("id").primary();
    table
      .integer("strategy_id")
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
    table.enum("comparator", ["<=", ">=", "=", "!=", "<", ">"]);
    table
      .string("category")
      .defaultTo("probability")
      .notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("bet_builder_probabilities");
};
