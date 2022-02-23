let axios = require("axios");
const fs = require("fs");
let moment = require("moment");
let fixture_includes = [
  "goals",
  "cards",
  "corners",
  "stats",
  "probability",
  "localTeam",
  "visitorTeam",
  "inPlayOdds",
  "odds",
  "league.country",
  "events"
];
class Sportmonks {
  constructor() {
    let api_token = process.env.SPORTMONKSAPI;
    let api = axios.create({
      params: {
        api_token,
        per_page: 150
      },
      baseURL: "https://soccer.sportmonks.com/api/v2.0"
    });
    this.api = api;
  }
  //Get fixture by Id
  async getFixtureById(fixture_id) {
    let url = "/fixtures/" + fixture_id;

    let include = fixture_includes.join(",");
    let params = { include };
    let { data: response } = await this.api.get(url, { params });
    return response["data"];
  }

  //Get fixture by Id
  async getFixtureByIds(ids, includes = fixture_includes) {
    let result = [];
    while (ids.length) {
      let ids_50 = ids.splice(0, 50);
      let url = "/fixtures/multi/" + ids_50.join(",");
      let include = includes.join(",");
      let params = { include };
      let { data: response } = await this.api.get(url, { params });
      result.push(...response["data"]);
    }
    return result;
  }

  async getTeamById(team_id, season_id) {
    let url = "/teams/" + team_id;
    let includes = [];
    for (let team of ["visitorResults", "localResults"]) {
      for (let stat of [
        "goals",
        "cards",
        "corners",
        "stats",
        "probability",
        "localTeam",
        "visitorTeam",
        "odds",
        "league"
      ]) {
        includes.push(team + "." + stat);
      }
    }
    let include = includes.join(",");
    let seasons = season_id;
    let params = { include, seasons };
    let { data: response } = await this.api.get(url, { params });
    return response["data"];
  }

  async getMarkets() {
    let url = "/markets/";
    let { data: response } = await this.api.get(url);
    return response["data"];
  }

  async getBookmakers() {
    let url = "/bookmakers/";
    let { data: response } = await this.api.get(url);
    return response["data"];
  }

  async getHead2Head(home_team_id, away_team_id) {
    let url = `/head2head/${home_team_id}/${away_team_id}`;
    let includes = [
      "localTeam",
      "visitorTeam",
      "goals",
      "cards",
      "corners",
      "events"
    ];
    let params = {};
    params["include"] = includes.join(",");
    let { data: response } = await this.api.get(url, { params });
    return response["data"];
  }

  async getCountries() {
    let url = "/countries";
    return await this.getFullData(url);
  }

  async getFixturesbyDateRangeforTeam() {
    let url = `/fixtures/between/:STARTDATE/:ENDDATE/:TEAM_ID`;
    let includes = [
      "localTeam",
      "visitorTeam",
      "goals",
      "cards",
      "corners",
      "events"
    ];
    let params = {};
    params["include"] = includes.join(",");
    let { data: response } = await this.api.get(url, { params });
    return response["data"];
  }
  async getTeamFixturesMinimal(team_id, season_id) {
    let url = "/teams/" + team_id;
    let includes = [];
    for (let team of ["visitorResults", "localResults"]) {
      for (let stat of [
        "goals",
        "cards",
        "corners",
        "events",
        "localTeam",
        "visitorTeam"
      ]) {
        includes.push(team + "." + stat);
      }
    }
    let include = includes.join(",");
    let seasons = season_id;
    let params = { include, seasons };
    let { data: response } = await this.api.get(url, { params });
    if (!response["data"]) {
      console.log(response);
      return [];
    }
    let {
      visitorResults: { data: away },
      localResults: { data: home }
    } = response["data"];
    let all = [...home, ...away];
    all.sort(function(a, b) {
      var keyA = a.time.starting_at.timestamp;
      var keyB = b.time.starting_at.timestamp;
      if (keyA < keyB) return 1;
      if (keyA > keyB) return -1;
      return 0;
    });

    return {
      home,
      away,
      all
    };
  }

  async getTeamFixtures(team_id, season_id) {
    let url = "/teams/" + team_id;
    let includes = [];
    for (let team of ["visitorResults", "localResults"]) {
      for (let stat of fixture_includes) {
        includes.push(team + "." + stat);
      }
    }
    let include = includes.join(",");
    let seasons = season_id;
    let params = { include, seasons };
    console.log(include);
    try {
      let { data: response } = await this.api.get(url, { params });
      if (!response["data"]) {
        console.log(response);
        return [];
      }
      return [
        ...response["data"].visitorResults.data,
        ...response["data"].localResults.data
      ];
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getFullData(url, includes = [], season_id = null) {
    let page = 1;
    let include, params, seasons;
    let items = [];

    while (true) {
      include = includes.join(",");
      params = { page, include };
      seasons = season_id;
      var { data: response } = await this.api.get(url, {
        params
      });
      //console.log(response.data.length,"being uploaded")
      //console.log(response.meta)
      items.push(...response.data);
      if (!response.meta.pagination.links.next) {
        return items;
      }
      page++;
    }
  }
  async getFixturesByDate(date) {
    console.log("Uploading fixtures for the date", date);
    let includes = [
      /* "goals",
      "cards",
      "corners",
      "stats",
      "probability",
      "localTeam",
      "visitorTeam",
      "odds",
      "league"*/
    ];
    let url = "/fixtures/date/" + date;
    return await this.getFullData(url, includes);
  }
  async getFixturesToday() {
    console.log("GETTING FIXTURES FOR TODAY");
    return await this.getFixturesByDate(
      moment()
        .utc()
        .format("YYYY-MM-DD")
    );
  }
  async getUpdatedFixtures() {
    console.log("GETTING UPDATED FIXTURES");
    let url = "/fixtures/updates";
    let includes = fixture_includes;
    return await this.getFullData(url, includes);
  }

  async getLeagues() {
    let url = "/leagues";
    const includes = ["country"];
    return await this.getFullData(url, includes);
  }

  async getTeamsPlayingToday() {
    let teams = [];
    let fixtures = await this.getFixturesToday();
    for (var fixture of fixtures) {
      var { localteam_id, visitorteam_id, season_id } = fixture;
      teams.push({ team_id: localteam_id, season_id });
      teams.push({ team_id: visitorteam_id, season_id });
    }
    return teams;
  }
  async getInplayLivescores() {
    let url = "/livescores/now";
    let includes = [
      "goals",
      "cards",
      "corners",
      "stats",
      "probability",
      "localTeam",
      "visitorTeam",
      "inPlayOdds",
      "odds",
      "league"
    ];
    let { data: response } = await this.api.get(url);
    let fixtures = response["data"];
    fixtures = fixtures.filter(fixture => fixture.time.minute != null);
    console.log("TETSING", fixtures.length);
    let ids = fixtures.map(fixture => fixture.id);
    return await this.getFixtureByIds(ids, includes);
  }
}

module.exports = Sportmonks;

//getMarkets()

// const api = new Sportmonks();
// var fixture_id = 16777485;
// api.getFixtureById(fixture_id).then(fixture => {
//   fs.writeFileSync(
//     "./sportmonks_api_samples/" + fixture_id + ".json",
//     JSON.stringify(fixture, null, 2)
//   );
// });

/*
api.getCountries().then(countries => {
  fs.writeFileSync(
    "./sportmonks_api_samples/countries.json",
    JSON.stringify(Object.assign(...{}, countries.map(x=> {
      return {
        [x.id] : countries
      }
    })), null, 2)
  );
  console.log("Countries Saved");
});*/
/*api.getFixtureById(18137626).then(fixture => {
  fs.writeFileSync(
    "./sportmonks_api_samples/18137626.json",
    JSON.stringify(fixture, null, 2)
  );
});*/

// api
//   .getFixturesByDate(
//     moment()
//       .add(30, "day")
//       .utc()
//       .format("YYYY-MM-DD")
//   )
//   .then(fixtures => {
//     try {
//       fs.writeFileSync(
//         "./sportmonks_api_samples/30days.json",
//         JSON.stringify(fixtures, null, 2)
//       );
//     } catch (error) {
//       console.log(error);
//     }
//   });
