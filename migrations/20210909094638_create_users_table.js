exports.up = function(knex) {
  return knex.schema.createTable("users", table => {
    table.increments("id").primary();
    table
      .string("email")
      .notNullable()
      .unique();
    table.string("password").notNullable();
    table.string("firstname").notNullable();
    table.string("lastname").notNullable();
    table.integer("utcoffset").defaultTo(0);
    table.string("locale").defaultTo("en");
    table.string("role").defaultTo("trial");
    table.integer("telegram");
    table
      .boolean("seen_intro")
      .notNullable()
      .defaultTo(false);

    table
      .integer("avatar_id")
      .notNullable()
      .defaultTo(1);
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
  return knex.schema.dropTableIfExists("users");
};
