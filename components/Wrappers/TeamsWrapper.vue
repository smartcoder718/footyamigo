<template>
  <div class="teams-wrapper " id="teams-wrapper">
    <fixture-timings
      class="d-none d-lg-block"
      :fixture="fixture"
      :liveMode="liveMode"
      :hideDate="hideDate"
      :isWin="isWin"
    ></fixture-timings>
    <teams-container :fixture="fixture"></teams-container>
  </div>
</template>

<script>
import TeamsContainer from "./TeamsWrapper/TeamsContainer.vue";
import FixtureTimings from "./TeamsWrapper/FixtureTimings.vue";

export default {
  components: { TeamsContainer, FixtureTimings },
  props: {
    liveMode: Boolean,
    fixture: Object,
    hideDate: Boolean,
  isWin: { type: Boolean, default: null }
  },
  methods: {
    nth(n) {
      n = parseInt(n);
      if (isNaN(n)) {
        return "Na";
      }
      var s = ["th", "st", "nd", "rd"],
        v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }
  }
};
</script>

<style lang="scss">
@import "~assets/scss/breakpoints";
.teams-wrapper {
  border-right: none !important;
  align-items: flex-start !important;
  width: 249px;

  padding-left: 16px;
  padding-right: 16px;
  white-space: nowrap;
  overflow: hidden;
  // position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  .fixture-timings {
    > span {
      font-style: normal;
      font-weight: 600;
      font-size: 11px;
      line-height: 16px;
      color: #60685f;
    }
  }
  .team-name {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    h6 {
      margin: 0;
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;

      text-overflow: ellipsis;
    }
  }
}

@media screen and (max-width: $lg) {
  .teams-wrapper {
    width: 100%;
    padding-left: 0px;
    padding-right: 0px;
    flex-direction: column;
    .fixture-timings {
      order: 2;
    }
    .teams {
      display: flex;
      align-items: center;
      .team-name {
        &:first-child {
          margin-left: 0px;
        }
        // margin-left: 8px;
      }
    }
  }
}
</style>
