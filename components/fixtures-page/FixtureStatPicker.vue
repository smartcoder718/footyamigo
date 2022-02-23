<template>
  <footy-filter-dropdown
    :options="options"
    v-model="selected_stat"
    svgicon="StatsIcon"
    text="Stats"
    :showuse="true"
  >
  </footy-filter-dropdown>
</template>

<script>
export default {
  props: {
    value: String,
  },
  computed: {
    selected_stat: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },

  data() {
    return {
      options: [
        // {
        //   text: "Default(Yours)",
        //   value: "default"
        // },
        {
          text: "FT Result",
          value: "ft_result",
        },
        {
          text: "BTTS",
          value: "btts",
        },
        {
          text: "Overs",
          value: "overs",
        },
        {
          text: "Total Corners",
          value: "corners_total",
        },
        {
          text: "1H Corners",
          value: "corners_1h",
        },
        {
          text: "1H Goals",
          value: "goals_1h",
        },
        {
          text: "2H Goals",
          value: "goals_2h",
        },
        {
          text: "Total Cards",
          value: "cards_total",
        },
        {
          text: "Cards by Half",
          value: "cards_half",
        },
        {
          text: "H2H",
          value: "h2h",
        },
      ],
    };
  },
};
</script>

<style></style>
