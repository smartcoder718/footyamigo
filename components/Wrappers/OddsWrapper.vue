<template>
  <div class="odds-wrapper wrapper">
    <div class="title">{{ item.title }}</div>
    <div class="stats">
      <div v-if="odds" class="stat">
        <span class="h-6"> {{ odds[item.col] | TwoDecimal }}</span>
      </div>
      <div class="stat" v-else>-</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    fixture: Object,
    liveMode: Boolean
  },
  data() {
    return {
      showing_live: false
    };
  },
  computed: {
    odds() {
      if (this.liveMode && this.fixture.live_odds) {
        this.showing_live = true;
        return this.fixture.live_odds;
      } else {
        return this.fixture.pre_odds;
      }
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";
.odds-wrapper {
  padding: 14px;
  .title {
    font-weight: bold; //COLFAX
    font-size: 10px;
    line-height: 15px;

    display: flex;
    align-items: center;

    color: $dark-1;
  }
  .stats {
    display: flex;

    align-items: center;
    width: 60px;
    justify-content: center;
    .stat {
      align-items: center;
      //z-index: 10;
      height: 100%;
      //padding: 2px 5px;
      background: #ffffff0d;
      font-weight: bold; //COLFAX
      font-size: 14px;
      line-height: 21px;
      color: #60685f;
    }
  }
}
</style>
