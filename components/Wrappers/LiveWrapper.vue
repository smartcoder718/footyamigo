<template>
  <div class="live-wrapper">
    <div class="wrapper live-wrapper-item" v-for="field in items" :key="field">
      <div :class="{ active: field === 'goals' }">
        <template v-if="home">
          <transition
            name="change-pulse"
            enter-active-class="animate__animated animate__fadeInDown 	"
          >
            <span :key="home[field]">
              {{ home[field] }} {{ field == "possession" ? "" : "" }}
            </span>
          </transition>
        </template>
        <template v-else>
          -
        </template>
      </div>
      <div :class="{ active: field === 'goals' }">
        <template v-if="away">
          <transition
            name="change-pulse"
            enter-active-class="animate__animated animate__fadeInUp 	"
          >
            <span :key="away[field]">
              {{ away[field] }} {{ field == "possession" ? "" : "" }}
            </span>
          </transition>
        </template>
        <template v-else>
          -
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    field: String,
    fixture: Object
  },
  data() {
    return {
      items: [
        "goals",
        "corners",
        "shots_on_target",
        "shots_off_target",
        "possession",
        "momentum",
        "dangerous_attacks"
      ]
    };
  },
  computed: {
    home() {
      return this.fixture.stats.home;
    },
    away() {
      return this.fixture.stats.away;
    }
  }
};
</script>

<style lang="scss">
.live-wrapper {
  display: flex;
  flex-shrink: 0;
}
.live-wrapper-item {
  width: 47px;
  div {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    padding: 4px;
    align-items: center;

    justify-content: center;
    // text-align: center;
    &.active {
      color: #60b15a !important;
    }
  }
}
</style>
