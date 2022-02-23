<template>
  <div>
    <div v-if="submenu == 'Stats'">
      <GoalStats :fixture="fixture" :location="location"> </GoalStats>
    </div>
    <div v-else>
      <GoalTimingsChart :fixture="fixture"> </GoalTimingsChart>
    </div>
  </div>
</template>

<script>
import GoalTimingsChart from "~/components/partials/stats/GoalTimings";
import GoalStats from "~/components/partials/stats/GoalStats";
export default {
  props: {
    fixture: Object,
    submenu: String,
    location: Object,
  },
  data() {
    return {};
  },
  components: {
    GoalTimingsChart,
    GoalStats,
  },
};
</script>

<style></style>
