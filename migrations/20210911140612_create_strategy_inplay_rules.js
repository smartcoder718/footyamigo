exports.up = function(knex) {
  return knex.schema.createTable("strategy_inplay_rules", table => {
    // table.increments("id").primary();
    table
      .integer("first_rule_id")
      .notNullable()
      .unsigned()
      .references("rules.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .integer("second_rule_id")
      .unsigned()
      .references("rules.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.string("first_team");
    table.string("second_team");
    table.string("first_category").notNullable();
    table.string("first_subcategory");
    table.string("second_subcategory");
    table.enum("comparator", ["<=", ">=", "=", "!=", "<", ">"]);
    table.decimal("odds_value");
    table.integer("value");
    table
      .integer("strategy_id")
      .unsigned()
      .references("strategies.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("strategy_inplay_rules");
};
