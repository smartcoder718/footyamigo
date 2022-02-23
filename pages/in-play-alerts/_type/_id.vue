<template>
  <StrategyDetails :nagivationlinks="nagivationlinks" type="in-play-alerts" />
</template>
<script>
import StrategyDetails from "~/components/strategy-details/StrategyDetails.vue";

export default {
  components: {
    StrategyDetails
  },
  data() {
    return {
      nagivationlinks: [
        {
          slug: "picks",
          label: "Picks",
          icon: "PicksIcon"
        },
        {
          slug: "leagues",
          label: "Leagues",
          icon: "TrophyIcon"
        }
      ]
    };
  }
};
</script>
