exports.up = function(knex) {
  return knex.schema.createTable("account_activation_codes", table => {
    table.increments("id").primary();
    table.string("code").notNullable();
    table
      .string("email")
      .notNullable(); //DONE
    table.datetime("expires_at").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("account_activation_codes");
};
