const { Fixture, Strategy, knex } = require("../db");
// table.increments("id").primary();
// table.integer("strategy_id").unsigned().references("strategies.id");
// table.string("id").notNullable();
// table.enum("location", ["overall", "home", "away"]);
// table.enum("team", ["both", "home", "away"]);
// table.enum("comparator", ["<=", ">=", "=", "!=", "<", ">"]);
// table.decimal("value", { precision: 2 });
// table.json("values");
// table.string("category").notNullable();
const util = require("util");

function showFull(myObject) {
  console.log(util.inspect(myObject, { showHidden: false, depth: null }));
}

function parsePreMatchRule(rule) {
  // id: 330,
  //   strategy_id: 3,
  //   id: 'scored_avg_goals',
  //   location: 'overall',
  //   team: 'both',
  //   comparator: '=',
  //   value: '1.00',
  //   values: [ 1.79, 6 ],
  //   category: 'goals',
  //   code: 'scored_avg',
  //   label: 'Goals Scored (AVG)',
  //   type: 'avg',
  //   min: 0,
  //   max: 6,
  //   step: '0.01',
  //   is_in_play: 0,
  //   description: 'The average number of total goals scored per match.',
  //   direct: null,
  //   active: 1,
  //   has_team: null,
  //   overall: 'scored_overall_avg',
  //   home: 'scored_home_avg',
  // away: "scored_away_avg";
  const {
    category,
    code,
    comparator,
    value,
    values,
    team,
    direct,
    location
  } = rule;
  var condition;
  if (category == "odds") {
    condition = builder => builder.where("preodds." + code, comparator, value);
  } else if (category == "probability") {
    condition = builder => builder.whereBetween("probability." + code, values);
  } else {
    var key = direct ? code : rule[location];
    if (team == "both") {
      condition = builder =>
        builder
          .whereBetween("home." + key, values)
          .andWhereBetween("away." + key, values);
    } else {
      condition = builder => builder.whereBetween(team + "." + key, values);
    }
  }
  return condition;
}

function buildPreMatchQuery(rules) {
  const conditions = [];
  for (const rule of rules) {
    const condition = parsePreMatchRule(rule);
    conditions.push(condition);
  }
  return conditions;
}

function buildInPlayQuery(rules) {
  const conditions = [];
  for (const rule of rules) {
    const condition = parsePreMatchRule(rule);
    conditions.push(condition);
  }
  return conditions;
}

function genEitherTeamQuery(rule, equation, RHS) {
  return {
    [Op.or]: [
      {
        [`$${rule.subcategory}.${rule.code}_home$`]: {
          [equation]: RHS
        }
      },
      {
        [`$${rule.subcategory}.${rule.code}_away$`]: {
          [equation]: RHS
        }
      }
    ]
  };
}

function genSumOfTeamsQuery(rule, comparator, RHS) {
  return sequelize.where(
    sequelize.literal(
      `${rule.subcategory}.${rule.code}_home + ${rule.subcategory}.${rule.code}_away`
    ),
    comparator,
    RHS
  );
}

function genHasTeamQuery(rule, equation, RHS, team) {
  return {
    [`$${rule.subcategory}.${rule.code}_${team}$`]: {
      [equation]: RHS
    }
  };
}

function genNoTeamQuery(rule, equation, RHS) {
  return {
    [`$${rule.subcategory}.${rule.code}$`]: {
      [equation]: RHS
    }
  };
}

function parseTime({ from, to, minute, time }) {
  const hmap = {
    disabled: {
      [Op.ne]: null
    },
    atMinuteX: {
      [Op.eq]: minute
    },
    xMinutesAgo: {
      [Op.eq]: this.sequelize.col("minute") - minute
    },
    betweenMinutesXandY: {
      [Op.between]: [from, to]
    },
    pastXminutes: {
      [Op.gte]: this.sequelize.col("minute")- minute
    },
    sinceMinuteX: {
      [Op.gte]: minute
    },
    untilMinuteX: {
      [Op.lte]: minute
    },
    during1stHalf: {
      [Op.lte]: 45
    },
    during2ndHalf: {
      [Op.gt]: 45
    },
    atHalfTime: {
      [Op.eq]: 45
    },
    atFullTime: {
      [Op.eq]: 90
    }
  };
  return hmap[time];
}

function parseSetting({ first, second, comparator }, in_play_rules) {
  const { metric, team } = first;
  var query;
  var RHS;
  const rule_1 = in_play_rules[metric];
  const equation = comparators[comparator];

  if (second.is_numeric) {
    RHS = Number(second.numeric);
  } else {
    const { metric: metric_2, team: team_2 } = second;
    const rule_2 = in_play_rules[metric_2];
    if (rule_2.has_team) {
      RHS = sequelize.col(`${rule_2.subcategory}.${rule_2.code}_${team_2}`);
    } else {
      RHS = sequelize.col(`${rule_2.subcategory}.${rule_2.code}`);
    }
  }

  if (rule_1.has_team) {
    if (team == "either_team") {
      query = genEitherTeamQuery(rule_1, equation, RHS);
    } else if (team == "sum_of_teams") {
      query = genSumOfTeamsQuery(rule_1, comparator, RHS);
    } else {
      query = genHasTeamQuery(rule_1, equation, RHS, team);
    }
  } else {
    query = genNoTeamQuery(rule_1, equation, RHS);
  }

  return query;
}

async function parseFilter(filter, in_play_rules) {
  let rules = [{ minute: this.parseTime(filter.timer) }];
  //console.log("FILTER LA", filter.settings)
  filter.settings.in-play.forEach(setting => {
    rules.push(this.parseSetting(setting, in_play_rules));
  });
  let prematchquery = await this.buildPreMatchQuery(filter.settings.prematch);
  rules.push(...prematchquery);
  let query = {
    [Op.and]: rules
  };
  console.log(filter.title);
  showFull(query);

  return query;
}

async function findFixtures() {
  const strategies = await Strategy.findWithRule();
  console.log(JSON.stringify(strategies, null, 2));
  for (var strategy of strategies) {
    const rules = strategy.strategy_prematch_rules;
    const conditions = buildPreMatchQuery(rules);
    // Fixture.findUpcoming(conditions).then(fixtures=> {
    //   console.log(fixtures)
    // })
  }
}

//findFixtures()
module.exports = {
  buildPreMatchQuery
};
