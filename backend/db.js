const { Model } = require("objection");
const Knex = require("knex");

require("dotenv").config();

const redis = require("redis");
//const redisPort = 6379;
//const redisClient = redis.createClient(redisPort);
const redisClient = null;
const host = process.env.DBHOST;
const database = process.env.DBNAME;
const user = process.env.DBUSER;
const port = process.env.DBPORT || 3306;
const password = process.env.DBPASS;
const client = process.env.DBCLIENT || "mysql2";

// Initialize knex.
const knex = Knex({
  client,
  connection: {
    host,
    database,
    user,
    password,
    port,
    charset: "utf8mb4",
  },
});
// if (process.env.DOMAIN == "macbook.local") {
//   knex.on("query", console.log);
// }

Model.knex(knex);

const models = [
  "AggregateStat",
  "BetBuilder",
  "BetBuilderRule",
  "BettingSystem",
  "BettingSystemPreset",
  "Bookmaker",
  "Country",
  "InPlayStrategyRule",
  "Market",
  "Odd",
  "Outcome",
  "PreMatchStrategyRule",
  "Probability",
  "QuickAlert",
  "Result",
  "Rule",
  "ScheduledAlert",
  "Strategy",
  "Team",
  "TelegramToken",
  "User",
  "Subscription",
  "Plan",
  "PageVideo",
  "Transaction",
  "LocalCountry",
  "FreeTrial",
  "AccountActivationCode",
  "SubscriptionDetail",
  "Update",
];
const modelsObj = Object.assign(
  {},
  ...models.map((model) => {
    return {
      [model]: require("./models/" + model),
    };
  })
);
const Fixture = require("./mongomodels/Fixture");
const Pick = require("./mongomodels/Pick");
const League = require("./mongomodels/League");
const MongoUser = require("./mongomodels/User");
const Streak = require("./mongomodels/Streak");
const Broadcast = require("./mongomodels/Broadcast");

module.exports = {
  ...modelsObj,
  knex,
  redisClient,
  Fixture,
  Pick,
  League,
  Streak,
  MongoUser,
  Broadcast,
};
require("./mongo");
require("./seeders");
require("./querybuilders");
