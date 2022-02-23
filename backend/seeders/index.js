const Sportmonks = require("../uploaders/Sportmonks");
const {
  Market,
  Bookmaker,
  League,
  Country,
  Outcome,
  Rule,
  Fixture,
} = require("../db");
const fs = require("fs");

const sportmonks = new Sportmonks();

async function saveMarkets(markets_path) {
  const markets = await sportmonks.getMarkets();
  await Market.bulkCreate(markets);
  fs.writeFileSync(markets_path, JSON.stringify(markets, null, 2));
}

async function saveBookmakers(bookmakers_path) {
  const bookmakers = await sportmonks.getBookmakers();
  await Bookmaker.bulkCreate(bookmakers);
  //fs.writeFileSync(bookmakers_path, JSON.stringify(bookmakers, null, 2));
}

async function saveLeagues(leagues_path) {
  const leagues = await sportmonks.getLeagues();
  // fs.writeFileSync(leagues_path, JSON.stringify(leagues, null, 2));
  await League.insertMany(leagues);
}

async function saveCountries(countries_path) {
  const countries = await sportmonks.getCountries();
  const countries_parsed = countries.map((country) => {
    return { ...country, ...country.extra };
  });
  await Country.bulkCreate(countries_parsed);
  //fs.writeFileSync(countries_path, JSON.stringify(countries_parsed, null, 2));
}
async function saveRules() {
  const rules = require("./rules.json");
  console.log();
  return await Rule.bulkCreate(rules);
}

async function saveOutcomes() {
  const outcomes = require("./outcomes.json");
  await Outcome.bulkCreate(outcomes);
  console.log("outcomes saved to db")
}

const markets_path = __dirname + "/markets.json";
const bookmakers_path = __dirname + "/bookmakers.json";
const countries_path = __dirname + "/countries.json";
const leagues_path = __dirname + "/leagues.json";

if (process.env.SEEDTABLES == 1) {
  // saveRules();
  saveMarkets(markets_path);
  saveBookmakers(bookmakers_path);
  saveLeagues(leagues_path);
  saveCountries(countries_path);
  // saveOutcomes() 
}



/*

*/
/*
async function getFixtureById(id) {
  const fixture = await sportmonks.getFixtureById(id);
  fs.writeFileSync(
    __dirname + "/" + id + ".json",
    JSON.stringify(fixture, null, 2)
  );
  return fixture;
}

//getFixtureById(18164497);

Market.bulkCreate(active_markets, {
  updateOnDuplicate: ["category", "active"]
}).then(res => {
  //console.log(res)
});


const rulemaps = require("./rulemaps.json");

//RuleMap.bulkCreate(rulemaps);

const rules = require("./rules.json");

Rule.bulkCreate(rules);


Fixture.findOne({
  where: {  },
  include: ["home_history", "away_history"],
  logging: x => fs.writeFileSync("testmanytomany.sql", x)
}).then(x => {
  //console.log("LIVE DEMO ", x.toJSON());
});
/*
async function updateCountries () {
  for (var country_id in countries) {
    console.log('Updateing country', country_id)
    var country = countries[country_id]
    var iso = country.extra
      ? country.extra.iso2.toLowerCase()
      : country.name.toLowerCase()
    await Fixture.update(
      { iso, country: country.name },
      { where: { country_id } }
    )
  }
}*/

/*

async function saveLeagues(leagues_json_path) {
  console.log("SAVING LEAGUES");
  const leagues = await api.getLeagues();
  const obj = {};
  leagues.forEach(league => {
    obj[league.id] = league;
  });

  await League.bulkCreate(leagues);
  fs.writeFileSync(leagues_json_path, JSON.stringify(obj, null, 2));
}

if (
  !fs.existsSync(leagues_json_path) ||
  process.env.DOMAIN == "dashboard.footyamigo.com"
) {
  saveLeagues(leagues_json_path);
}
if (
  !fs.existsSync(countries_json_path) ||
  process.env.DOMAIN == "dashboard.footyamigo.com"
) {
  saveCountries(countries_json_path);
}

*/

/*
if (
  !fs.existsSync(markets_path) ||
  process.env.DOMAIN == "dashboard.footyamigo.com"
) {
  console.log("Saving Markets")
  saveMarkets(markets_path);
  saveBookmakers(bookmakers_path);
}
else {
  console.log("Markets already saved")
}&*/
