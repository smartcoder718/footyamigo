<template>
  <div class="wrapper timer-wrapper d-none d-lg-flex" v-if="liveMode">
    <transition name="slide-fade" mode="out-in">
      <div class="timer text-primary" :key="fixture.minute">
        {{ fixture.minute }}'
      </div>
    </transition>

    <!-- <div class="timer">{{ fixture.minute }}'</div> -->


    <div class="half">
      {{ fixture.minute | whichHalf }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    liveMode: Boolean,
    fixture: Object
  },
  filters: {
    whichHalf(value) {
      return Number(value) < 46 ? "1st Half" : "2nd Half";
    }
  }
};
</script>

<style lang="scss">
@import "~assets/scss/colors";
.timer-wrapper {
  font-weight: bold !important; //COLFAX
  font-size: 12px;
  line-height: 18px;
  color: #60685f;
  width: 80px;
  text-align: center;
}
</style>
