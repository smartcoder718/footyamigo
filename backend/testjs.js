// run the following command to install:
// npm install objection knex sqlite3

const { Model } = require("objection");
const Knex = require("knex");
const fs = require("fs");
require("dotenv").config();

const redis = require("redis");
const redisPort = 6379;
const client = redis.createClient(redisPort);

const host = process.env.DBHOST || "localhost";
const database = process.env.DBNAME || "footynodejs";
const user = process.env.DBUSER || "root";
const port = process.env.DBPORT || 3306;
const password = process.env.DBPASS || "Vishal123?";

// Initialize knex.
const knex = Knex({
  client: "mysql2",
  connection: {
    host,
    database,
    user,
    password,
    port,
  },
});

// Give the knex instance to objection.
Model.knex(knex);

const Country = require("./models/Country");
const Fixture = require("./models/Fixture");

async function fetchCountries() {
  // Fetch all people named Sylvester and sort them by id.
  // Load `children` relation eagerly.
  const countries = await Country.query()
    .withGraphJoined(
      "[fixtures(liveGames).[home(overallStats),away(overallStats)]]",
      { joinOperation: "rightJoin" }
    )
    .modifiers({
      overallStats: (builder) => {
        builder.where("last", "100");
      },
      liveGames: (builder) => {
        builder.where("status", "LIVE");
      },
    });

  /*
    .modifyGraph("fixtures", (builder) => {
      builder
        .where("status", "=", "LIVE")
        .where("fixtures.home.last", "=", "100")
        .where("fixtures.away.last", "=", "100");
    });*/
  return countries;
}

async function main_two() {
  // Fetch all people named Sylvester and sort them by id.
  // Load `children` relation eagerly.
  const fixture = await Fixture.query()
    .where("fixtures.id", "=", 18406576)
    .withGraphJoined({
      home: true,
      away: true,
    })
    .where("home.last", "=", "100")
    .where("away.last", "=", "100");
  console.log(fixture);
  const toWrite = JSON.stringify(fixture, null, 2);
  fs.writeFileSync("fixture.json", toWrite);
}
//ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION

function caching() {
  try {
    client.get("liveFixtures", async (err, countries) => {
      if (err) throw err;
      if (countries) {
        countries = JSON.parse(countries);
      } else {
        countries = await fetchCountries();
        client.setex("liveFixtures", 15, JSON.stringify(countries));
      }
      console.log(countries);
    });
  } catch (err) {
    console.log(error);
  }
}

async function randomFixture() {
  const fixture = await Fixture.query()
    .findOne({ "fixtures.id": 18324739 })
    .withGraphJoined({
      home: true,
      away: true,
      probability: true
    });
  console.log(fixture);
}

randomFixture();
