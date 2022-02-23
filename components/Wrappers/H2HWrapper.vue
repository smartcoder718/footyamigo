<template>
  <div class="d-flex">
    <div
      class="h2h-wrapper wrapper"
      v-for="item in h2h_scroller"
      :item="item"
      :key="item.title"
    >
      <div class="h2h-label">{{ item.title }}</div>

      <div v-if="h2h_aggregate" class="h2h-value">
        <b-badge
          :variant="$getColor(h2h_aggregate[item.col])"
          class="footy-badge h2h-badge text-white"
          ><span class="h-6">
            {{ h2h_aggregate[item.col] | formatVal }} %</span
          >
        </b-badge>
      </div>
      <div class="stat" v-else>-</div>
    </div>
  </div>
</template>

<script>
import h2h_scroller from "~/components/json/h2h-scroller.json";
export default {
  props: {
    fixture: Object,
  },
  data() {
    return {
      h2h_scroller,
    };
  },
  computed:{
    h2h_aggregate() {
      return this.$flattenObject(this.fixture.h2h_aggregate)
    }
  },
  filters: {
    formatVal(value) {
      if (value != null) {
        return value
      } else {
        return "NA";
      }
    },
  },
};
</script>

<style lang="scss">
@import "~assets/scss/breakpoints";
@import "~/assets/scss/colors";
.h2h-badge {
  min-width: 80px;
  width: 100%;
  .h-6 {
    font-size: 14px;
    line-height: 21px;
  }
}
.h2h-wrapper {
  border-right: none;
  padding-left: 16px;
  .h2h-label {
    font-size: 12px;
    line-height: 18px;
    display: flex;
    font-weight: 500;
    align-items: center;
    color: $dark-1;
  }

  .h2h-value {
    align-items: center;
    font-size: 14px;
    line-height: 21px;
    color: #60685f;
    max-width: 100%;
    width: 100%;
    margin-top: 4px;
  }

  margin-left: 15px;
  margin-right: 15px;

  padding: 0px !important;
  border: none !important;
  align-items: flex-start !important;
  &.active {
    margin-right: 16px;
    max-width: 100px !important;
  }
}
@media (max-width: $lg) {
  .h2h-wrapper {
    margin-right: 20px;
    &:first-child {
      margin-left: 16px;
    }
  }
}
</style>
