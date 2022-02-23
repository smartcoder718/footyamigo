<template>
  <div v-if="$store.getters.lookupInPlayRules">
    <div class="row-gap-30 flex-col">
      <OddsStats
        :id.sync="setting.first_rule_id"
        :team.sync="setting.first_team"
        :subcategory.sync="setting.first_subcategory"
        v-if="['odds', 'stats'].includes(setting.first_category)"
        :category="setting.first_category"
      ></OddsStats>
      <footy-dropdown-select
        v-model="setting.comparator"
        label="Select Condition"
        info="Select the condition for the rules above e.g More Than, Equal to, Less than, etc. "
        :options="Object.values(comparators)"
      ></footy-dropdown-select>
    </div>

    <template>
      <footy-radio
        v-model="setting.second_category"
        id="second_rule_type"
        :options="secondary_rules"
        class="second-rules mt-4 mb-3"
      ></footy-radio>

      <OddsStats
        :id.sync="setting.second_rule_id"
        :team.sync="setting.second_team"
        v-if="['odds', 'stats'].includes(setting.second_category)"
        :category="setting.second_category"
        :subcategory.sync="setting.second_subcategory"
        :teams="secondary_teams"
      ></OddsStats>
      <template v-else>
        <b-input
          v-model="setting.odds_value"
          placeholder="Enter Number"
          id="enter-number"
          class="footy-input"
          v-if="setting.first_category == 'odds'"
          type="number"
        ></b-input>
        <b-input
          v-model="setting.value"
          placeholder="Enter Number"
          id="enter-number"
          class="footy-input"
          v-else
          type="number"
        ></b-input>
      </template>
    </template>
    <InPlayTimer
      v-model="setting.timer"
      class="mt-4"
      :activeRule="activeRule.label"
      v-if="setting.first_category == 'stats' && setting.first_rule_id != 480"
    >
    </InPlayTimer>
  </div>
</template>

<script>
import comparators from "~/components/json/comparators.json";
import secondary_team from "~/components/json/secondary-team.json";
import OddsStats from "./InPlayOddsStats";
import DualRangeSlider from "~/components/DualRangeSlider.vue";
import InPlayTimer from "./InPlayTimer";
export default {
  props: {
    value: Object
  },
  data() {
    return {
      comparators,
      secondary_team,
      teams: [
        { value: "home", text: "Home Team" },
        { value: "away", text: "Away Team" },
        { value: "both", text: "Both Teams" }
      ],
      locations: [
        { value: "home", text: "Home Stats" },
        { value: "away", text: "Away Stats" },
        { value: "overall", text: "Overall Stats" }
      ]
    };
  },
  components: {
    OddsStats,
    DualRangeSlider,
    InPlayTimer
  },
  computed: {
    setting: {
      get: function() {
        return this.value;
      },
      set: function(value) {
        this.$emit("input", value);
      }
    },
    secondary_teams() {
      return this.secondary_team[this.setting.first_team];
    },
    activeRule() {
      return (
        this.$store.getters.lookupInPlayRules[this.setting.first_rule_id] || {}
      );
    },
    secondary_rules() {
      const numeric_only = ["sum_of_teams", "either_team"];
      const rule_types = [
        { text: "Numeric", value: "numeric" },
        { text: "Statistics", value: "stats" },
        { text: "Odds", value: "odds" }
      ];
      switch (this.setting.first_category) {
        case "stats":
          if (
            numeric_only.includes(this.setting.first_team) ||
            this.setting.first_rule_id == 480
          ) {
            return [{ text: "Numeric", value: "numeric" }];
          } else {
            return rule_types.filter(x => x.value != "odds");
          }
        case "odds":
          if (this.activeRule.has_team) {
            if (numeric_only.includes(this.setting.first_team)) {
              return [{ text: "Numeric", value: "numeric" }];
            } else {
              return rule_types.filter(x => x.value != "stats");
            }
          }
        default:
          return rule_types.filter(x => x.value != "stats");
      }
    }
  },
  watch: {
    secondary_rules(newVal, oldVal) {
      if (newVal != oldVal && this.secondary_rules) {
        this.setting.second_category = this.secondary_rules[0].value;
      }
    },
    "setting.first_rule_id"(val) {
      this.setting.second_rule_id = val;
    }
    /*activeRule(rule) {
      if (rule) {
        const { min, max } = rule;
        this.setting.values = [min, max];
      }
    }*/
  }
};
</script>

<style></style>
