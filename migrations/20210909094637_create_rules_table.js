exports.up = function(knex) {
  return knex.schema.createTable("rules", table => {
    table.increments("id").primary();
    table.string("code").notNullable();
    table.string("label").notNullable();
    table.enum("type", ["avg", "per", "num"]);
    table
      .integer("min")
      .notNullable()
      .defaultTo(0);
    table
      .integer("max")
      .notNullable()
      .defaultTo(100);
    table.decimal("step", { precision: 2 }).defaultTo(1);
    table.boolean("inplay_only");
    table.string("description").notNullable();
    table.boolean("direct");
    table.enum("category", [
      "general",
      "goals",
      "corners",
      "cards",
      "odds",
      "probability",
      "half",
      "stats",
    ]);
    table
      .boolean("active")
      .notNullable()
      .defaultTo(true);
    table.boolean("has_team");
    table.string("overall");
    table.string("home");
    table.string("away");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("rules");
};
