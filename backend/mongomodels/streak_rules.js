const info = `The first table contains team with upcoming fixtures, ordered by the % of home games they have won this season. The second table contains away teams that have struggled away from home. This table is ordered by the % of away games they have lost. 

You can view the latest odds from Bet365, or click on the team name to view a full odds comparison inside the fixture.
`;
module.exports = {
  home_win: {
    title: "Strong Home Teams",
    description: "Home Win Betting Stats",
    conditions: {
      home: {
        field: "home.won_home",
        label: "Home Team Won",
      },
      away: {
        field: "away.lost_away",
        label: "Away Team Lost",
      },
    },
    info,
  },
  away_win: {
    title: "Strong Away Teams",
    description: "Away Win Betting Stats",
    conditions: {
      home: {
        field: "home.lost_home",
        label: "Home Team Lost",
      },
      away: {
        field: "away.won_away",
        label: "Away Team Won",
      },
    },
    info,
  },
  draw: {
    title: "Draw Teams",
    description: "Draw Betting Stats",
    conditions: {
      home: {
        field: "home.drawn_home",
        label: "Home Team Draw",
      },
      away: {
        field: "away.drawn_away",
        label: "Away Team Draw",
      },
      overall: {
        field: "drawn_overall",
        label: "Overall Team Draw",
      },
    },
    info,
  },
  home_win_ht: {
    title: "Strong Home Win HT Teams",
    description: "Home Win HT Betting Stats",
    conditions: {
      home: {
        field: "home.won_at_ht_home",
        label: "Home Team Won HT",
      },
      away: {
        field: "away.lost_at_ht_away",
        label: "Away Team Lost HT",
      },
    },
    info,
  },
  away_win_ht: {
    title: "Strong Away Win HT Teams",
    description: "Away Win HT Betting Stats",
    conditions: {
      home: {
        field: "home.lost_at_ht_home",
        label: "Home Team Lost HT",
      },
      away: {
        field: "away.won_at_ht_away",
        label: "Away Team Won HT",
      },
    },
    info,
  },
  btts_o25: {
    title: "BTTS & 2.5+ Goals",
    description: "BTTS & 2.5+ Goals Betting Stats",
    conditions: {
      home: {
        field: "home.btts_o25_home",
        label: "Home Teams ",
      },
      away: {
        field: "away.btts_o25_away",
        label: "Away Teams",
      },
      overall: {
        field: "btts_o25_overall",
        label: "Overall Team",
      },
    },
    info,
  },
  btts: {
    title: "BTTS Stats",
    description: "BTTS Betting Stats",
    conditions: {
      home: {
        field: "home.btts_home",
        label: "Home Team BTTS",
      },
      away: {
        field: "away.btts_away",
        label: "Away Team BTTS",
      },
      overall: {
        field: "btts_overall",
        label: "Overall Team BTTS",
      },
    },
    info,
  },
  most_goals_1h: {
    title: "Most Goals 1H Stats",
    description: "Most Goals 1H Betting Stats",
    conditions: {
      home: {
        field: "home.most_goals_1h_home",
        label: "Home Most Goals 1H",
      },
      away: {
        field: "away.most_goals_1h_away",
        label: "Away Most Goals 1H",
      },
      overall: {
        field: "most_goals_1h_overall",
        label: "Overall Team Goals 1H",
      },
    },
    info,
  },

  most_goals_2h: {
    title: "Most Goals 2h Stats",
    description: "Most Goals 2H Betting Stats",
    conditions: {
      home: {
        field: "home.most_goals_2h_home",
        label: "Home Most Goals 2H",
      },
      away: {
        field: "away.most_goals_2h_away",
        label: "Away Most Goals 2H",
      },

      overall: {
        field: "most_goals_2h_overall",
        label: "Overall Team",
      },
    },
    info,
  },
  o05_goals_1h: {
    title: "Over 0.5 Goals 1H Stats",
    description: "+0.5 Goals 1H Betting Stats",
    conditions: {
      home: {
        field: "home.o05_goals_1h_home",
        label: "Home Over 0.5 Goals 1H",
      },
      away: {
        field: "away.o05_goals_1h_away",
        label: "Away Over 0.5 Goals 1H",
      },
      overall: {
        field: "o05_goals_1h_overall",
        label: "Overall Team",
      },
    },
    info,
  },

  o15_goals: {
    title: "Over 1.5 Goals Stats",
    description: "+1.5 Goals Betting Stats",
    conditions: {
      home: {
        field: "home.o15_goals_home",
        label: "Home Over 1.5 Goals",
      },
      away: {
        field: "away.o15_goals_away",
        label: "Away Over 1.5 Goals",
      },
      overall: {
        field: "o15_goals_overall",
        label: "Overall Team",
      },
    },
    info,
  },
  o25_goals: {
    title: "Over 2.5 Goals Stats",
    description: "+2.5 Goals Betting Stats",
    conditions: {
      home: {
        field: "home.o25_goals_home",
        label: "Home Over 2.5 Goals",
      },
      away: {
        field: "away.o25_goals_away",
        label: "Away Over 2.5 Goals",
      },

      overall: {
        field: "o25_goals_overall",
        label: "Overall Team",
      },
    },
    info,
  },
  u35_goals: {
    title: "Under 3.5 Goals Stats",
    description: "-3.5 Goals Betting Stats",
    conditions: {
      home: {
        field: "home.u35_goals_home",
        label: "Home Under 3.5 Goals",
      },
      away: {
        field: "away.u35_goals_away",
        label: "Away Under 3.5 Goals",
      },
      overall: {
        field: "u35_goals_overall",
        label: "Overall Team",
      },
    },
    info,
  },
  u25_goals: {
    title: "Under 2.5 Goals Stats",
    description: "-2.5 Goals Betting Stats",
    conditions: {
      home: {
        field: "home.u25_goals_home",
        label: "Home Under 2.5 Goals",
      },
      away: {
        field: "away.u25_goals_away",
        label: "Away Under 2.5 Goals",
      },
      overall: {
        field: "u25_goals_overall",
        label: "Overall Team",
      },
    },
    info,
  },
  o8_corners: {
    title: "Over 8 Corners Stats",
    description: "+8 Corners Betting Stats",
    conditions: {
      home: {
        field: "home.o85_corners_home",
        label: "Home Over 8 Corners",
      },
      away: {
        field: "away.o85_corners_away",
        label: "Away Over 8 Corners",
      },
      overall: {
        field: "o85_corners_overall",
        label: "Overall Team",
      },
    },
  },
  u9_corners: {
    title: "Under 10 Corners Stats",
    description: "-10 Corners Betting Stats",
    conditions: {
      home: {
        field: "home.u95_corners_home",
        label: "Home Under 10 Corners",
      },
      away: {
        field: "away.u95_corners_away",
        label: "Away Under 10 Corners",
      },
      overall: {
        field: "u95_corners_overall",
        label: "Overall Team",
      },
    },
    info,
  },
};
