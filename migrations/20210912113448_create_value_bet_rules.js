exports.up = function(knex) {
  return knex.schema.createTable("value_bet_rules", table => {
    table.increments("id").primary();
    table
      .integer("value_bet_id")
      .unsigned()
      .references("value_bets.id");
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
    table.decimal("value", { precision: 2 });
    table.json("values");
    table.string("category").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("value_bet_rules");
};
