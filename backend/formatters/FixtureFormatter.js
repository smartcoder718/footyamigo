// const inplayOddsMap = require("./json/in-play-odds-map.json");
// const preOddsMap = require("./json/pre-odds-map.json");
const markets = require("./json/markets.json");

const status_names = {
  NS: "Not Started",
  LIVE: "Live",
  HT: "Half-Time",
  FT: "Full-Time",
  ET: "Extra-Time",
  PEN_LIVE: "Penalty Shootout",
  AET: "Finished after extra time",
  BREAK: "Regular time finished",
  FT_PEN: "Full-Time after penalties",
  CANCL: "Canceled",
  POSTP: "PostPoned",
  INT: "Interrupted",
  ABAN: "Abandoned",
  SUSP: "Suspended",
  TBA: "To Be Announced",
  AWARDED: "Awarded",
  DELAYED: "Delayed",
  WO: "Walk Over",
  AU: "Awaiting Updates",
  Deleted: "Deleted"
};

function getAvg(array) {
  var sum = 0;
  array.forEach(value => {
    sum += Number(value);
  });
  return Math.round((sum / array.length || 0) * 100) / 100;
}

function formatStat(stat, location) {
  const {
    team_id,
    fixture_id,
    fouls,
    corners,
    offsides,
    possessiontime: possession,
    yellowcards,
    redcards,
    yellowredcards,
    saves,
    substitutions,
    goal_kick,
    goal_attempts,
    free_kick,
    throw_in,
    ball_safe,
    goals,
    penalties,
    injuries,
    tackles
  } = stat;

  const {
    total: passes,
    accurate: passes_accurate,
    percentage: passes_percentage
  } = stat.passes || {};

  const {
    ongoal: shots_on_target,
    offgoal: shots_off_target,
    total: shots,
    blocked: shots_blocked,
    insidebox: shots_inside_box,
    outsidebox: shots_outside_box
  } = stat.shots || {};

  const { attacks, dangerous_attacks } = stat.attacks || {};

  const result = {
    team_id,
    fixture_id,
    location,
    shots,
    shots_on_target,
    shots_off_target,
    shots_inside_box,
    shots_outside_box,
    shots_blocked,
    passes,
    passes_accurate,
    passes_percentage,
    attacks,
    dangerous_attacks,
    fouls,
    corners,
    offsides,
    possession,
    yellowcards,
    redcards,
    yellowredcards,
    saves,
    substitutions,
    goal_kick,
    goal_attempts,
    free_kick,
    throw_in,
    ball_safe,
    goals,
    penalties,
    injuries,
    tackles
  };
  return result;
}
function formatStats(fixture) {
  const stats = Object.assign(
    {},
    ...fixture.stats.data.map(stat => {
      const location = fixture.localteam_id == stat.team_id ? "home" : "away";
      return {
        [location + "_stat"]: formatStat(stat, location)
      };
    })
  );
  return stats;

}

function formatStatOld(stat) {
  if (!stat) {
    return {};
  }
  let {
    goals,
    corners,
    possessiontime: possession,
    redcards,
    yellowcards,
    penalties,
    substitutions
  } = stat;

  let stat_shots = stat.shots || {};
  let {
    ongoal: shots_on_target,
    offgoal: shots_off_target,
    total: shots
  } = stat_shots;

  let stat_attacks = stat.attacks || {};
  let { attacks, dangerous_attacks: dangerous_attacks } = stat_attacks;

  let result = {
    goals,
    corners,
    possession,
    redcards,
    yellowcards,
    penalties,
    substitutions,
    shots_on_target,
    shots_off_target,
    shots,
    attacks,
    dangerous_attacks
  };
  return result;
}

function formatLiveStat(fixture, liveodds) {
  let teams = {
    away: {},
    favorite: {},
    favorite_playing_away: {},
    favorite_playing_home: {},
    home: {},
    losing_team: {},
    underdog: {},
    underdog_playing_away: {},
    underdog_playing_home: {},
    winning_team: {}
  };
  let stats = [
    "goals",
    "corners",
    "possession",
    "redcards",
    "yellowcards",
    "penalties",
    "substitutions",
    "shots_on_target",
    "shots_off_target",
    "shots",
    "attacks",
    "dangerous_attacks",
    "league_position"
  ];

  let home_stat = formatStat(fixture.stats.data[0]);
  let away_stat = formatStat(fixture.stats.data[1]);
  home_stat["league_position"] = fixture.standings.localteam_position;
  away_stat["league_position"] = fixture.standings.visitorteam_position;

  let {
    season_id,
    id: fixture_id,
    localteam_id: home_id,
    visitorteam_id: away_id
  } = fixture;
  teams.home = home_stat;
  teams.away = away_stat;
  if (home_stat.goals > away_stat.goals) {
    teams.winning_team = teams.home;
    teams.losing_team = teams.away;
  } else if (home_stat.goals < away_stat.goals) {
    teams.winning_team = teams.away;
    teams.losing_team = teams.home;
  }
  if (liveodds) {
    if (liveodds.home_win > liveodds.away_win) {
      teams.underdog = teams.home;
      teams.underdog_playing_home = teams.home;
      teams.favorite = teams.away;
      teams.favorite_playing_away = teams.away;
    } else {
      teams.underdog = teams.away;
      teams.underdog_playing_away = teams.away;
      teams.favorite = teams.home;
      teams.favorite_playing_home = teams.home;
    }
  }

  let timer = fixture.time.minute;

  let result = {
    timer,
    season_id,
    fixture_id,
    home_id,
    away_id
  };
  for (let team in teams) {
    for (let stat of stats) {
      result[stat + "_" + team] = teams[team][stat];
    }
  }

  return result;
}
function formatPeakOdd(fixture) {
  const liveodd = formatLiveOdd(fixture);
  if (liveodd) {
    return {
      ...liveodd,
      type: "peakodds"
    };
  }
}

function formatLiveOdd(fixture) {

  try {
    let inplayOdds = fixture.inplayOdds.data;
    let {
      season_id,
      id: fixture_id,
      localteam_id: home_id,
      visitorteam_id: away_id
    } = fixture;

    let data = {};
    let timer = fixture.time.minute;

    inplayOdds.map(market => {
      let { market_id } = market;
      let name = (markets[market_id] || market_id) + "";
      name = name.replace("Alternative ", "");
      if (!(name in data)) {
        data[name] = {};
      }
      if (name.includes("Double Chance")) {
        let obj = {
          "Home or Draw": market.values[0].value,
          "Draw or Away": market.values[1].value,
          "Home or Away": market.values[2].value
        };
        data[name] = obj;
      } else {
        market.values.map(odd => {
          let { team, value, info, description } = odd;
          let label = team || description || info;
          let substrings = ["over", "under", "exactly"];
          if (!description) {
            description = "";
          }
          description = description.toLowerCase();
          if (
            !team &&
            description &&
            substrings.some(description.includes.bind(description))
          ) {
            label = info;
          }

          data[name][label] = value;
        });
      }
    });

    let result = {
      season_id,
      fixture_id,
      home_id,
      away_id,

      type: "liveodds"
    };

    for (let key in inplayOddsMap) {
      let { market, info } = inplayOddsMap[key];
      result[key] = data[market] ? data[market][info] : null;
    }
    //console.log(result,fixture.inplayOdds.data)
    let {
      ht_score,
      localteam_score: home_goals,
      visitorteam_score: away_goals
    } = fixture.scores;
    //let has_ht = /\d+-\d+/.test(ht_score)
    let key_with_teams = ["ft_result", "ht_result", "dnb"];
    key_with_teams.forEach(key => {
      if (result[key + "_home"] > result[key + "_away"]) {
        result[key + "_underdog"] = result[key + "_home"];
        result[key + "_underdog_playing_home"] = result[key + "_home"];
        result[key + "_favorite"] = result[key + "_away"];
        result[key + "_favorite_playing_away"] = result[key + "_away"];
      } else {
        result[key + "_underdog"] = result[key + "_away"];
        result[key + "_underdog_playing_away"] = result[key + "_away"];
        result[key + "_favorite"] = result[key + "_home"];
        result[key + "_favorite_playing_home"] = result[key + "_home"];
      }
      if (home_goals > away_goals) {
        result[key + "_winning_team"] = result[key + "_home"];
        result[key + "_losing_team"] = result[key + "_away"];
      } else {
        result[key + "_winning_team"] = result[key + "_away"];
        result[key + "_losing_team"] = result[key + "_home"];
      }
    });

    return result;
  } catch (error) {
    return null;
  }
}

function formatPreOdd(fixture) {
  let preOdds = fixture.odds.data;
  let {
    season_id,
    id: fixture_id,
    localteam_id: home_id,
    visitorteam_id: away_id
  } = fixture;

  let data = {};

  preOdds.map(market => {
    let { name } = market;
    name = name.replace("Alternative ", "");
    if (!(name in data)) {
      data[name] = {};
    }

    let bet365 = market.bookmaker.data.filter(x => x.name == "bet365")[0];
    if (bet365) {
      if (name.includes("Double Chance")) {
        let obj = {
          "Home or Draw": bet365.odds.data[0].value,
          "Draw or Away": bet365.odds.data[1].value,
          "Home or Away": bet365.odds.data[2].value
        };
        data[name] = obj;
      } else {
        bet365.odds.data.map(odd => {
          let { label, value, total, extra, probability } = odd;
          if (total) {
            label += " " + total;
          }
          if (!label) {
            label = extra || probability;
          }

          data[name][label] = value;
        });
      }
    }
  });
  let result = {
    season_id,
    fixture_id,
    home_id,
    away_id,
    type: "preodds"
  };

  for (let key in preOddsMap) {
    let { market, info } = preOddsMap[key];
    result[key] = data[market] ? data[market][info] : null;
  }
  let {
    ht_score,
    localteam_score: home_goals,
    visitorteam_score: away_goals
  } = fixture.scores;
  //let has_ht = /\d+-\d+/.test(ht_score)

  let key_with_teams = ["ft_result", "ht_result", "dnb"];
  key_with_teams.forEach(key => {
    if (result[key + "_home"] > result[key + "_away"]) {
      result[key + "_underdog"] = result[key + "_home"];
      result[key + "_underdog_playing_home"] = result[key + "_home"];
      result[key + "_favorite"] = result[key + "_away"];
      result[key + "_favorite_playing_away"] = result[key + "_away"];
    } else {
      result[key + "_underdog"] = result[key + "_away"];
      result[key + "_underdog_playing_away"] = result[key + "_away"];
      result[key + "_favorite"] = result[key + "_home"];
      result[key + "_favorite_playing_home"] = result[key + "_home"];
    }
    if (home_goals > away_goals) {
      result[key + "_winning_team"] = result[key + "_home"];
      result[key + "_losing_team"] = result[key + "_away"];
    } else {
      result[key + "_winning_team"] = result[key + "_away"];
      result[key + "_losing_team"] = result[key + "_home"];
    }
  });

  return result;
}

function formatInfo(fixture) {
  var {
    id,
    league_id,
    season_id,
    stage_id,
    round_id,
    group_id,
    aggregate_id,
    venue_id,
    referee_id,
    localteam_id: home_id,
    visitorteam_id: away_id,
    winner_team_id: winner_id
  } = fixture;
  var home_name = fixture.localTeam.data.name;
  var away_name = fixture.visitorTeam.data.name;
  var home_logo = fixture.localTeam.data.logo_path;
  var away_logo = fixture.visitorTeam.data.logo_path;
  var home_formation = fixture.formations.localteam_formation;
  var away_formation = fixture.formations.visitorteam_formation;
  var weather = fixture.weather_report;
  var status = fixture.time.status;
  var status_words = status_names[status] || status;
  var { minute, extra_minute, second, added_time, injury_time } = fixture.time;
  const { date_time, date, time, timestamp } = fixture.time.starting_at;
  var fixture_name = home_name + " v " + away_name;
  var { country_id, name: league_name } = fixture.league.data;

  var {
    localteam_position: home_position,
    visitorteam_position: away_position
  } = fixture.standings;

  return {
    fixture_name,
    id,
    league_id,
    season_id,
    stage_id,
    round_id,
    group_id,
    aggregate_id,
    venue_id,
    country_id,
    referee_id,
    home_id,
    away_id,
    home_position,
    away_position,
    winner_id,

    //league_name,
    home_name,
    away_name,
    home_logo,
    away_logo,
    home_formation,
    away_formation,
    weather,
    status,
    status_words,
    minute,
    extra_minute,
    second,
    added_time,
    injury_time,
    date_time,
    date,
    time,
    timestamp
  };
}

function formatProbability(fixture) {
  // var probability = fixture.probability;
  // var has_probability = false;
  // if (probability) {
  //   probability = probability.data.predictions;
  //   has_probability = true;
  // } else {
  //   probability = {};
  // }
  try {
    const {
      home: home_win_probability,
      draw: draw_probability,
      away: away_win_probability,
      btts: btts_probability,
      over_2_5: o25_goals_probability,
      under_2_5: u25_goals_probability,
      over_3_5: o35_goals_probability,
      under_3_5: u35_goals_probability,
      HT_over_0_5: home_goals_o05_probability,
      HT_under_0_5: home_goals_uo5_probability,
      AT_over_0_5: away_goals_o05_probability,
      AT_under_0_5: away_goals_uo5_probability,
      HT_over_1_5: home_goals_o15_probability,
      HT_under_1_5: home_goals_u15_probability,
      AT_over_1_5: away_goals_o15_probability,
      AT_under_1_5: away_goals_u15_probability
    } = fixture.probability.data.predictions;
    return {
      fixture_id: fixture.id,
      home_win_probability,
      draw_probability,
      away_win_probability,
      btts_probability,
      o25_goals_probability,
      u25_goals_probability,
      o35_goals_probability,
      u35_goals_probability,
      home_goals_o05_probability,
      home_goals_uo5_probability,
      away_goals_o05_probability,
      away_goals_uo5_probability,
      home_goals_o15_probability,
      home_goals_u15_probability,
      away_goals_o15_probability,
      away_goals_u15_probability
    };
  } catch (error) {
    console.log("NO PROBABILITY " + fixture.id);
    return {};
  }
}

function formatGoals(fixture) {
  var home_goals = 0;
  var home_goals_1h = 0;
  var home_goals_2h = 0;
  var goal_timings_home = [];
  var goal_timings_away = [];
  var goal_timings_all = [];
  var away_goals = 0;
  var away_goals_1h = 0;
  var away_goals_2h = 0;

  fixture.goals.data.forEach(goal => {
    if (goal.team_id == fixture.localteam_id) {
      //home_goals++
      if (goal.minute <= 45) {
        home_goals_1h++;
      } else {
        home_goals_2h++;
      }
      goal_timings_home.push(goal.minute);
    } else {
      //away_goals++
      if (goal.minute <= 45) {
        away_goals_1h++;
      } else {
        away_goals_2h++;
      }
      goal_timings_away.push(goal.minute);
    }
    goal_timings_all.push(goal.minute);
  });
  var {
    ht_score,
    ft_score,
    et_score,
    ps_score,
    localteam_score: home_goals,
    visitorteam_score: away_goals
  } = fixture.scores;
  var has_ht = /\d+-\d+/.test(ht_score);
  if (has_ht && !home_goals_1h && !away_goals_1h) {
    [home_goals_1h, away_goals_1h] = ht_score.split("-");
    home_goals_1h = parseInt(home_goals_1h);
    away_goals_1h = parseInt(away_goals_1h);
  }
  var goals = home_goals + away_goals;
  var goals_1h = home_goals_1h + away_goals_1h;
  var goals_2h = home_goals_2h + away_goals_2h;
  var home_win = home_goals > away_goals;
  var away_win = home_goals < away_goals;
  var draw = home_goals == away_goals;
  var home_win_ht = home_goals_1h > away_goals_1h;
  var away_win_ht = home_goals_1h < away_goals_1h;
  var draw_ht = home_goals_1h == away_goals_1h;

  var no_home_goals = home_goals == 0;
  var no_away_goals = away_goals == 0;
  var no_goals = goals == 0;
  var no_goals_1h = goals_1h == 0;
  var no_goals_2h = goals_2h == 0;
  var btts = (home_goals && away_goals) != 0;
  var btts_1h = (home_goals_1h && away_goals_1h) != 0;
  var btts_2h = (home_goals_2h && away_goals_2h) != 0;
  var btts_or_o25 = btts || goals > 2;
  var btts_o25 = btts && goals > 2;
  var home_points = home_win ? 3 : draw ? 1 : 0;
  var away_points = away_win ? 3 : draw ? 1 : 0;
  var home_scored_first = fixture.goals.data.length
    ? fixture.goals.data[0].team_id == fixture.localteam_id
    : false;
  var away_scored_first = !home_scored_first;
  var home_fts = home_goals == 0;
  var away_fts = away_goals == 0;
  var home_clean_sheets = away_goals == 0;
  var away_clean_sheets = home_goals == 0;
  var home_goal_difference = home_goals - away_goals;
  var away_goal_difference = -home_goal_difference;

  return {
    played: 1,
    home_goals,
    home_goals_1h,
    home_goals_2h,
    away_goals,
    away_goals_1h,
    away_goals_2h,
    goals,
    goals_1h,
    goals_2h,
    goal_timings_home,
    goal_timings_away,
    goal_timings_all,
    home_win,
    away_win,
    draw,
    home_win_ht,
    away_win_ht,
    draw_ht,
    no_home_goals,
    no_away_goals,
    no_goals,
    no_goals_1h,
    no_goals_2h,
    btts,
    btts_1h,
    btts_2h,
    btts_or_o25,
    btts_o25,
    home_points,
    away_points,
    home_scored_first,
    away_scored_first,
    home_fts,
    away_fts,
    home_clean_sheets,
    away_clean_sheets,
    home_goal_difference,
    away_goal_difference,
    ht_score,
    ft_score,
    et_score,
    ps_score
  };
}

function formatCards(fixture, has_card_timings) {
  if (!has_card_timings) {
    return {};
  }
  var home_cards = 0;
  var home_yellow_cards = 0;
  var home_red_cards = 0;
  var home_cards_1h = 0;
  var home_cards_2h = 0;
  var away_yellow_cards = 0;
  var away_red_cards = 0;
  var away_cards = 0;
  var away_cards_1h = 0;
  var away_cards_2h = 0;
  fixture.cards.data.forEach(card => {
    var val = card.type == "redcard" ? 2 : 1;
    if (card.team_id == fixture.localteam_id) {
      home_cards += val;
      if (card.type == "redcard") {
        home_red_cards += 1;
      } else {
        home_yellow_cards += 1;
      }
      if (card.minute <= 45) {
        home_cards_1h += val;
      } else {
        home_cards_2h += val;
      }
    } else {
      away_cards += val;
      if (card.type == "redcard") {
        away_red_cards += 1;
      } else {
        away_yellow_cards += 1;
      }
      if (card.minute <= 45) {
        away_cards_1h += val;
      } else {
        away_cards_2h += val;
      }
    }
  });
  var cards = home_cards + away_cards;
  var cards_1h = home_cards_1h + away_cards_1h;
  var cards_2h = home_cards_2h + away_cards_2h;
  var no_cards = cards == 0;

  return {
    home_cards,
    home_cards_1h,
    home_cards_2h,
    home_yellow_cards,
    home_red_cards,
    away_yellow_cards,
    away_red_cards,
    away_cards,
    away_cards_1h,
    away_cards_2h,
    cards,
    cards_1h,
    cards_2h,
    no_cards
  };
}

function formatCorners(fixture, has_corner_timings) {
  if (!has_corner_timings) {
    return {};
  }
  var home_corners = 0;
  var home_corners_1h = 0;
  var home_corners_2h = 0;
  var corner_timings_home = [];
  var corner_timings_away = [];
  var corner_timings_all = [];
  var away_corners = 0;
  var away_corners_1h = 0;
  var away_corners_2h = 0;
  fixture.corners.data.forEach(corner => {
    if (corner.comment.includes("Race to")) {
      return;
    }
    if (corner.team_id == fixture.localteam_id) {
      home_corners++;
      if (corner.minute <= 45) {
        home_corners_1h++;
      } else {
        home_corners_2h++;
      }
      corner_timings_home.push(corner.minute);
    } else {
      away_corners++;
      if (corner.minute <= 45) {
        away_corners_1h++;
      } else {
        away_corners_2h++;
      }
      corner_timings_away.push(corner.minute);
    }
    corner_timings_all.push(corner.minute);
  });
  var ht_corner;
  var ft_corner;
  if (fixture.time.minute >= 45) {
    ht_corner = home_corners_1h + "-" + away_corners_1h;
  }
  if (fixture.time.minute >= 90) {
    ft_corner = home_corners + "-" + away_corners;
  }

  var corners_1h = home_corners_1h + away_corners_1h;
  var corners_2h = home_corners_2h + away_corners_2h;
  var corners = home_corners + away_corners;
  var corners_1h = home_corners_1h + away_corners_1h;
  var corners_2h = home_corners_2h + away_corners_2h;
  var no_corners = corners == 0;
  return {
    ht_corner,
    ft_corner,
    home_corners,
    home_corners_1h,
    home_corners_2h,
    away_corners,
    away_corners_1h,
    away_corners_2h,
    corner_timings_home,
    corner_timings_away,
    corner_timings_all,
    corners_1h,
    corners_2h,
    corners,
    no_corners
  };
}

function formatGoalTimings(
  { goal_timings_all, goal_timings_home, goal_timings_away },
  has_goal_timings
) {
  if (!has_goal_timings) {
    return null;
  }
  var goals_between_35_45 =
    goal_timings_all.filter(x => x >= 35 && x <= 45).length > 0;
  var goals_between_40_45 =
    goal_timings_all.filter(x => x >= 40 && x <= 45).length > 0;
  var goals_between_80_90 =
    goal_timings_all.filter(x => x >= 80 && x <= 90).length > 0;
  var goals_between_75_90 =
    goal_timings_all.filter(x => x >= 75 && x <= 90).length > 0;
  var goals_between_85_90 =
    goal_timings_all.filter(x => x >= 85 && x <= 90).length > 0;
  var goals_between_0_15 = goal_timings_all.filter(x => x <= 15).length > 0;
  var goals_between_0_10 = goal_timings_all.filter(x => x <= 10).length > 0;
  var goals_between_0_15_home =
    goal_timings_home.filter(x => x <= 15).length > 0;
  var goals_between_0_15_away =
    goal_timings_away.filter(x => x <= 15).length > 0;
  var goals_after_70 = goal_timings_all.filter(x => x > 70).length > 0;
  var home_goals_after_70 = goal_timings_home.filter(x => x > 70).length > 0;
  var away_goals_after_70 = goal_timings_away.filter(x => x > 70).length > 0;
  var first_total_goal = goal_timings_all[0];
  var first_home_goal = goal_timings_home[0];
  var first_away_goal = goal_timings_away[0];
  var goal_timings_mean = getAvg(goal_timings_all);
  return {
    goals_between_85_90,
    goals_between_75_90,
    goals_between_35_45,
    goals_between_80_90,
    goals_between_40_45,
    goals_between_0_15,
    goals_between_0_10,
    goals_between_0_15_home,
    goals_between_0_15_away,
    goals_after_70,
    home_goals_after_70,
    away_goals_after_70,
    first_total_goal,
    first_home_goal,
    first_away_goal,
    goal_timings_mean
  };
}

function formatCornerTimings(
  { corner_timings_all, corner_timings_home, corner_timings_away },
  has_corner_timings
) {
  if (!has_corner_timings) {
    return null;
  }
  var corners_between_35_45 =
    corner_timings_all.filter(x => x >= 35 && x <= 45).length > 0;
  var corners_between_40_45 =
    corner_timings_all.filter(x => x >= 40 && x <= 45).length > 0;
  var corners_between_80_90 =
    corner_timings_all.filter(x => x >= 80 && x <= 90).length > 0;
  var corners_between_75_90 =
    corner_timings_all.filter(x => x >= 75 && x <= 90).length > 0;
  var corners_between_85_90 =
    corner_timings_all.filter(x => x >= 85 && x <= 90).length > 0;
  var corners_between_0_15 = corner_timings_all.filter(x => x <= 15).length > 0;
  var corners_between_0_10 = corner_timings_all.filter(x => x <= 10).length > 0;
  var corners_between_0_10_home =
    corner_timings_home.filter(x => x <= 10).length > 0;
  var corners_between_0_10_away =
    corner_timings_away.filter(x => x <= 10).length > 0;
  var first_total_corner = corner_timings_all[0];
  var first_home_corner = corner_timings_home[0];
  var first_away_corner = corner_timings_away[0];
  var corner_timings_mean = getAvg(corner_timings_all);
  return {
    corners_between_85_90,
    corners_between_0_15,
    corners_between_35_45,
    corners_between_75_90,
    corners_between_40_45,
    corners_between_80_90,
    corners_between_0_10,
    corners_between_0_10_home,
    corners_between_0_10_away,
    first_total_corner,
    first_home_corner,
    first_away_corner,
    corner_timings_mean
  };
}

function formatOverStats(
  { cardsData, goalsData, cornersData },
  { has_card_timings, has_corner_timings }
) {
  var upload = {};
  var {
    home_cards,
    home_cards_1h,
    home_cards_2h,
    away_cards,
    away_cards_1h,
    away_cards_2h,
    cards,
    cards_1h,
    cards_2h,
    home_yellow_cards,
    home_red_cards,
    away_yellow_cards,
    away_red_cards
  } = cardsData;

  var {
    home_goals,
    home_goals_1h,
    home_goals_2h,
    away_goals,
    away_goals_1h,
    away_goals_2h,
    goals,
    goals_1h,
    goals_2h
  } = goalsData;

  var {
    corners,
    corners_1h,
    corners_2h,
    home_corners,
    away_corners,
    home_corners_1h,
    home_corners_2h,
    away_corners_1h,
    away_corners_2h
  } = cornersData;

  for (var i = 0; i < 6; i++) {
    if (true) {
      upload[`o${i}5_goals`] = goals > i ? true : false;
    }
  }
  if (has_card_timings) {
    for (var i = 0; i < 4; i++) {
      upload[`o${i}5_home_cards`] = home_cards > i ? true : false;
      upload[`o${i}5_away_cards`] = away_cards > i ? true : false;
    }
  }
  if (true) {
    for (var i = 0; i < 3; i++) {
      upload[`o${i}5_home_goals`] = home_goals > i ? true : false;
      upload[`o${i}5_away_goals`] = away_goals > i ? true : false;
    }
  }

  for (var i = 0; i < 2; i++) {
    if (true) {
      upload[`o${i}5_1h_goals`] = goals_1h > i ? true : false;
      upload[`o${i}5_2h_goals`] = goals_2h > i ? true : false;
      upload[`o${i}5_1h_home_goals`] = home_goals_1h > i ? true : false;
      upload[`o${i}5_2h_home_goals`] = home_goals_2h > i ? true : false;
      upload[`o${i}5_1h_away_goals`] = away_goals_1h > i ? true : false;
      upload[`o${i}5_2h_away_goals`] = away_goals_2h > i ? true : false;
    }
    if (has_card_timings) {
      upload[`o${i}5_1h_home_cards`] = home_cards_1h > i ? true : false;
      upload[`o${i}5_1h_away_cards`] = away_cards_1h > i ? true : false;
      upload[`o${i}5_2h_home_cards`] = home_cards_2h > i ? true : false;
      upload[`o${i}5_2h_away_cards`] = away_cards_2h > i ? true : false;
    }
  }
  if (has_card_timings) {
    for (var i = 0; i < 3; i++) {
      upload[`o${i}5_home_yellow_cards`] = home_yellow_cards > i ? true : false;
      upload[`o${i}5_home_red_cards`] = home_red_cards > i ? true : false;
      upload[`o${i}5_away_yellow_cards`] = away_yellow_cards > i ? true : false;
      upload[`o${i}5_away_red_cards`] = away_red_cards > i ? true : false;
      upload[`o${i}5_1h_cards`] = cards_1h > i ? true : false;
      upload[`o${i}5_2h_cards`] = cards_2h > i ? true : false;
    }
  }
  if (has_corner_timings) {
    for (var i = 5; i < 13; i++) {
      upload[`o${i}5_corners`] = corners > i ? true : false;
    }
    for (var i = 0; i < 6; i++) {
      upload[`o${i}5_1h_corners`] = corners_1h > i ? true : false;
    }
    for (var i = 0; i < 6; i++) {
      upload[`o${i}5_2h_corners`] = corners_2h > i ? true : false;
    }
    for (var i = 2; i < 8; i++) {
      upload[`o${i}5_home_corners`] = home_corners > i ? true : false;
      upload[`o${i}5_away_corners`] = away_corners > i ? true : false;
    }
    for (var i = 1; i < 5; i++) {
      upload[`o${i}5_1h_home_corners`] = home_corners_1h > i ? true : false;
      upload[`o${i}5_1h_away_corners`] = away_corners_1h > i ? true : false;
      upload[`o${i}5_2h_home_corners`] = home_corners_2h > i ? true : false;
      upload[`o${i}5_2h_away_corners`] = away_corners_2h > i ? true : false;
    }
  }
  if (has_card_timings) {
    for (var i = 2; i < 7; i++) {
      upload[`o${i}5_cards`] = cards > i ? true : false;
    }
  }

  return upload;
}
function formatFixture(fixture) {
  var basicInfo = formatInfo(fixture);
  var goalsData = formatGoals(fixture);
  let goals = fixture.goals.data;
  let corners = fixture.corners.data;
  let cards = fixture.cards.data;
  let stats = fixture.stats.data;
  var has_corner_timings = true,
    has_goal_timings = true,
    has_card_timings = true;
  if (!stats.length) {
    has_corner_timings = corners.length ? true : false;
    has_goal_timings = goals.length ? true : false;
    has_card_timings = cards.length ? true : false;
  } else if (stats.length == 2) {
    let {
      corners: home_corners,
      offsides: home_offsides,
      goals: home_goals,
      yellowcards: home_yellow_cards,
      redcards: home_red_cards
    } = stats[0];
    let home_cards = home_yellow_cards + home_red_cards;
    let {
      corners: away_corners,
      offsides: away_offsides,
      goals: away_goals,
      yellowcards: yellowaway_cards,
      redcards: redaway_cards
    } = stats[1];
    let away_cards = yellowaway_cards + redaway_cards;
    let offsides = away_offsides + home_offsides;
    basicInfo = {
      ...basicInfo
    };
    goalsData = { ...goalsData, home_offsides, away_offsides, offsides };
    has_corner_timings =
      corners.length || (home_corners == 0 && away_corners == 0) ? true : false;
    has_goal_timings =
      goals.length || (home_goals == 0 && away_goals == 0) ? true : false;
    has_card_timings =
      cards.length || (home_cards == 0 && away_cards == 0) ? true : false;
  }
  //var timeData = formatTime(fixture);
  var probability = formatProbability(fixture);

  var cornersData = formatCorners(fixture, has_corner_timings);
  var cardsData = formatCards(fixture, has_card_timings);
  var goalTimingsData = formatGoalTimings(goalsData, has_goal_timings);
  var cornersTimingsData = formatCornerTimings(cornersData, has_corner_timings);
  var overData = formatOverStats(
    { cardsData, goalsData, cornersData },
    { has_card_timings, has_goal_timings, has_corner_timings }
  );
  //console.log(formatPreOdd(fixture));
  const liveodds = formatLiveOdd(fixture);
  const preodds = formatPreOdd(fixture);
  const peakodds = formatPeakOdd(fixture);
  const results = formatStats(fixture);
  const result = {
    ...goalsData,
    ...cornersData,
    ...cardsData,
    ...goalTimingsData,
    ...cornersTimingsData,
    ...overData,
    fixture_id: fixture.id
  };
  //console.log("STAT", formatStats(fixture));
  const { home_stat, away_stat } = results;
  const fixture_data = {
    ...basicInfo,
    id: fixture.id
  };

  const data = {
    fixture: fixture_data,
    probability,
    result,
    liveodds,
    preodds,
    peakodds,
    home_stat,
    away_stat
  };

  return data;
}

/*
function parseStat(stat) {
  let {
    goals,
    corners,
    possessiontime: possession,
    redcards,
    yellowcards,
    penalties,
    substitutions,
  } = stat;

  let stat_shots = stat.shots || {};
  let {
    ongoal: shots_on_target,
    offgoal: shots_off_target,
    total: shots,
  } = stat_shots;

  let stat_attacks = stat.attacks || {};
  let { attacks, dangerous_attacks } = stat_attacks;

  let result = {
    goals,
    corners,
    possession,
    redcards,
    yellowcards,
    penalties,
    substitutions,
    shots_on_target,
    shots_off_target,
    shots,
    attacks,
    dangerous_attacks,
  };
  return result;
}

function parseFixture(fixture) {
  let teams = {
    away: {},
    favorite: {},
    favorite_playing_away: {},
    favorite_playing_home: {},
    home: {},
    losing_team: {},
    underdog: {},
    underdog_playing_away: {},
    underdog_playing_home: {},
    winning_team: {},
  };
  let stats = [
    "goals",
    "corners",
    "possession",
    "redcards",
    "yellowcards",
    "penalties",
    "substitutions",
    "shots_on_target",
    "shots_off_target",
    "shots",
    "attacks",
    "dangerous_attacks",
    "league_position",
  ];

  let home_stat = this.parseStat(fixture.stats.data[0]);
  let away_stat = this.parseStat(fixture.stats.data[1]);
  home_stat["league_position"] = fixture.standings.localteam_position;
  away_stat["league_position"] = fixture.standings.visitorteam_position;
  let home_id = fixture.localteam_id;
  let away_id = fixture.visitorteam_id;
  teams.home = home_stat;
  teams.away = away_stat;
  if (home_stat.goals > away_stat.goals) {
    teams.winning_team = teams.home;
    teams.losing_team = teams.away;
  } else if (home_stat.goals < away_stat.goals) {
    teams.winning_team = teams.away;
    teams.losing_team = teams.home;
  }
  if (fixture.underdog == "home") {
    teams.underdog = teams.home;
    teams.underdog_playing_home = teams.home;
    teams.favorite = teams.away;
    teams.favorite_playing_away = teams.away;
  } else if (fixture.underdog == "away") {
    teams.underdog = teams.away;
    teams.underdog_playing_away = teams.away;
    teams.favorite = teams.home;
    teams.favorite_playing_home = teams.home;
  }

  let timer = fixture.time.minute;
  let { season_id, id: fixture_id } = fixture;

  let result = {
    timer,
    season_id,
    fixture_id,
    home_id,
    away_id,
  };
  for (let team in teams) {
    for (let stat of stats) {
      result[team + "_" + stat] = teams[team][stat];
    }
  }

  return result;
}*/

module.exports = {
  formatFixture
};
