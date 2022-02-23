exports.up = function(knex) {
  return knex.schema.createTable("bet_builder_odds", table => {
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
    table.enum("comparator", ["<=", ">=", "=", "!=", "<", ">"]);
    table.decimal("value", { precision: 2 });
    table.string("category").defaultTo("odds").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("bet_builder_odds");
};
