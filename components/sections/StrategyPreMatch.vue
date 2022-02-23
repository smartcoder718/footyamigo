<template>
  <div>
    <StrategyList
      :pageTitle="pageTitle"
      :pageDescription="pageDescription"
      strategyType="pre-match-alerts"
      :strategyMode="strategyMode"
      :table_fields="table_fields"
    />
  </div>
</template>

<script>
import StrategyList from "./StrategyList";
export default {
  props: {
    strategyMode: String,
    table_fields: Array
  },
  data() {
    return {
      pageTitle: "PreMatch Alerts",
      pageDescription:
        "Create unlimited PreMatch Alerts to Automatically find Value Matches According to Your Conditions, or Import Preset Alerts Created by other Users",
      strategyType: "pre-match-alerts"
    };
  },
  components: {
    StrategyList
  }
};
</script>

<style></style>
