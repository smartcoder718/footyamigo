<template>

    <div class="selected-outcomes">
      <div class="d-flex flex-col row-gap-20">
        <h4 class="mb-2">Select Outcomes</h4>
        <h6 class="description-text">
          Select the main result (or results) you are expecting from this
          strategy. Selecting a 'Desired Outcome' from the list below will allow
          your strategy to be tracked and you will be able to view your
          strategy’s success rate and strike rate from your alert page.
        </h6>
        <b-overlay :show="loading" :opacity="0.95">
          <footy-vertical-radio
            v-model="outcome_id"
            :options="outcomeOptions"
            name="outcomes"
            v-if="outcomeOptions"
            id="outcomes"
            filtered
          ></footy-vertical-radio>
        </b-overlay>
      </div>
      <div class="step-button-group mt-5">
        <b-button
          class="footy-button prev-button"
          @click="$emit('prevstep')"
          href="#create-strategy"
        >
          <PrevIcon class="icon-left" />
          Previous Step
        </b-button>

        <b-button
          class="footy-button"
          variant="primary"
          :disabled="outcome_id == null"
          @click="$emit('nextstep')"
          href="#create-strategy"
        >
          Next Step
          <NextIcon class="icon-right" />
        </b-button>
      </div>
    </div>

</template>

<script>
export default {
  props: {
    value: null,
    showNav: { type: Boolean, default: true },
  },
  // scrollToTop: true,

  data() {
    return {
      loading: false,
    };
  },
  mounted() {
    this.fetchOutcomes();
  },
  methods: {
    async fetchOutcomes() {
      try {
        this.loading = true;
        await this.$store.dispatch("fetchOutcomes");
        this.loading = false;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
  computed: {
    outcomeOptions() {
      const demo_outcome = {
        value: this.$uuid.v4(),
        text: "Outcome",
      };
      if (this.loading) {
        return Array(10).fill(demo_outcome);
      }
      return this.$store.getters.getOutcomeOptions;
    },
    outcome_id: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>

<style lang="scss">
@import "~assets/scss/breakpoints";
.selected-outcomes {
  .outcome-description {
    font-size: 12px;
    line-height: 18px;
    color: #60685f !important;
  }
  .sub-heading {
    margin-bottom: 8px;
  }
}
</style>
