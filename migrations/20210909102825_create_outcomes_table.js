exports.up = function(knex) {
  return knex.schema.createTable("outcomes", table => {
    table.increments("id").primary();
    table
      .string("code")
      .notNullable()
      .unique();
    table.string("label").notNullable();
    table.boolean("active").defaultTo(true);
    table.boolean("is_bet_builder").defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("outcomes");
};
