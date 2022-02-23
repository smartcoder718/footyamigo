const express = require("express");
const router = express.Router();
const { Rule } = require("../../db");

function getRequired(record) {
  const { code, label, description, category, has_team, subcategory } = record;
  return {
    code,
    label,
    description,
    category,
    subcategory,
    has_team,
    is_in_play: true
  };
}

async function createInPlayRule(record) {
  const required = getRequired(record);
  const pre_match_rule = await Rule.create(required);
  return pre_match_rule;
}

async function createInPlayRules(records) {
  const sanitized = records.map(record => {
    const required = getRequired(record);
    return required;
  });
  const in_play_rules = await Rule.bulkCreate(sanitized, {
    ignoreDuplicates: true
  });
  return in_play_rules;
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

async function fetchInPlayRules() {
  const in_play_rules = await Rule.findAll({
    where: { is_in_play: true },
    attributes: [
      "id",
      "code",
      "label",
      "description",
      "category",
      "subcategory",
      "active",
      "has_team"
    ]
  });
  return in_play_rules;
}

router.post("/create", async (req, res) => {
  try {
    const { rule } = req.body;
    const pre_match_rule = await createInPlayRule(rule);
    res.json(pre_match_rule);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.post("/create-bulk", async (req, res) => {
  try {
    const { rules } = req.body;
    const in_play_rules = await createInPlayRules(rules);
    res.json(in_play_rules);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.get("/", async (req, res) => {
  try {
    const in_play_rules = await fetchInPlayRules();
    //const groupped = groupRulesByCategory(in_play_rules);
    res.json(in_play_rules);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

module.exports = router;
