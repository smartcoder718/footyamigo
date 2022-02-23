<template>
  <div class="peak-odds-wrapper wrapper">
    <div class="title">{{ item.title }}</div>
   
    <div class="stats">
      <div v-if="fixture.peak_odds" class="stat">
        <span class="h-6"> {{ fixture.peak_odds[item.col] | TwoDecimal }}</span>
      </div>
      <div class="stat" v-else>-</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    fixture: Object
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";
.peak-odds-wrapper {
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
