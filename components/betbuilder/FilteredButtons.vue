<template>
  <b-col cols="12">
    <div class="filter-buttons column-gap-10">
      <template v-for="(market, i) in markets">
        <b-button
          class="filter-button"
          :class="{ active: market.value === selectedMarket }"
          :key="i"
          style="font-weight:500"
          
          @click="selectedMarket = market"
        >
          {{ market.text }}
        </b-button>
      </template>
    </div>
  </b-col>
</template>

<script>
export default {
  props: {
    markets: Array,
    value: String
  },
  computed: {
    selectedMarket: {
      get() {
        return this.value;
      },
      set(market) {
        this.$emit("input", market.value);
        // console.log(market);
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
