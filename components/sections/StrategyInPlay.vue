<template>
  <div>
    <StrategyList
      :pageTitle="pageTitle"
      :pageDescription="pageDescription"
      strategyType="in-play-alerts"
      :strategyMode="strategyMode"
    />
  </div>
</template>

<script>
import StrategyList from "./StrategyList";
export default {
  props: {
    strategyMode: String
  },
  data() {
    return {
      pageTitle: "InPlay Alerts",
      pageDescription:
        "Create unlimited InPlay Alerts to Automatically find Value Matches According to Your Conditions, or Import Preset Alerts Created by other Users",
      strategyType: "in-play-alerts"
    };
  },
  components: {
    StrategyList
  }
};
</script>

<style></style>
