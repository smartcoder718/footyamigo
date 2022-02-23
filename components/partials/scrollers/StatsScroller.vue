<template>
  <div>
    <div v-if="fixtureWithStats.home">
      <div v-if="stat == 'Goals'">
        <Goals
          :fixture="fixtureWithStats"
          :submenu="submenu"
          :location="location"
        >
        </Goals>
      </div>
      <div v-else-if="stat == 'Corners'">
        <Corners
          :fixture="fixtureWithStats"
          :submenu="submenu"
          :location="location"
        >
        </Corners>
      </div>
      <div v-else-if="stat == 'Cards'">
        <Cards
          :fixture="fixtureWithStats"
          :location="location"
         
        >
        </Cards>
      </div>
      <div v-else-if="stat == 'H2H'">
        <H2H :fixture="fixtureWithStats" :location="location"> </H2H>
      </div>
      <div v-else>
        <StatsComparison
          :fixture="fixtureWithStats"
          :stat="stat"
          :location="location"
        >
        </StatsComparison>
      </div>
    </div>
  </div>
</template>

<script>
import Corners from "~/components/partials/stats/Corners";
import Goals from "~/components/partials/stats/Goals";
import Cards from "~/components/partials/stats/Cards";
import H2H from "~/components/partials/stats/H2H";
import StatsComparison from "~/components/partials/stats/StatsComparison";
export default {
  props: {
    fixture: Object,
    type: String,
    stats: Object,
    stat: String,
    submenu: String,
    location: Object,
  },
  data() {
    return {
      statOptions: ["General", "Goals", "Half", "Corners", "Cards", "H2H"],
    };
  },
  computed: {
    fixtureWithStats() {
      if (this.type == "all") {
        return this.fixture;
      }
      return {
        ...this.fixture,
        home: this.stats.home[this.type],
        away: this.stats.away[this.type],
      };
    },
  },
  components: {
    Corners,
    Cards,
    H2H,
    Goals,
    StatsComparison,
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";
@import "~assets/scss/breakpoints";
.mr-sticky {
  background: $light;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 2;
}
</style>
