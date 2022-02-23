<template>
  <div class="mobile-wrapper d-flex flex-column d-lg-none">
    <!-- <div class="teams-container d-flex align-items-center">
      <teams-container :fixture="fixture"></teams-container>
    </div> -->
    <div class="all-container d-flex align-items-center">
      <div class="time-container d-flex align-items-center" v-if="liveMode">
        <div class="timer mx-1  text-primary">{{ fixture.minute }}'</div>
        <div class="half mx-1 text-light-mobile">
          {{ fixture.minute | whichHalf }}
        </div>
      </div>
      <div class="time-container">
        <fixture-timings
          :fixture="fixture"
          :liveMode="liveMode"
          :hideDate="hideDate"
          :isWin="isWin"
        ></fixture-timings>
      </div>
      <div class="cards-container d-flex" v-if="fixture.stats">
        <Cards :fixture="fixture" />
      </div>
    </div>
  </div>
</template>

<script>
import TeamsContainer from "./TeamsWrapper/TeamsContainer.vue";
import FixtureTimings from "./TeamsWrapper/FixtureTimings.vue";
import Cards from "./Cards";
export default {
  components: { TeamsContainer, FixtureTimings, Cards },
  props: {
    liveMode: Boolean,
    fixture: Object,
    hideDate: Boolean,
    isWin: { type: Boolean, default: null }
  },

  filters: {
    whichHalf(value) {
      return Number(value) < 46 ? "1st Half" : "2nd Half";
    }
  }
};
</script>

<style lang="scss">
.mobile-wrapper {
  .teams {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
  }
  .team-name {
    display: flex;
    align-items: center;
    margin: 4px;
  }
  .text {
    font-weight: 600;
    font-size: 16px !important;
    line-height: 24px !important;
    display: flex;
    align-items: center;
    color: #222622 !important;
    white-space: nowrap;
  }
  .text-light-mobile {
    font-weight: 600;
    font-size: 14px;
    line-height: 21px;
    display: flex;
    align-items: center;
    color: #60685f !important;
  }
  .time-container {
    .fixture-timings {
      display: flex;
      align-items: center;
      span {
        &:nth-child(2),
        &:last-child {
          margin: 0 4px;
        }
      }
    }
  }
}
</style>
