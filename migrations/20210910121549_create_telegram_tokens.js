exports.up = function (knex) {
  return knex.schema.createTable("telegram_tokens", (table) => {
    table.increments("id").primary();
    table.string("activation_token");
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
  return knex.schema.dropTableIfExists("telegram_tokens");
};
