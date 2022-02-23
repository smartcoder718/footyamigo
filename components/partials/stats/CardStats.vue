<template>
  <div>
    <StatsComparison :fixture="fixture" stat="Cards" :location="location">
    </StatsComparison>
  </div>
</template>

<script>
import StatsComparison from "./StatsComparison.vue";
export default {
  props: {
    fixture: Object,
    location: Object,
  },
  components: {
    StatsComparison,
  },
};
</script>

<style></style>
