<template>
  <div>
    <odds-scroller :fixture="fixture"></odds-scroller>
   

  </div>
</template>

<script>
import OddsScroller from "~/components/partials/scrollers/OddsScroller";

export default {
  name: "Peak",
  props: {
    fixture: Object,
  },
  components: {
    OddsScroller,
  },
};
</script>

<style lang="scss">
</style>