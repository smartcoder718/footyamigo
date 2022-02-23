<template>
  <footy-filter-dropdown-multiple
    :options="settingOptions"
    v-model="selected_settings"
    svgicon="SettingsIcon"
    text="Settings"
  >
  </footy-filter-dropdown-multiple>
</template>

<script>
export default {
  props: {
    value: Array
  },
  computed: {
    selected_settings: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  data() {
    return {
      settingOptions: [
        {
          text: "Sort By Time",
          value: "sort_by_time",
          active: true
        },
        {
          text: "FT Results",
          value: "ft_results",
          active: false
        },
        {
          text: "Upcoming",
          value: "upcoming",
          active: false
        }
        // {
        //   text: "Odds Required",
        //   value: "odds_required",
        //   active: false,
        //   disabled: true
        // },
        // {
        //   text: "Has Corner Markets",
        //   value: "has_corner_markets",
        //   active: false,
        //   disabled: true
        // },
        // {
        //   text: "Has Card Markets",
        //   value: "has_cards_markets",
        //   active: false,
        //   disabled: true
        // }
      ]
    };
  }
};
</script>

<style></style>
