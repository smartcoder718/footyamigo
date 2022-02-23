exports.up = function(knex) {
  return knex.schema.createTable("subscriptions", table => {
    table.increments("id").primary();
    table.string("email").references("users.email").unique();
    table
      .integer("plan_id")
      .unsigned()
      .references("plans.id")
      .notNullable();
    table.string("order_id").references("transactions.order_id");
    table.string("subscription_id");
    table.datetime("start_date");
    table.datetime("end_date");
    table.enum("status", ["active", "cancelled", "expired"]).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("subscriptions");
};
