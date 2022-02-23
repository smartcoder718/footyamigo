exports.up = function (knex) {
  return knex.schema.createTable("strategies", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.string("type").notNullable();
    table.integer("outcome_id").unsigned().references("outcomes.id");
   // table.boolean("needs_odds").defaultTo(false);
    table.boolean("is_public").defaultTo(false);
    table.boolean("is_preset").defaultTo(false);
    table.json("timer");
    table.decimal("hit_rate", { precision: 2 }).defaultTo(0);
    table.integer("fixtures_found").defaultTo(0);
    table.integer("picks_sent").defaultTo(0);
    table.date("last_checked");
    table.boolean("trusted").defaultTo(false);
    table.boolean("active").defaultTo(true);
    table.json("leagues");
    table.string("note");
    table.integer("user_id").unsigned().references("users.id");
    table
      .dateTime("created_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    table
      .dateTime("updated_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("strategies");
};

