<template>
  <div class="pick-stat-wrapper">
    <div class="pick-stat">
      <div class="pick-stat-icon">
        <TimerIcon />
      </div>
      <div class="pick-stat-content">
        <div class="stat-label">
          Timer
        </div>
        <div
          v-if="pick.missed"
          class="text-danger small"
          style="max-width: 120px;"
        >
          Alert missed due to telegram api limit issue
          <span
            v-b-popover.hover.top="
              'Alert missed due to telegram API limits. We are working on resolving these limits ASAP.'
            "
            class="material-icons-outlined text-danger mx-1"
            style="font-size: 14px"
          >
            info
          </span>
        </div>
        <template v-else>
          <div v-if="pick.type == 'pre-match'">
            {{ pick.minute }} mins before kickoff
          </div>
          <div v-else>{{ pick.minute }}’</div>
          <div>
            {{
              $moment
                .utc(
                  pick.sending_time ? pick.sending_time * 1000 : pick.updated_at
                )
                .local()
                .format("LT")
            }}
          </div>
          <div>
            {{
              $moment
                .utc(
                  pick.sending_time ? pick.sending_time * 1000 : pick.updated_at
                )
                .local()
                .fromNow()
            }}
          </div>
        </template>
      </div>
    </div>

    <div class="pick-stat">
      <div class="pick-stat-icon">
        <BallIcon />
      </div>
      <div class="pick-stat-content">
        <div class="stat-label">
          Score
        </div>
        <div>{{ pick.goals }}</div>
        <div>{{ pick.ht_score || "---" }} {{ pick.ht_score ? "HT" : "" }}</div>
        <div>{{ pick.ft_score || "---" }} {{ pick.ft_score ? "FT" : "" }}</div>
      </div>
    </div>

    <div class="pick-stat">
      <div class="pick-stat-icon">
        <FlagIcon />
      </div>
      <div class="pick-stat-content">
        <div class="stat-label">
          Corners
        </div>
        <div>{{ pick.corners }}</div>
        <div>
          {{ pick.ht_corner || "---" }} {{ pick.ht_corner ? "HT" : "" }}
        </div>
        <div>
          {{ pick.ft_corner || "---" }} {{ pick.ft_corner ? "FT" : "" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pick: Object
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";
@import "~/assets/scss/breakpoints";
.pick-stat-wrapper {
  display: flex;

  flex-wrap: nowrap;
  height: 100%;
  column-gap: 12px;
  align-items: center;
  scroll-behavior: smooth;
  justify-content: space-evenly;
  flex-grow: 1;
  align-items: flex-start;
  .pick-stat {
    display: flex;
    column-gap: 7.33px;
    // flex: 1;

    .pick-stat-icon {
      display: flex;
    }
    .pick-stat-content {
      display: flex;
      flex: 1;
      flex-direction: column;
      .stat-label {
        color: $dark-1;
        display: flex;
        align-items: center;
        position: relative;
        .material-iconss {
          font-size: 14px;

          font-style: normal;

          margin-left: -17px;
          position: absolute;
          left: 0;
          top: 10;
        }
      }

      // width: 150px;
      // margin-left: 25px;
      // margin-right: 25px;
      font-style: normal;

      font-size: 12px;
      line-height: 18px;

      color: #60685f;
    }
  }
}

@media screen and (max-width: $lg) {
  .pick-stat-wrapper {
    .pick-stat {
      flex: auto;
      .pick-stat-icon {
      }
    }
  }
}
</style>
