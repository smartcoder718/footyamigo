<template>
  <b-dropdown
    variant="light"
    no-caret
    right
    dropdown
    no-flip
    class="footy-league-status d-none"
    offset="20"
    toggle-class="league-status-btn text-warning"
    menu-class="shadow-sm p-0"
    ref="dropdown"
  >
    <template slot="button-content">
      <LeagueIcon />
      League Stats
    </template>
    <b-dropdown-item class="">
      <b-row cols="2">
        <b-col v-for="item,index in items" :key="index">
          <b-button>
            {{ item.label }}
          </b-button>
        </b-col>
      </b-row>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
export default {
  props: {
    text: String,
    icon: String,
    fixtures: Array,
    value: null
  },
  data() {
    return {
      items: [
        { key: "progress", label: "Progress" },
        { key: "total_goals", label: "Total Goals" },
        { key: "btts", label: "BTTS %" },
        { key: "total_goals_avg", label: "Goals PG" },
        { key: "total_corners_avg", label: "Corners PG" },
        { key: "total_corners_avg", label: "Cards PG" },
        { key: "home_goals_avg", label: "AVG Home Goals" },
        { key: "away_goals_avg", label: "AVG Away Goals" },
        { key: "mins_per_goal", label: "Mins / Goal" },
        { key: "win_per", label: "Win %" },
        { key: "home_win_per", label: "Home Win %" },
        { key: "away_win_per", label: "Away Win %" },
        { key: "o05_goals", label: "+0.5 Goals" },
        { key: "o15_goals", label: "+1.5 Goals" },
        { key: "o25_goals", label: "+2.5 Goals" },
        { key: "o35_goals", label: "+3.5 Goals" },
        { key: "o45_goals", label: "+4.5 Goals" },
        { key: "o55_goals", label: "+5.5 Goals" }
      ]
    };
  },
  components: {}
};
</script>

<style lang="scss">
@import "~assets/scss/breakpoints";
</style>
