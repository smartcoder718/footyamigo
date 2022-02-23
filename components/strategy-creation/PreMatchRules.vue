<template>
  <div>
    <div class="footy-page-container middle-only">
      <div>
        <footy-dropdown-select
          v-model="selectedCategory"
          :options="categories"
          label="Select PreMatch Category"
          id="categories"
          class="mb-4"
        >
        </footy-dropdown-select>

        <footy-dropdown-select
          v-model="setting.rule_id"
          :options="prematchRulesOptions"
          id="options"
          label="Select PreMatch Stat"
          class="mb-4"
          info="Select the prematch stat you want to create an alert for e.g Games Played, Over / Under Occurrences, Goals Scored, etc.  "
          placeholder="Select a rule"
        >
        </footy-dropdown-select>

        <PreMatchRuleEditor v-model="setting"> </PreMatchRuleEditor>
        <!-- <input type="hidden" v-model="preview" /> -->
      </div>
    </div>
    <LivePreview
      @nextstep="$emit('nextstep')"
      @addRule="addRule"
      v-model="form"
      :strategyType="strategyType"
      :rulesCount="rulesCount"
      :preview="preview"
    >
    </LivePreview>
  </div>
</template>

<script>
import PreMatchRuleEditor from "./PreMatchRuleEditor.vue";
import LivePreview from "./LivePreview";
function initialPreMatchSetting() {
  return {
    rule_id: 2,
    values: [0, 6],
    comparator: "=",
    value: 1,
    team: "home",
    location: "home",
  };
}

export default {
  name: "PreMatchRules",
  // scrollToTop: true,
  props: {
    category: { type: String, default: "general" },
    value: Object,
    strategyType: { type: String, default: "pre-match-alerts" },
  },

  data() {
    return {
      setting: initialPreMatchSetting(),
      selectedCategory: "general",
      categories: [
        { value: "general", text: "General", image: "/vectors/general.svg" },
        { value: "goals", text: "Goals", image: "/vectors/goals.svg" },
        {
          value: "streak",
          text: "Streak",
          image: "/vectors/streak.svg",
        },
        {
          value: "h2h",
          text: "Head to Head",
          image: "/vectors/h2h.svg",
          new: true,
        },
        { value: "half", text: "Half", image: "/vectors/half.svg" },
        { value: "corners", text: "Corners", image: "/vectors/corners.svg" },
        { value: "cards", text: "Cards", image: "/vectors/cards.svg" },
        { value: "odds", text: "Odds", image: "/vectors/odds.svg" },

        {
          value: "probability",
          text: "Probability",
          image: "/vectors/probability.png",
        },
      ],
    };
  },
  components: {
    PreMatchRuleEditor,
    LivePreview,
  },
  watch: {
    // setting: {
    //   deep: true,
    //   handler(val) {
    //     this.$store.commit("setSetting", val);
    //   },
    // },
    selectedCategory: {
      immediate: true,
      handler() {
        const rules = this.filteredPrematchRules;

        if (rules) {
          const { id, min, max } = rules[0];
          Object.assign(this.setting, { values: [min, max], rule_id: id });
        }
      },
    },
  },
  methods: {
    addRule() {
      this.form.strategy_prematch_rules.push(this.$jsonify(this.setting));
    },
  },
  mounted() {
    this.selectedCategory = this.category;
  },
  computed: {
    filteredPrematchRules() {
      return Object.values(this.preMatchRules).filter(
        (x) => x.category == this.selectedCategory
      );
    },
    preMatchRules() {
      return this.$store.state.pre_match_rules;
    },
    prematchRulesOptions() {
      return this.filteredPrematchRules.map((rule) => {
        const { id: value, label: text } = rule;
        return {
          value,
          text,
        };
      });
    },

    rulesCount() {
      return this.form.strategy_prematch_rules.length;
    },
    form: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    preview() {
      const preview = this.$getPreMatchPreview(
        this.setting,
        this.$store.getters.lookupPreMatchRules
      );
      // this.$emit("changePreview", preview);
      return preview;
    },
  },
};
</script>
