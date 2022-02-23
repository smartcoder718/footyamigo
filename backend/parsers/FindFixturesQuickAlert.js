const { Op } = require("sequelize");
const { sequelize } = require("../db");

const equations = {
  "=": Op.eq,
  ">": Op.gt,
  "<": Op.lt
};
function parseResult(result) {
  const home_win = { home_goals: { [Op.gt]: sequelize.col("away_goals") } };
  const draw = { home_goals: { [Op.eq]: sequelize.col("away_goals") } };
  const away_win = { home_goals: { [Op.lt]: sequelize.col("away_goals") } };
  const home_draw = { [Op.or]: [home_win, draw] };
  const away_draw = { [Op.or]: [away_win, draw] };
  const not_draw = { [Op.or]: [home_win, away_win] };
  const rules = {
    home_win,
    draw,
    away_win,
    home_draw,
    away_draw,
    not_draw
  };
  return rules[result];
}

function parseMinute(minute, minute_equation) {
  if (minute_equation == "before") {
    return { minute: { [Op.lt]: minute } };
  } else {
    return { minute: { [Op.gt]: minute } };
  }
}

function parseStat(equation, value, type) {
  const operator = equations[equation];
  const rule = { [type]: { [operator]: value } };
}

function parseQuickAlert(settings) {
  const { result, type, minute, minute_equation, equation, value } = settings;
  const minute_rule = parseMinute(minute, minute_equation);
  let basic_rule;
  if (type == "result") {
    basic_rule = parseResult(result);
  } else {
    basic_rule = parseStat(equation, value, type);
  }
  const rules = { [Op.and]: [minute_rule, basic_rule] };
  return rules;
}

module.exports = {
  parseQuickAlert
};
