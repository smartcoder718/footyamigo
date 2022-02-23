// Update with your config settings.
require("dotenv").config();

const host = process.env.DBHOST || "localhost";
const database = process.env.DBNAME;
const user = process.env.DBUSER || "root";
const port = process.env.DBPORT || 3306;
const password = process.env.DBPASS;
const client = process.env.DBCLIENT || "mysql2";

module.exports = {
  development: {
    client,
    connection: {
      host,
      database,
      user,
      password,
      port
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },
  staging: {
    client,
    connection: {
      host,
      database,
      user,
      password,
      port
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client,
    connection: {
      host,
      database,
      user,
      password,
      port
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }
};
