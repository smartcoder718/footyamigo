<template>
  <div
    class="wrapper cards-wrapper d-none d-lg-flex row-gap-10"
    id="cards-wrapper"
    v-if="fixture.stats"
  >
    <Cards :fixture="fixture" />
  </div>
</template>

<script>
import Cards from "./Cards";
export default {
  props: {
    liveMode: Boolean,
    fixture: Object
  },
  components: {
    Cards
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";
.blind {
  opacity: 0;
  // display: none !important;
}

.yellow-red {
  font-style: normal;
  font-weight: bold !important; //COLFAX
  font-size: 11px;
  display: flex;
  line-height: 16px;
  .soccer-card {
    width: 12px !important;
    height: 16px !important;
    border-radius: 2px;
    margin: 1.5px;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      padding-left: 1px;
      padding-top: 4px;
      display: flex;
      align-items: center;
    }
    &.yellow-card {
      background: $yellow;

      //margin-right: 2px;
    }
    &.red-card {
      background: $red;
      color: white;

      //margin-left: 2px;
    }
  }
}
.cards-wrapper {
  position: sticky;
  left: 0;
  background: #fff;
}
</style>
