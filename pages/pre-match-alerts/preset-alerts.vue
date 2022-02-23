<template>
  <div>
    <StrategyPreMatch strategyMode="preset-alerts" :table_felds="table_fields"/>
  </div>
</template>

<script>
import StrategyPreMatch from "~/components/sections/StrategyPreMatch";
export default {
  data() {
    return {
      table_fields: ["hit_rate", "outcome", "status", "actions"]
    };
  },
  components: {
    StrategyPreMatch
  }
};
</script>

<style></style>
