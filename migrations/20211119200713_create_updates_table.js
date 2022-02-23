exports.up = function(knex) {
  return knex.schema.createTable("updates", table => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.string("content", 5000);
    table.decimal("version", { precision: 2 });
    table.datetime("datetime");
    table
      .boolean("completed")
      .notNullable()
      .defaultTo(false);

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

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("updates");
};
