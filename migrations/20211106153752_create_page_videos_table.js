exports.up = function(knex) {
  return knex.schema.createTable("page_videos", table => {
    table.increments("id").primary();
    table
      .string("location", 255)
      .notNullable()
      .unique();
    table.string("title", 255);
    table.string("video_url", 1000).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("page_videos");
};
