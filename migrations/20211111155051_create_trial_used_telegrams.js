exports.up = function(knex) {
  return knex.schema.createTable("free_trials", table => {
    table.increments("id").primary();
    table.integer("chat_id").notNullable();
    table.integer("user_id").unsigned().references("users.id").notNullable();
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
  return knex.schema.dropTableIfExists("free_trials");
};
