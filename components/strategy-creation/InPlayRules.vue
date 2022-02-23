<template>
  <div>
    <div class="footy-page-container middle-only">
      <label class="mb-4">
        What type of InPlay Alert do You Want to Create?
      </label>

      <div class="row-gap-30 flex-col">
        <div class="strategy-type-selection row-gap-20">
          <footy-radio
            v-model="setting.first_category"
            id="first_rule_type"
            radioClass="centered"
            :options="firstRuleTypes"
            containerClass="col-gap-20 shrink-to-fit-row"
            ref="type"
          ></footy-radio>
          <footy-radio
            v-model="setting.first_category"
            class="is-prematch block-on-mobile"
            :options="strategyTypes"
            radioClass="centered"
            ref="type"
          ></footy-radio>
        </div>
      </div>
    </div>
    <PreMatchRules
      v-if="setting.first_category == 'prematch'"
      ref="prematch"
      v-model="form"
      :strategyType="'in-play-alerts'"
      @changePreview="changePreview"
      @nextstep="$emit('nextstep')"
    >
    </PreMatchRules>
    <template v-else>
      <InPlayRuleEditor
        v-model="setting"
        class="footy-page-container middle-only"
      >
      </InPlayRuleEditor>

      <LivePreview
        @nextstep="$emit('nextstep')"
        @addRule="addRule"
        v-model="form"
        :strategyType="'in-play-alerts'"
        :rulesCount="rulesCount"
        :preview="preview"
      >
      </LivePreview>
    </template>

    <!-- <input type="hidden" v-model="preview" />
 -->
  </div>
</template>

<script>
import InPlayRuleEditor from "./InPlayRuleEditor.vue";
import PreMatchRules from "./PreMatchRules";
import LivePreview from "./LivePreview";
function initialInPlaySetting() {
  return {
    first_rule_id: null,
    second_rule_id: null,
    first_team: "home",
    second_team: "away",
    first_category: "stats",
    first_subcategory: "live_odds",
    second_category: "numeric",
    second_subcategory: "live_odds",
    comparator: ">=",
    value: null,
    odds_value: null,
    // has_timer: false,
    timer: {
      time: "disabled",
      from: 0,
      to: 70,
      minute: 70,
    },
  };
}
export default {
  props: {
    value: Object,
  },
  data() {
    return {
      setting: initialInPlaySetting(),

      firstRuleTypes: [
        {
          text: "Statistics",
          value: "stats",
          image: "/vectors/statistics.svg",
          imgclass: "rules-icon",
        },
        {
          text: "Odds",
          value: "odds",
          image: "/vectors/odds.svg",
          imgclass: "rules-icon",
        },
      ],
      strategyTypes: [
        {
          text: "Prematch Stats",
          value: "prematch",
          info: "Advanced",
          image: "/icons/blank.svg",
          imgclass: "d-none",
          labelClass: "w-100",
        },
      ],
    };
  },
  computed: {
    preview() {
      const preview = this.$getInPlayPreview(
        this.setting,
        this.$store.getters.lookupInPlayRules
      );
      this.$emit("changePreview", preview);
      return preview;
    },
    rulesCount() {
      return (
        this.form.strategy_prematch_rules.length +
        this.form.strategy_inplay_rules.length
      );
    },
    form: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  watch: {
    // setting.first_category(val) {
    //   if (val) {
    //     this.setting.first_category = null;
    //     this.$store.commit("setStrategyType", "pre-match-alerts");
    //   }
    // },
    // "setting.first_category"(val) {
    //   if (val) {
    //     this.setting.first_category = null;
    //     this.$store.commit("setStrategyType", "in-play-alerts");
    //   }
    // },
    // setting: {
    //   deep: true,
    //   immediate: true,
    //   handler(val) {
    //     this.$store.commit("setInPlaySetting", this.$jsonify(val));
    //   },
    // },
  },
  components: {
    PreMatchRules,
    InPlayRuleEditor,
    LivePreview,
  },
  methods: {
    changePreview(preview) {
      this.$emit("changePreview", preview);
    },
    addRule() {
      this.form.strategy_inplay_rules.push(this.$jsonify(this.setting));
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/breakpoints";
@import "~/assets/scss/colors";
.strategy-type-selection {
  justify-content: space-between;
}
@media screen and (max-width: $lg) {
  .strategy-type-selection {
    flex-direction: column;
  }
  .is-prematch {
    width: 100%;
    .footy-radio {
      width: 100%;
    }
  }
}
.shrink-to-fit-row {
  max-width: 100% !important;
  display: grid !important;
  grid-gap: 10px;
  grid-template-columns: auto auto;
}
</style>
