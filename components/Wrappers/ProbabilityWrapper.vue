<template>
  <div class="probability-wrapper wrapper" :class="{ active: mini }">
    <div class="probability-label">{{ item.title }}</div>

    <div v-if="fixture.probability" class="probability-value">
      <b-badge
        :variant="$getColor(fixture.probability[item.col])"
        class="footy-badge probability-badge text-white"
        ><span class="h-6"> {{ fixture.probability[item.col] | formatVal }} %</span>
      </b-badge>
    </div>
    <div class="stat" v-else>-</div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    fixture: Object,
    short: Boolean,
    mini: Boolean
  },
  filters: {
    formatVal(value) {
      if (value != null) {
        return value.toFixed(2);
      } else {
        return "-";
      }
    }
  }
};
</script>

<style lang="scss">
@import "~assets/scss/breakpoints";
@import "~/assets/scss/colors";
.probability-badge {
  min-width: 80px;
  width: 100%;
  .h-6 {
    font-size: 14px;
    line-height: 21px;
  }
}
.probability-wrapper {
  border-right: none;
  padding-left: 16px;
  .probability-label {
    font-size: 12px;
    line-height: 18px;
    display: flex;
    font-weight: 500;
    align-items: center;
    color: $dark-1;
  }

  .probability-value {
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
  .probability-wrapper {
    margin-right: 20px;
    &:first-child {
      margin-left: 16px;
    }
  }
}
</style>
