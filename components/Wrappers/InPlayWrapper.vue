<template>
  <div class="in-play-wrapper ">
    <div
      class="wrapper in-play-wrapper-item"
      v-for="(item, field) in fields"
      :key="field"
    >
      <div class="title">{{ item.label }}</div>
      <div class="in-play">
        <div class="stat" :class="home[field] > away[field] ? 'active' : ''">
          <transition name="slide-fade" mode="out-in">
            <span :key="home[field]">
              {{ home[field] }}
            </span>
          </transition>
        </div>
        <div class="stat mx-1">-</div>
        <div class="stat" :class="away[field] > home[field] ? 'active' : ''">
          <transition name="slide-fade" mode="out-in">
            <span :key="away[field]">
              {{ away[field] }}
            </span>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    fixture: Object
  },
  data() {
    return {
      fields: {
        corners: {
          label: "Corners"
        },
        shots: {
          label: "Total Shots"
        },
        shots_on_target: {
          label: "Shots On Target"
        },
        shots_off_target: {
          label: "Shots Off Target"
        },
        momentum: {
          label: "Momentum"
        },
        attacks: {
          label: "Attacks"
        },
        dangerous_attacks: {
          label: "Dangerous Attacks"
        },

        yellowcards: {
          label: "Yellow Cards"
        },
        redcards: {
          label: "Red Cards"
        },
        possession: {
          label: "Possession"
        },

        fouls: {
          label: "Fouls"
        }
      }
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
@import "~/assets/scss/colors";
.in-play-wrapper {
  display: flex;
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for <2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.in-play-wrapper-item {
  padding: 14px !important;
  .title {
    font-weight: bold !important; //COLFAX
    font-size: 10px;
    line-height: 15px;

    display: flex;
    align-items: center;

    color: $dark-1;
  }
  .in-play {
    display: flex;

    align-items: center;
    width: 100px;
    justify-content: center;
    .stat {
      align-items: center;
      //z-index: 10;
      height: 100%;
      //padding: 2px 5px;
      background: #ffffff0d;
      font-weight: bold !important; //COLFAX
      font-size: 14px;
      line-height: 21px;
      color: #60685f;
      &.active {
        color: #60b15a;
        // z-index: 20;
      }
      &:first-child {
        margin-right: 2px;
      }

      &:first-child {
        text-align: right;
      }
      &:nth-child(2) {
        text-align: center;
      }
      &:last-child {
        text-align: left;
      }
    }
  }
}
</style>
