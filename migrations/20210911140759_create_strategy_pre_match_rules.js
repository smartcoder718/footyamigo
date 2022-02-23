exports.up = function (knex) {
  return knex.schema.createTable("strategy_prematch_rules", (table) => {
    // table.increments("id").primary();
    table
      .integer("strategy_id")
      .unsigned()
      .references("strategies.id")
      .notNullable()
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .integer("rule_id")
      .unsigned()
      .notNullable()
      .references("rules.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.enum("location", ["overall", "home", "away"]);
    table.enum("team", ["both", "home", "away", "either"]);
    table.enum("comparator", ["<=", ">=", "=", "!=", "<", ">"]);
    table.decimal("value", { precision: 2 });
    table.json("values");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("strategy_prematch_rules");
};
