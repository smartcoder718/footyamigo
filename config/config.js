require('dotenv').config(); 
module.exports = {
  development: {
    username: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
    host: process.env.DBHOST,
    dialect: 'mysql',
    port: process.env.DBPORT || 3306,
    logging: false,
  },
  test: {
    username: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
    host: process.env.DBHOST,
    dialect: 'mysql',
    port: process.env.DBPORT || 3306,
    logging: false,
  },
  production: {
    username: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
    host: process.env.DBHOST,
    dialect: 'mysql',
    logging: false,
    port: process.env.DBPORT || 3306,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};