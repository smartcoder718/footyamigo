exports.up = function (knex) {
  return knex.schema.createTable("value_bets", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.string("outcome").notNullable();
    table.boolean("active").defaultTo(true);
    table.json("leagues");
    table.string("note");
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
  return knex.schema.dropTableIfExists("value_bets");
};
