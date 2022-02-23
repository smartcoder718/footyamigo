<template>
  <div class="stick-bottom-right">
    <b-dropdown
      variant="primary"
      no-caret
      toggle-class="footy-scroller-button "
      v-model="selected_scroller"
    >
      <template #button-content>
        <KeyboardIcon class="icon-left" />
        {{ scrollerLabels[selected_scroller] }}
      </template>
      <b-dropdown-item
        v-for="scroller in scrollerOptions"
        :key="scroller.value"
        @click="selected_scroller = scroller.value"
        ><div class="dropdown-content d-flex align-items-center">
          <span class="material-icons icon-left"> keyboard </span>
          <span class="text">
            {{ scroller.text }}
          </span>
        </div></b-dropdown-item
      >
    </b-dropdown>
  </div>
</template>

<script>
export default {
  props: {
    value: String,
  },
  data() {
    return {
      scrollerOptions: [
        { value: "stats_scroller", text: "Stats", title: "Stats" },
        { value: "in_play_scroller", text: "In-Play", title: "Win" },
        { value: "odds_scroller", text: "Odds", title: "Odds" },
        { value: "peak_odds_scroller", text: "Peak Odds", title: "Peak Odds" },
        {
          value: "probability_scroller",
          text: "Probability",
          title: "Probability",
        },
      ],
    };
  },
  computed: {
    selected_scroller: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    scrollerLabels() {
      return Object.assign(
        {},
        ...this.scrollerOptions.map((option) => {
          return {
            [option.value]: option.text,
          };
        })
      );
    },
  },
};
</script>

<style>
.stick-bottom-right {
  position: fixed;
  bottom: 40px;
  right: 50px;
}
</style>
