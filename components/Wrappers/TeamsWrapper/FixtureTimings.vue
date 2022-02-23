<template>
  <div class="fixture-timings" v-if="!hideDate">
    <span class="mr-2 text-light-mobile" v-if="fixture.status == 'FT'"
      >{{ fixture.ft_score }} FT
      {{ fixture.ht_score ? ", " + fixture.ht_score + " HT" : "" }}
    </span>

    <span class="mr-2 text-light-mobile" v-else-if="!liveMode">{{
      $moment(fixture.timestamp * 1000).format("LT")
    }}</span>

    <span class="text-light-mobile"
      >{{ nth(fixture.home_position) }} v {{ nth(fixture.away_position) }}</span
    >
    
    <span v-if="isWin != null" class="mx-2">
      <small class="text-primary font-weight-bold" v-if="isWin">WIN</small>
      <small class="text-danger font-weight-bold" v-else>LOSE</small>
    </span>
  </div>
</template>

<script>
export default {
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

<style lang="scss" scoped></style>
