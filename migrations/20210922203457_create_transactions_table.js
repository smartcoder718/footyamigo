exports.up = function(knex) {
  return knex.schema.createTable("transactions", table => {
    table.increments("id").primary();
    table.string("checkout_id").notNullable();
    //DONE
    table
      .string("order_id")
      .unique()
      .notNullable();
    table.string("payment_id");
    table.string("subscription_id").notNullable();
    table
      .string("email")
      .references("users.email")
      .notNullable(); //DONE
    table.decimal("amount_usd", { precision: 2 });
    table.decimal("amount", { precision: 2 }); //DONE
    table.string("currency"); //DONE
    table.string("status"); //DONE
    table.string("receipt_url"); //DONE
    table.integer("plan_id");
    table.string("payment_method");
    table.enum("gateway", ["paddle", "coinbase", "flutterwave"]).notNullable(); //DONE
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
  return knex.schema.dropTableIfExists("transactions");
};
