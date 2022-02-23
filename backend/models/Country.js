const { Model } = require("objection");
const moment = require("moment");
class Country extends Model {
  // Table name is the only required property.
  static get tableName() {
    return "countries";
  }
  static modifiers = {
    forFixture(query) {
      query.select(
        "countries.name as country_name",
        "countries.id as country_id",
        "countries.iso2 as iso"
      );
    }
  };
  // This object defines the relations to other models.
  static get relationMappings() {
    // Importing models here is a one way to avoid require loops.
    const Fixture = require("./Fixture");
    const League = require("./League");

    return {
      fixtures: {
        relation: Model.HasManyRelation,
        modelClass: Fixture,
        join: {
          from: "countries.id",
          to: "fixtures.country_id"
        }
      },
      leagues: {
        relation: Model.HasManyRelation,
        modelClass: League,
        join: {
          from: "countries.id",
          to: "leagues.country_id"
        }
      }
    };
  }
}

Country.findAll = function() {
  return this.query()
    .withGraphJoined("leagues")
    .orderBy("name");
};

Country.fetchLiveFixtures = async function() {
  const countries = await this.query()
    .withGraphFetched(
      {
        fixtures: {
          probability: true,
          home_stat: true,
          away_stat: true,
          preodds: true,
          liveodds: true,
          peakodds: true,
          $modify: ["liveGames"]
        }
      },
      { joinOperation: "rightJoin" }
    )
    .select("id", "name", "iso2 as iso");
  return Object.assign(
    {},
    ...countries
      .filter(country => country.fixtures.length)
      .map(country => {
        return {
          ...country,

          fixture_ids: country.fixtures.map(f => f.id),
          hidden: false
        };
      })
      .map(country => {
        return {
          [country.id]: country
        };
      })
  );
};

Country.fetchFixtures = async function(date) {
  const startOfDay = moment(date)
    .startOf("day")
    .toDate();
  const endOfDay = moment(date)
    .endOf("day")
    .unix();

  const countries = await this.query()
    .withGraphFetched("fixtures(selectIdOnly, byDate)", {
      joinOperation: "rightJoin"
    })
    .modifiers({
      byDate: query => query.where("date", startOfDay)
    })
    .select("id", "name", "iso2 as iso");
  return Object.assign(
    {},
    ...countries
      .filter(country => country.fixtures.length)
      .map(country => {
        return {
          ...country,
          fixtures: [],
          fixture_ids: country.fixtures.map(f => f.id),
          hidden: true
        };
      })
      .map(country => {
        return {
          [country.id]: country
        };
      })
  );
};

Country.bulkCreate = function(items) {
  items = items.map(item => {
    const {
      id,
      name,
      image_path,
      continent,
      sub_region,
      world_region,
      fifa,
      iso,
      iso2,
      longitude,
      latitude
    } = item;
    return {
      id,
      name,
      image_path,
      continent,
      sub_region,
      world_region,
      fifa,
      iso,
      iso2,
      longitude,
      latitude
    };
  });
  return this.knex()
    .table("countries")
    .insert(items)
    .onConflict("id")
    .merge();
};

module.exports = Country;
