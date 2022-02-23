<template>
  <div>
    <CreateStrategy v-model="form" :pageTitle="pageTitle" :strategyType="strategyType" />
  </div>
</template>

<script>
import CreateStrategy from "@/components/strategy-creation/CreateStrategy";

function initialInPlayForm() {
  return {
    id: null,
    title: "",
    strategy_prematch_rules: [],
    strategy_inplay_rules: [],
    leagues: [],
    outcome_id: null,
    needs_odds: false,
    is_public: true,
    timer: {
      time: "atMinuteX",
      from: 0,
      to: 45,
      minute: 45
    },
    note: "",
    has_note: false
  };
}

export default {
  data() {
    return {
      form: initialInPlayForm(),
      pageTitle: "New InPlay Strategy",
      strategyType: "in-play-alerts"
    };
  },
  components: {
    CreateStrategy
  }
};
</script>

<style></style>
