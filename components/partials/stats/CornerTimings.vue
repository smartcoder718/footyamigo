<template>
  <div class=" d-flex flex-col row-gap-20">
    <footy-chart
      :homeData="makeData('home')"
      :awayData="makeData('away')"
      :fixture="fixture"
      :format="format"
      :half="half"
      :type="type"
    />

    <footy-radio
      :options="formatOptions"
      name="format-options"
      v-model="format"
      label="Format"
    >
    </footy-radio>
    <footy-radio
      :options="typeOptions"
      name="type-options"
      v-model="type"
      label="Type"
    >
    </footy-radio>
    <footy-radio
      :options="halfOptions"
      name="half-options"
      v-model="half"
      label="Half"
    >
  </footy-radio>


  </div>
</template>

<script>
import FootyChart from "~/components/common/FootyChart.vue";
import timingsMaker from "./timingsMaker";
export default {
  props: {
    fixture: Object
  },
  components: { FootyChart },
  data: () => ({
    format: "_per",
    type: "total",
    half: "first",
    formatOptions: [
      { text: "Percentage", value: "_per" },
      { text: "Totals", value: "" }
    ],
    typeOptions: [
      { text: "All", value: "total" },
      { text: "For", value: "for" },
      { text: "Against", value: "against" }
    ],
    halfOptions: [
      { text: "First", value: "first" },
      { text: "Second", value: "second" },
      { text: "All", value: "all" }
    ]
  }),
  methods: {
    makeData(team) {
      return timingsMaker(
        this.fixture[team].corner_timings_for,
        this.fixture[team].corner_timings_against,
        this.fixture[team].corner_timings_all
      );
    }
  }
};
</script>

<style lang="scss">
.chart-description {
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  color: #60685f;
}
</style>
