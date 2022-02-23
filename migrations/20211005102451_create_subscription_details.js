exports.up = function(knex) {
  return knex.schema.createTable("subscription_details", table => {
    table.increments("id").primary();
    table
      .string("subscription_id")
      .notNullable()
      .unique();
    table.string("update_url"); //DONE
    table.string("cancel_url"); //DONE
    table.enum("gateway", ["paddle", "coinbase", "flutterwave"]).notNullable(); //DONE
    table.integer("platform_user_id");
    table
      .dateTime("created_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP")); //DONE
    table
      .dateTime("updated_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")); //DONE
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("subscription_details");
};
