<template>
  <div v-if="fixture.h2h_aggregate">
    <div v-for="group in h2h_groups" :key="group.key" class="mb-4">
      <h4 class="stat-header mb-2 text-grey text-center">
        {{ group.label }}
      </h4>
      <div v-for="item in group.items" :key="item.col">
        <div class="spaced">
          <h4>
            {{ item.title }}
          </h4>
          <h4 :class="'text-' + getVariant(getVal(item.col))">
            {{ getVal(item.col) }}%
          </h4>
        </div>
        <div class="mb-3">
          <b-progress
            :value="getVal(item.col)"
            :max="100"
            class="footy-progress"
            :variant="getVariant(getVal(item.col))"
          ></b-progress>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="my-4 text-center text-grey">No H2H data for these teams</div>
  </div>
</template>

<script>
export default {
  props: {
    fixture: Object,
  },

  data() {
    return {
      h2h_groups: [
        {
          key: "last_5.goals",
          label: "Total Goals (Last 5 Matches)",
          items: [
            {
              col: "last_5.o15_goals_h2h_per",
              title: "+1.5 Goals %",
            },
            {
              col: "last_5.o25_goals_h2h_per",
              title: "+2.5 Goals %",
            },
            {
              col: "last_5.o35_goals_h2h_per",
              title: "+3.5 Goals %",
            },
          ],
        },
        {
          key: "last_10.goals",
          label: "Total Goals (Last 10 Matches)",
          items: [
            {
              col: "last_10.o15_goals_h2h_per",
              title: "+1.5 Goals %",
            },
            {
              col: "last_10.o25_goals_h2h_per",
              title: "+2.5 Goals %",
            },
            {
              col: "last_10.o35_goals_h2h_per",
              title: "+3.5 Goals %",
            },
          ],
        },
        {
          key: "last_5.goals_1h",
          label: "1H Goals (Last 5 Matches)",
          items: [
            {
              col: "last_5.o05_goals_1h_h2h_per",
              title: "+0.5 1H Goals %",
            },
            {
              col: "last_5.o15_goals_1h_h2h_per",
              title: "+1.5 1H Goals %",
            },
          ],
        },
        {
          key: "last_10.goals_1h",
          label: "1H Goals (Last 10 Matches)",
          items: [
            {
              col: "last_10.o05_goals_1h_h2h_per",
              title: "+0.5 1H Goals %",
            },
            {
              col: "last_10.o15_goals_1h_h2h_per",
              title: "+1.5 1H Goals %",
            },
          ],
        },
        {
          key: "last_5.goals_2h",
          label: "2H Goals (Last 5 Matches)",
          items: [
            {
              col: "last_5.o05_goals_2h_h2h_per",
              title: "+0.5 2H Goals %",
            },
            {
              col: "last_5.o15_goals_2h_h2h_per",
              title: "+1.5 2H Goals %",
            },
          ],
        },
        {
          key: "last_10.goals_2h",
          label: "2H Goals (Last 10 Matches)",
          items: [
            {
              col: "last_10.o05_goals_2h_h2h_per",
              title: "+0.5 2H Goals %",
            },
            {
              col: "last_10.o15_goals_2h_h2h_per",
              title: "+1.5 2H Goals %",
            },
          ],
        },

        {
          key: "corners",
          label: "Corners",
          items: [
            {
              col: "o75_corners_h2h_per",
              title: "+7.5 Corners %",
            },
            {
              col: "o85_corners_h2h_per",
              title: "+8.5 Corners %",
            },
            {
              col: "o95_corners_h2h_per",
              title: "+9.5 Corners %",
            },
            {
              col: "o105_corners_h2h_per",
              title: "+10.5 Corners %",
            },
          ],
        },
        {
          key: "corners_1h",
          label: "1H Corners",
          items: [
            {
              col: "o35_corners_1h_h2h_per",
              title: "+3.5 1H Corners % ",
            },
            {
              col: "o45_corners_1h_h2h_per",
              title: "+4.5 1H Corners % ",
            },
            {
              col: "o55_corners_1h_h2h_per",
              title: "+5.5 1H Corners % ",
            },
          ],
        },
        {
          key: "cards",
          label: "Cards",
          items: [
            {
              col: "o35_cards_h2h_per",
              title: "+3.5 Cards %",
            },
            {
              col: "o45_cards_h2h_per",
              title: "+4.5 Cards %",
            },
            {
              col: "o55_cards_h2h_per",
              title: "+5.5 Cards %",
            },
          ],
        },
        {
          key: "others",
          label: "Others",
          items: [
            {
              col: "most_goals_1h_h2h_per",
              title: "More goals in 1H than 2H %",
            },
            {
              col: "most_goals_2h_h2h_per",
              title: "More Goals in 2H than 1H %",
            },
            {
              col: "btts_or_o25_h2h_per",
              title: "BTTS or Over 2.5 Goals %",
            },
          ],
        },
        {
          key: "last_5.others",
          label: "Others (Last 5 Matches)",
          items: [
            {
              col: "last_5.no_goals_1h_h2h_per",
              title: "0-0 (1H) %",
            },
            {
              col: "last_5.btts_o25_h2h_per",
              title: "BTTS & Over 2.5 Goals %",
            },
            {
              col: "last_5.btts_h2h_per",
              title: "BTTS %",
            },
          ],
        },
        {
          key: "last_10.others",
          label: "Others (Last 10 Matches)",
          items: [
            {
              col: "last_10.no_goals_1h_h2h_per",
              title: "0-0 (1H) %",
            },
            {
              col: "last_10.btts_o25_h2h_per",
              title: "BTTS & Over 2.5 Goals %",
            },
            {
              col: "last_10.btts_h2h_per",
              title: "BTTS %",
            },
          ],
        },
      ],
    };
  },

  computed: {
    h2h_stats() {
      return this.$flattenObject(this.fixture.h2h_aggregate);
    },
  },
  methods: {
    getVal(key) {
      var value = this.h2h_stats[key];
      if (value != null) {
        return value.toFixed(2);
      } else {
        return "N/A";
      }
    },

    getVariant(value) {
      if (value == "N/A" || value < 33) {
        return "danger";
      } else if (value < 66) {
        return "warning";
      } else {
        return "success";
      }
    },
  },
};
</script>

<style>
.spaced {
  display: flex;
  justify-content: space-between;
}
</style>
