text = {
  title: "Strong Home Teams",
  description: "Home Win Betting Stats",
  conditions: {
    home: {
      $match: {
        "home.played_home": { $gte: 6 },
        "home.won_home_per": { $gte: 75 },
        "pre_odds.home_win": { $gte: 0.01 }
      },
      $sort: {
        "home.won_home_per": -1
      },
      $project: {
        percentage: "$home.won_home_per",
        played: "$home.played_home",
        won: "$home.won_home",
        odds: "$pre_odds.home_win",
        name: "$home_name",
        logo: "$home_logo"
      },
      label: "HOME TEAM WON"
    },
    away: {
      $match: {
        "away.played_away": { $gte: 6 },
        "away.lost_away_per": { $gte: 75 },
        "pre_odds.home_win": { $gte: 0.01 }
      },
      $sort: {
        "away.lost_away_per": -1
      },
      $project: {
        percentage: "$away.lost_away_per",
        played: "$away.played_away",
        won: "$away.lost_away",
        odds: "$pre_odds.home_win",
        name: "$away_name",
        logo: "$away_logo"
      },
      label: "AWAY TEAM LOST"
    }
  }
};

test2 = [
  {
    $match: {
      status: "NS",
      timestamp: { $gte: 1638999225 },
      "pre_odds.home_win": { $gte: 0.01 },
      "home.played_home": 6,
      "home.won_home_per": { $gte: 75 }
    }
  },
  { $sort: { date: 1, "home.won_home_per": 1 } },
  { $limit: 10 },
  {
    $project: {
      timestamp: 1,
      date: 1,
      home_position: 1,
      away_position: 1,
      iso: 1,
      fixture_id: 1,
      played: "$home.played_home",
      odds: "$pre_odds.home_win",
      name: "$home_name",
      logo: "$home_logo"
    }
  }
];
