<template>
  <div>
  
    <div v-if="submenu == 'Stats'">
      <CornerStats :fixture="fixture" :location="location"> </CornerStats>
    </div>
    <div v-else>
      <CornerTimingsChart :fixture="fixture"> </CornerTimingsChart>
    </div>
  </div>
</template>

<script>
import CornerTimingsChart from "~/components/partials/stats/CornerTimings";
import CornerStats from "~/components/partials/stats/CornerStats";
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
    CornerTimingsChart,
    CornerStats,
  },
};
</script>

<style></style>
