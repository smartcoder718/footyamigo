import comparators from "../components/json/comparators.json";
import in_play_team from "../components/json/in-play-team.json";
import in_play_time from "../components/json/in-play-time.json";

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export const getPreMatchPreview = (setting, pre_match_rules) => {
  const { values, team, rule_id: id, comparator, value, location } = setting;
  const rule = pre_match_rules[id];
  if (!rule) {
    return "";
  }
  const { category, label } = rule;

  if (category == "odds") {
    return `Odds for ${label} is ${comparators[comparator].info} <span class="is-number">${value}</span>`;
  }
  const value_text = `<span class='is-number'> ${values[0]}</span> and <span class='is-number'> ${values[1]}</span>`;
  if (category == "probability") {
    return "Probability for " + label + ` is between ${value_text}`;
  }
  if (category == "h2h") {
    return label + ` is between ${value_text}`;
  }
  if (id == "489") {
    return `${label} of ${capitalize(team)} Team</span>${
      team == "both" ? "s" : ""
    } is between ${value_text}`;
  }
  return `${label} by ${capitalize(team)} Team</span>${
    team == "both" ? "s" : ""
  } played ${location == "home" ? " at " : ""}${capitalize(
    location
  )} is between ${value_text}`;
};

export const getTimerPreview = (timer) => {
  if (!timer) {
    return "";
  }
  const { time, from, to, minute } = timer;
  var { type: time_type, info: time_text } = in_play_time[time];
  if (time_type == "fixed") {
    time_text = time_text.replace("***", minute + "'");
  } else if (time_type == "multiple") {
    time_text = time_text.replace("***", from + "'" + " and " + to + "'");
  }

  return time_text;
};
export const getPartialInplayPreview = (
  { id, team, subcategory },
  in_play_rules
) => {
  if (!in_play_rules) {
    return "";
  }
  let rule = in_play_rules[id];
  if (!rule) {
    return;
  }
  let team_text = "";
  let metric_text = "";

  try {
    if (rule.category == "odds") {
      metric_text =
        subcategory == "live_odds" ? "In Play Odds: " : "Pre Match Odds: ";
    }
    metric_text += rule.label;

    if (rule.has_team) {
      team_text = " of " + in_play_team[team].text;
    }

    return metric_text + team_text;
  } catch (error) {
    console.log(error);
  }
};
export const getInPlayPreview = (
  {
    first_rule_id,
    second_rule_id,
    first_team,
    first_category,
    first_subcategory,
    second_team,
    comparator,
    value,
    odds_value,
    second_category,
    second_subcategory,
    timer,
  },

  in_play_rules
) => {
  var preview =
    (getPartialInplayPreview(
      { id: first_rule_id, team: first_team, subcategory: first_subcategory },
      in_play_rules
    ) || "____") +
    " is " +
    comparators[comparator].info.toLowerCase() +
    " ";
  if (second_category == "numeric") {
    if (first_category == "odds") {
      preview += isNaN(odds_value) ? "____" : odds_value;
    } else {
      preview += isNaN(value) ? "____" : value;
    }
  } else {
    preview += getPartialInplayPreview(
      {
        id: second_rule_id,
        team: second_team,
        subcategory: second_subcategory,
      },
      in_play_rules
    );
  }
  preview += " " + getTimerPreview(timer);
  return preview;
};
