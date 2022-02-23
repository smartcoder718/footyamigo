<template>
  <div class="d-grid gap-20" style="align-content: start;   ">
    <h3 class="inner-heading">Strike Rate</h3>
    <footy-radio
      id="strike-rates"
      v-model="picksSent.active"
      :options="picksSent.modes"
      radioClass="w-100-mobile centered"
    >
    </footy-radio>

    <div class="fmt" v-if="picks.length">
      <div class="fmt-head fmt-row text-grey">
        <div class="strategy-name">
          STRATEGY NAME
        </div>
        <div class="hit-rate">PICK SENT</div>
        <div class="actions centered">ACTIONS</div>
      </div>

      <div
        v-for="(filter, i) in picksSent[picksSent.active]"
        :key="i"
        class="fmt-row"
      >
        <div class="fmt-label text-grey">
          STRATEGY NAME
        </div>
        <div class="fmt-label text-grey">
          PICK SENT
        </div>
        <div class="strategy-name">
          {{ filter.title }}
        </div>
        <div class="hit-rate" :class="$getColor(filter.picks_sent, 'text-')">
          {{ filter.picks_sent }}%
        </div>
        <div class="actions">
          <b-button
            variant="secondary"
            class="footy-button "
            block
            :disabled="!$store.getters.subscriptionType"
            @click="viewFilter(filter.id)"
            >View</b-button
          >
        </div>
      </div>
    </div>
    <div v-else class="centered py-3">
      <h4 class="text-grey">No strategies found !</h4>
    </div>
    <SharerModal
      v-model="showStrategy"
      :id="strategyId"
      v-if="showStrategy"
      :viewMode="true"
    >
    </SharerModal>
  </div>
</template>

<script>
import SharerModal from "~/components/SharerModal";
export default {
  data() {
    return {
      showStrategy: false,
      strategyId: null,
      picksSent: {
        user_stategies: [],
        other_stategies: []
      },
      picksSent: {
        modes: [
          { text: "Others", value: "other_stategies" },
          { text: "Yours", value: "user_stategies" }
        ],
        active: "other_stategies",
        fields: [
          { key: "title", label: "Strategy Name" },
          "picks_sent",
          "actions"
        ]
      }
    };
  },
  components: {
    SharerModal
  },
  computed: {
    picks() {
      return this.picksSent[this.picksSent.active];
    }
  },
  mounted() {
    this.getPicksSent();
  },
  methods: {
    async getPicksSent() {
      try {
        let rates = await this.$axios.getPicksSent();
        this.picksSent = rates;
      } catch (error) {
        console.log(error);
      }
    },
    viewFilter(id) {
      this.showStrategy = true;
      this.strategyId = id;
    }
  }
};
</script>

<style lang="scss">
@import "~assets/scss/breakpoints";
</style>
