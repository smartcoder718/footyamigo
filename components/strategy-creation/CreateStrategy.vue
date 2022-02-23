<template>
  <CreateStrategyInner
    :pageTitle="pageTitle"
    v-if="form.leagues"
    :step="step"
    id="create-strategy"
    v-model="form"
    :strategyType="strategyType"
    @nextstep="nextStep"
    @prevstep="prevStep"
    @save="saveStrategy"
    :rulesCountText="rulesCountText"
    :rulesCount="rulesCount"
    :preview="preview"
  >
    <template v-slot:categorySelection v-if="!isInplay">
      <PreMatchBasic
        v-model="form"
        v-if="step == 0"
        @nextstep="nextStep"
        :category.sync="category"
      ></PreMatchBasic>
    </template>
    <template v-slot:ruleSelection>
      <div :class="step == 1 ? 'has-preview' : ''">
        <div class="footy-page-container top-only">
          <h1 class="create-strategy-title" v-if="step != 1">
            {{ form.title }}
          </h1>

          <b-form-group v-else>
            <label class="footy-label">Strategy Name</label>
            <b-form-input
              b-input
              v-model="form.title"
              label="Strategy Name"
              id="create-strategy-title"
              class="mb-3 footy-input"
              aria-describedby="error-alert-name"
              :state="titleState"
            ></b-form-input>
            <b-form-invalid-feedback id="error-alert-name">
              Must be between 4 to 50 characters
            </b-form-invalid-feedback>
          </b-form-group>
          <Steps
            :currStep="step"
            v-model="form"
            :rulesCountText="rulesCountText"
          ></Steps>
        </div>

        <!-- <Timer v-model="form.timer" v-if="step == 1 && isInplay"> </Timer> -->

        <component
          :is="isInplay ? InPlayRules : PreMatchRules"
          v-if="step == 1"
          :category="category"
          v-model="form"
          @prevstep="prevStep"
          @nextstep="nextStep"
          @changePreview="changePreview"
        >
        </component>
        <div class="footy-page-container bottom-only" v-else>
          <SelectOutcomes
            v-if="step == 2"
            v-model="form.outcome_id"
            @prevstep="prevStep"
            @nextstep="nextStep"
          >
          </SelectOutcomes>
          <component
            :is="isInplay ? InPlaySettings : PreMatchSettings"
            v-else
            v-model="form"
            @prevstep="prevStep"
            @nextstep="nextStep"
            @save="saveStrategy"
          >
          </component>
        </div>
      </div>
    </template>
  </CreateStrategyInner>
</template>

<script>
import CreateStrategyInner from "./CreateStrategyInner.vue";
import Steps from "./Steps.vue";
import InPlayRules from "./InPlayRules";
import InPlaySettings from "./InPlaySettings";

import SelectOutcomes from "./SelectOutcomes.vue";
import PreMatchBasic from "./PreMatchBasic";
import PreMatchRules from "./PreMatchRules";
import PreMatchSettings from "./PreMatchSettings";

export default {
  props: {
    value: Object,
    pageTitle: String,
    strategyType: String,
    beginZero: Boolean,
  },
  data() {
    return {
      step: this.beginZero ? 0 : 1,
      category: "general",
      InPlayRules,
      PreMatchRules,
      InPlaySettings,
      PreMatchSettings,
      preview: "",
    };
  },
  components: {
    CreateStrategyInner,
    Steps,

    SelectOutcomes,
    PreMatchBasic,
    Steps,
  },
  mounted() {
    if (this.isInplay) {
      this.$store.dispatch("fetchInPlayRules");
    }
    this.$store.commit("setStrategyType", this.strategyType);
    this.$store.dispatch("fetchLeagues").then((x) => {
      if (!this.form.leagues.length) {
        this.form.leagues = x.map((league) => league.value);
      }
    });
  },
  methods: {
    nextStep() {
      this.step += 1;
    },
    prevStep() {
      this.step -= 1;
    },
    changePreview(preview) {
      this.preview = preview;
    },
    async saveStrategy() {
      try {
        // console.log("I AM SAVING THIS", this.form);
        await this.$axios.saveStrategy(this.form, this.strategyType);
        this.$bvToast.toast(
          `Congratulations! Your strategy has been successfully created.`,
          {
            title: "Success",
            variant: "primary",
            position: "b-toaster-bottom-center",
            solid: true,
            autoHideDelay: 5000,
          }
        );
        setTimeout(() => {
          this.$router.push({
            path: "/" + this.strategyType,
          });
        }, 2000);
      } catch (error) {
        console.error(error);
      }
    },
  },
  computed: {
    isInplay() {
      return this.strategyType == "in-play-alerts";
    },
    form: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    titleState() {
      return this.form.title.length > 3 && this.form.title.length <= 50;
    },
    strategyPrematch() {
      return this.form.strategy_prematch_rules;
    },
    strategyInplay() {
      return this.form.strategy_inplay_rules;
    },
    rulesCountText() {
      return this.rulesCount > 0 ? " • " + this.rulesCount : "";
    },
    rulesCount() {
      return this.strategyPrematch.length + this.strategyInplay.length;
    },
  },
};
</script>

<style>
.create-strategy-title {
  font-size: 24px;
  line-height: 36px;
  margin-bottom: 20px;
}
</style>
