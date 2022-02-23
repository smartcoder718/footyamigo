x = {
  "stats.winning_team": {
    $cond: [
      { $gt: ["$stats.home", " $stats.away"] },
      "$stats.home",
      { $cond: [{ $gt: ["$stats.away", " $stats.home"] }, "$stats.away", null] }
    ]
  },
  "stats.losing_team": {
    $cond: [
      { $gt: ["$stats.home", " $stats.away"] },
      "$stats.away",
      { $cond: [{ $gt: ["$stats.away", " $stats.home"] }, "$stats.home", null] }
    ]
  },
  "live_odds.winning_team": {
    $cond: [
      { $gt: ["$stats.home", " $stats.away"] },
      "$live_odds.home",
      { $cond: [{ $gt: ["$stats.away", " $stats.home"] }, "$live_odds.away", null] }
    ]
  },
  "live_odds.losing_team": {
    $cond: [
      { $gt: ["$stats.home", " $stats.away"] },
      "$live_odds.away",
      { $cond: [{ $gt: ["$stats.away", " $stats.home"] }, "$live_odds.home", null] }
    ]
  },
};
