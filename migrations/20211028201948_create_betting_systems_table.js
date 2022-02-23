exports.up = function (knex) {
  return knex.schema.createTable("betting_systems", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.string("description", 1000).notNullable();
    table.integer("roi").notNullable();
    table.string("video_embed", 1000).notNullable();
    table.string("video_description", 1000).notNullable();
    table.string("learn", 1000).notNullable();
    table.boolean("active").notNullable().defaultTo(false);
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
  return knex.schema.dropTableIfExists("betting_systems");
};
