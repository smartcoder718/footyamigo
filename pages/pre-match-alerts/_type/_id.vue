<template>
  <StrategyDetails :nagivationlinks="nagivationlinks" type="pre-match-alerts" />
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
          slug: "results",
          label: "Results",
          icon: "ResultsIcon"
        },
        {
          slug: "upcoming",
          label: "Upcoming",
          icon: "CalendarIcon"
        },
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
