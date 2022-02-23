const express = require("express");
const router = express.Router();
const { Rule } = require("../../db");

function getRequired(record) {
  const {
    code,
    label,
    type,
    direct,
    min,
    max,
    step,
    description,
    category
  } = record;
  return {
    code,
    label,
    type,
    direct,
    min,
    max,
    step,
    description,
    category,
    is_in_play: false
  };
}
async function createPreMatchRule(record) {
  const required = getRequired(record);
  const pre_match_rule = await Rule.create(required);
  return pre_match_rule;
}

async function createPreMatchRules(records) {
  const sanitized = records.map(record => {
    const required = getRequired(record);
    return required;
  });
  const pre_match_rules = await Rule.bulkCreate(sanitized, {
    ignoreDuplicates: true
  });
  return pre_match_rules;
}

function groupRulesByCategory(rules) {
  const group = {};
  rules.forEach(rule => {
    rule = rule.toJSON();

    const { category } = rule;
    if (!group[category]) {
      group[category] = [];
    }
    group[category].push(rule);
  });
  return group;
}

async function fetchPreMatchRules() {
  const pre_match_rules = await PreMatchRule.findAll({
    attributes: [
      "id",
      "code",
      "label",
      "type",
      "min",
      "max",
      "step",
      "description",
      "category",
      "active"
    ]
  });
  return pre_match_rules;
}

router.post("/create", async (req, res) => {
  try {
    const { rule } = req.body;
    const pre_match_rule = await createPreMatchRule(rule);
    res.json(pre_match_rule);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.post("/create-bulk", async (req, res) => {
  try {
    const { rules } = req.body;
    const pre_match_rules = await createPreMatchRules(rules);
    res.json(pre_match_rules);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.get("/", async (req, res) => {
  try {
    const pre_match_rules = await fetchPreMatchRules();
    //const groupped = groupRulesByCategory(pre_match_rules);
    res.json(pre_match_rules);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

module.exports = router;
