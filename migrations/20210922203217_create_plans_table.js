exports.up = function(knex) {
  return knex.schema.createTable("plans", table => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.decimal("price", { precision: 2 }).notNullable();
    table.integer("days").notNullable();
    table
      .boolean("trial")
      .notNullable()
      .defaultTo(true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("plans");
};
