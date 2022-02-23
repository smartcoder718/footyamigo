<template>
  <div
    class="pick-wrapper-container"
    :class="
      pick.strike == true
        ? 'hit-pick'
        : pick.strike == false
        ? 'miss-pick'
        : 'blank-pick'
    "
  >
    <div class="pick-wrapper-and-stats-button">
      <TeamsWrapper :fixture="pick" hideDate @click="$emit('showstats')">
      </TeamsWrapper>
      <div class="pick-wrapper" :id="'pick-' + pick.id">
        <StrikeWrapper :pick="pick" @deletepick="$emit('deletepick')">
        </StrikeWrapper>
        <PickStatWrapper :pick="pick"> </PickStatWrapper>
      </div>

      <b-button
        @click="$emit('showstats')"
        class="footy-button pick-wrapper-stats-button "
        v-if="statshidden"
        >Stats
      </b-button>
    </div>
  </div>
</template>

<script>
import TeamsWrapper from "~/components/Wrappers/TeamsWrapper.vue";
import StrikeWrapper from "./PickWrapperItems/StrikeWrapper.vue";
import PickStatWrapper from "./PickWrapperItems/PickStatWrapper.vue";
export default {
  props: {
    pick: Object,
    statshidden: Boolean
  },
  components: {
    TeamsWrapper,
    StrikeWrapper,
    PickStatWrapper
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";
@import "~/assets/scss/breakpoints";

.pick-wrapper-container {
  border: 1px solid #f0f1f0;
  background: white;
  margin-bottom: 4px;
  font-weight: 500;
  &.hit-pick {
    background: #fafffa;
    box-shadow: inset 4px 0 0 0 #60b15a;
  }
  &.miss-pick {
    background: #fff7f5;
    box-shadow: inset 4px 0 0 0 #fc4c34;
  }
  &.blank-pick {
  }
  .pick-wrapper {
    display: flex;
    align-items: center;
    flex: 1;
    // gap: 16px;
  }
  .pick-wrapper-and-stats-button {
    display: flex;
    align-items: center;
    flex: 1;
    row-gap: 16px;
    .pick-wrapper-stats-button {
      margin: 0px 10px;
    }
  }
}

@media screen and (max-width: $lg) {
  .pick-wrapper-and-stats-button {
    flex-direction: column;
    padding: 12px 16px;

    .pick-wrapper-stats-button {
      width: 100%;
      margin: auto;
    }
  }
  .pick-wrapper-container {
    .pick-wrapper {
      flex-direction: column-reverse;
      align-items: stretch;
      width: 100%;
      display: flex;
    }
    border-radius: 4px;
    border-left: 1px solid #f0f1f0 !important;
    &.hit-pick {
      box-shadow: inset 0 4px 0 0 #60b15a;
    }
    &.miss-pick {
      box-shadow: inset 0 4px 0 0 #fc4c34;
    }
  }
}
</style>
