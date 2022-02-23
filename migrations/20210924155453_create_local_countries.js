exports.up = function(knex) {
  return knex.schema.createTable("local_countries", table => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("currency").notNullable();
    table.decimal("pro_price", { precision: 2 });
    table.string("payment_url");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("local_countries");
};
