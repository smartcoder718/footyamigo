<template>
  <div>
    <CreateStrategy
      v-model="form"
      :pageTitle="pageTitle"
      :strategyType="strategyType"
      :beginZero="true"
    />
  </div>
</template>

<script>
import CreateStrategy from "@/components/strategy-creation/CreateStrategy";

function initialPreMatchForm() {
  return {
    id: null,
    title: "",
    strategy_prematch_rules: [],
    strategy_inplay_rules: [],
    outcome_id: null,
    needs_odds: false,
    is_public: true,
    timer: {
      minute: 15
    },
    note: "",
    has_note: false,
    leagues: []
  };
}
export default {
  data() {
    return {
      form: initialPreMatchForm(),
      pageTitle: "New PreMatch Strategy",
      strategyType: "pre-match-alerts"
    };
  },
  components: {
    CreateStrategy
  }
};
</script>

<style></style>
