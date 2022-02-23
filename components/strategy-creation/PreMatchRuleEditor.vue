<template>
  <div v-if="activeRule" class="row-gap-30 flex-col" style="min-height: 200px">
    <div v-if="activeRule.category == 'odds'" class="row-gap-30 flex-col">
      <footy-dropdown-select
        v-model="setting.comparator"
        label="Select Condition"
        :options="Object.values(comparators)"
      ></footy-dropdown-select>

      <footy-input
        v-model="setting.value"
        placeholder="Enter Number"
        type="number"
        label="Value"
      ></footy-input>
    </div>

    <div v-if="activeRule.category != 'odds'" class="">
      <DualRangeSlider
        v-model="setting.values"
        :step="Number(activeRule.step)"
        :max="activeRule.max"
        :min="activeRule.min"
      >
      </DualRangeSlider>
      <div
        class="text-center text-grey"
        style="margin-left: 12%; margin-right: 12%; font-weight: normal"
      >
        {{ activeRule.description }}
      </div>
    </div>

    <div v-if="activeRule.category == 'probability'">
      <h6 class="probability-description text-justify">
        The powerful Footy Amigo™ Prediction Algorithm is based on over 14+
        years of historical data and uses cutting edge Machine Learning
        Techniques and Statistical Models developed by the Dev Team and expert
        Data Scientists following Bayesian principles to create the most precise
        and reliable football predictions on the market.
      </h6>
      <br />
      <h6 class="probability-description text-justify">
        The Prediction Algorithm uses thousands of data-points, including those
        available on Footy Amigo and those externally sourced, such as the xG
        (expected Goals) metrics. There is no room for human error because it's
        powered by ever learning and always improving algorithms and statistical
        models.
      </h6>
    </div>

    <template
      v-if="!['odds', 'probability', 'h2h'].includes(activeRule.category)"
    >
      <div class="row-gap-20 flex-col">
        <footy-radio
          id="team"
          containerClass="overflow-x-scroll"
          v-model="setting.team"
          :options="teams"
          label="Team"
          info="Select the team that you want the prematch stat above to match i.e Home Team, Away Team or Both Teams"
        >
        </footy-radio>

        <footy-radio
          id="location"
          v-model="setting.location"
          containerClass="overflow-x-scroll"
          :options="locations"
          label="Form"
          v-if="setting.rule_id != 489"
          info="Stats of when team played at home (Home Stats), when they played away (Away Stats) or the combination of both their home and away stats (Overall Stats)"
        >
        </footy-radio>
      </div>
    </template>
  </div>
</template>

<script>
import DualRangeSlider from "~/components/DualRangeSlider";
import comparators from "~/components/json/comparators.json";

export default {
  props: {
    value: Object,
  },
  data() {
    return {
      comparators,
      teams: [
        { value: "home", text: "Home Team" },
        { value: "away", text: "Away Team" },
        { value: "both", text: "Both Teams" },
        { value: "either", text: "Either Team" },
      ],
      locations: [
        { value: "home", text: "Home Stats" },
        { value: "away", text: "Away Stats" },
        { value: "overall", text: "Overall Stats" },
      ],
    };
  },
  computed: {
    setting: {
      get: function () {
        return this.value;
      },
      set: function (value) {
        this.$emit("input", value);
      },
    },
    activeRule() {
      return this.$store.getters.lookupPreMatchRules[this.value.rule_id];
    },
  },
  watch: {
    activeRule(rule) {
      if (rule) {
        const { min, max } = rule;
        this.setting.values = [min, max];
      }
    },
  },
  components: {
    DualRangeSlider,
  },
};
</script>

<style></style>
