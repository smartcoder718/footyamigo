[
  {
    $facet: {
      fixtures_found: [
        { $match: { "home.played_overall": { $gte: 30 } } },
        { $count: "id" }
      ],
      hits_found: [
        {
          $match: {
            "home.played_overall": { $gte: 30 },
            "result.home_win": true
          }
        },
        { $count: "id" }
      ]
    }
  }
];

// {
//     $project: {
//       Total: { $arrayElemAt: ["$Total.Total", 0] },
//       Released: { $arrayElemAt: ["$Released.Released", 0] },
//       Unreleased: { $arrayElemAt: ["$Unreleased.Unreleased", 0] }
//     }
//   }

[
  {
    $facet: {
      fixtures_found: [
        { $match: { "home.played_overall": { $gte: 30 } } },
        { $count: "id" }
      ]
    }
  }
];
