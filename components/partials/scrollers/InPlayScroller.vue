<template>
  <div v-if="fixture">
    <div class="overflow-hidden">
      <Playground :fixture="fixture" :events="events" :key="fixture.timer">
      </Playground>
      <!-- 
      <div class="mt-3">
        <h4>
          New Version
        </h4>
        <PlaygroundNew :fixture="fixture"> </PlaygroundNew>
      </div> -->

      <div class="play-stats mt-2">
        <div class="single-event">{{ eventTitle }}</div>
      </div>
      <!---->
      <!-- <div v-for="(fixtureStat, i) in fixtureStats" :key="i">

            {{fixture[fixtureStat.fixtureField]}}
          </div> -->
    </div>

    <b-row no-gutters>
      <b-col cols="12" class="my-3">
        <div class="accordion" role="tablist">
          <div class="mb-1 summary-container">
            <b-button class="summary-btn" @click="showSummary = !showSummary">
              <span class="text"> Summary </span>
              <span class="material-icons-outlined icon">
                <img :src="`/icons/down.svg?inline`" alt="" />
              </span>
            </b-button>
            <b-collapse
              id="summary"
              accordion="my-accordion"
              role="tabpanel"
              v-model="showSummary"
            >
              <div class="summary-board">
                <div class="single-stat names">
                  <div class="icon"></div>
                  <div class="text">Home</div>
                  <div class="text">Away</div>
                </div>
                <div
                  class="single-stat"
                  v-for="item in summaryItems"
                  :key="item.label"
                >
                  <div class="icon">
                    <span class="material-icons-outlined icon">
                      <img :src="`/icons/${item.icon}.svg?inline`" alt="" />
                    </span>
                  </div>
                  <div class="text">
                    {{ item.home }}
                  </div>
                  <div class="text">
                    {{ item.away }}
                  </div>
                </div>
              </div>

              <div class="summary-extended py-4">
                <template v-for="event in events">
                  <div
                    class="event-wrapper centered my-4"
                    v-if="event.id == halfTimeId"
                    :key="'divider' + event.id"
                  >
                    Score After First Half {{ fixture.ht_score }}
                  </div>
                  <div
                    class="event-wrapper"
                    :key="'event' + event.id"
                    v-if="validEvent(event)"
                    :class="[
                      event.team_id == fixture.home_id
                        ? 'event-home'
                        : 'event-away',
                      'event-' + event.type,
                    ]"
                  >
                    <div class="event-item event-item-value">
                      <span class="text-capitalize">{{
                        event.comment || event.type
                      }}</span>
                      <component
                        :is="icons[event.type]"
                        :class="
                          white_svgs.includes(event.type) ? 'svg-dark' : ''
                        "
                      >
                      </component>
                    </div>
                    <div class="event-time">{{ event.minute }}'</div>
                    <div class="event-item"></div>
                  </div>
                </template>
              </div>
            </b-collapse>
          </div>
        </div>
      </b-col>

      <b-col
        cols="12"
        v-show="!showSummary"
        class="animate__animated animate___fast"
        :class="[
          !showSummary ? 'animate___slideInUp' : 'animate___slideOutDown',
        ]"
      >
        <div class="centered mb-3">
          <!-- <span style="margin-bottom: 2px">
            <img :src="`/icons/field.svg?inline`" alt="" />
          </span> -->
          <span class="material-icons-outlined text-primary"> flash_on </span>
          <div class="formations d-flex align-items-center">
            <!-- <p v-if="fixture.home_formation && fixture.away_formation">
              Formations: {{ fixture.home_formation || "UNKNOWN" }} |
              {{ fixture.away_formation || "UNKNOWN" }}
            </p> -->
            <h4
              v-if="fixture.stats && fixture.stats.home && fixture.stats.away"
            ></h4>
            LIVE MOMENTUM:
            {{
              isNaN(fixture.stats.home.momentum)
                ? "N/A"
                : fixture.stats.home.momentum
            }}
            |
            {{
              isNaN(fixture.stats.away.momentum)
                ? "N/A"
                : fixture.stats.away.momentum
            }}
          </div>
        </div>
        <div>
          <div class="top-stats my-3">
            <div
              class="top-stat"
              v-for="item in topStats"
              :key="'top-stat' + item.label"
            >
              <div class="title top-stats-title">
                <h3>
                  {{ item.label }} {{ item.label === "Possession" ? " %" : "" }}
                </h3>
              </div>
              <div class="stat-progress centered">
                <span class="value">
                  {{ item.home }}
                </span>
                <radial-progress-bar
                  :diameter="diameter"
                  :completed-steps="item.home"
                  :total-steps="item.overall"
                  innerStrokeColor="#60685F"
                  startColor="#60b15a"
                  stopColor="#60b15a"
                  :isClockwise="false"
                  :strokeWidth="strokeWidth"
                  :innerStrokeWidth="strokeWidth"
                >
                </radial-progress-bar>
                <span class="value">
                  {{ item.away }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <hr />
        </div>
        <div class="bottom-in-play-stats">
          <template v-for="item in bottomStats">
            <div :key="'bottomstat' + item.label">
              <div class="in-play-stat">
                <h4 class="stat-label text-grey">
                  {{ item.label }}
                  <span class="total ml-2">
                    {{ item.overall }}
                  </span>
                </h4>

                <div class="progress-holder position-relative">
                  <div class="left">
                    <p class="stat-value mb-0">
                      {{ item.home }}
                    </p>
                  </div>
                  <span class="progress-divider"> </span>
                  <b-progress :max="100" style="border-radius: 8px; flex: 1">
                    <b-progress-bar
                      :value="item.home_progress"
                      :variant="item.home > item.away ? 'primary' : 'white'"
                    ></b-progress-bar>
                    <b-progress-bar
                      :value="item.away_progress"
                      :variant="item.away > item.home ? 'primary' : 'white'"
                    ></b-progress-bar>
                  </b-progress>

                  <div class="right">
                    <p class="stat-value mb-0">
                      {{ item.away }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </b-col>
    </b-row>

    <!-- <pre>
      <code>
 {{fixture.events}}
      </code>
    </pre> -->
  </div>
</template>

<script>
import RadialProgressBar from "vue-radial-progress";
import Playground from "../../Playground.vue";
import PlaygroundNew from "../../PlaygroundNew.vue";
import CornerIcon from "@/static/icons/playground-corner.svg";
import GoalIcon from "@/static/icons/goal.svg";
import RedcardIcon from "@/static/icons/red.svg";
import YellowcardIcon from "@/static/icons/yellow.svg";
import MomentumChart from "~/components/common/MomentumChart";
export default {
  data() {
    return {
      icons: {
        corner: CornerIcon,
        goal: GoalIcon,
        penalty: GoalIcon,
        redcard: RedcardIcon,
        yellowcard: YellowcardIcon,
        yellowredcard: YellowcardIcon,
      },
      white_svgs: ["goal", "corner", "penalty"],
      showSummary: false,
      halfPast: true,
      top_items: {
        attacks: {
          label: "Attacks",
        },
        dangerous_attacks: {
          label: "Dang. Attacks",
        },
        possession: {
          label: "Possession",
        },
      },
      bottom_items: {
        corners: {
          label: "Corners",
        },
        shots: {
          label: "Total Shots",
        },
        shots_on_target: {
          label: "Shots On Target",
        },
        shots_off_target: {
          label: "Shots Off Target",
        },
        yellowcards: {
          label: "Yellow Cards",
        },
        redcards: {
          label: "Red Cards",
        },
        fouls: {
          label: "Fouls",
        },
      },
      eventTitle: "",
      timeValue: null,
      interval: null,
      fixtureStats: [
        {
          fixtureField: "corner_timings_away",
          field: "corners",
          title: "Away Corner",
          label: "away",
        },
        {
          fixtureField: "corner_timings_home",
          field: "corners",
          title: "Home Corner",
          label: "home",
        },
        {
          fixtureField: "goal_timings_away",
          field: "goals",
          title: "Away Goal",
          label: "away",
        },
        {
          fixtureField: "goal_timings_home",
          field: "goals",
          title: "Home Goal",
          label: "home",
        },
      ],
      statTypes: [
        {
          text: "Summary",
          value: "summary",
        },
        {
          text: "Corners",
          value: "corners",
        },
      ],
      statType: "summary",
      completedSteps: 0,
      totalSteps: 10,
      diameter: 50,
      strokeWidth: 9.15,
      summaries: {
        corners: {
          label: "Corners",
          icon: "corner",
        },

        yellowcards: {
          label: "Yellow Cards",
          icon: "yellow",
        },
        redcards: {
          label: "Red Cards",
          icon: "red",
        },
        substitutions: {
          label: "Substitutions",
          icon: "substitution",
        },

        goals: {
          label: "goals",
          icon: "goals",
        },
        penalties: {
          label: "Penalties",
          icon: "penalties",
        },
      },
    };
  },
  props: {
    fixture: Object,
  },
  components: {
    RadialProgressBar,
    Playground,
    PlaygroundNew,
    MomentumChart,
  },
  computed: {
    bottomStats() {
      return this.formatStats(this.bottom_items);
    },
    topStats() {
      return this.formatStats(this.top_items);
    },
    currentTime() {
      return (this.fixture.minute / 90) * 100;
    },
    stats() {
      return this.fixture.stats;
    },
    events() {
      const events = this.fixture.events || [];
      const corners = this.fixture.corners || [];

      return [
        ...events,
        ...corners.map((corner) => {
          return {
            ...corner,
            type: "corner",
          };
        }),
      ].sort((x, y) => {
        if (x.minute > y.minute) {
          return 1;
        } else if (x.minute < y.minute) {
          return -1;
        } else {
          return 0;
        }
      });
    },
    halfTimeId() {
      for (var event of this.events) {
        if (event.minute > 45) {
          return event.id;
        }
      }
    },

    summaryItems() {
      const vals = Object.keys(this.summaries).map((item) => {
        const home = this.stats.home[item];
        const away = this.stats.away[item];
        const overall = home + away;
        const label = this.summaries[item]["label"];
        const icon = this.summaries[item]["icon"];

        return {
          label,
          home,
          overall,
          away,
          icon,
        };
      });
      return vals;
    },
  },
  methods: {
    toggleEvent(title) {
      this.eventTitle = title;
    },
    verifyWidth() {
      // console.log(window.innerWidth);
      if (window.innerWidth < 768) {
        //this.diameter = 29.5;
        //this.strokeWidth = 5.38;
      }
    },
    validEvent({ type, comment }) {
      const events = [
        "goal",
        "corner",
        "yellowcard",
        "yellowredcard",
        "redcard",
      ];
      if (events.includes(type)) {
        if (!comment || !comment.startsWith("Race")) {
          return true;
        }
      }
    },
    formatStats(items) {
      const vals = Object.keys(items).map((item) => {
        const home = Number(this.stats.home[item]);
        const away = Number(this.stats.away[item]);
        const overall = home + away;
        const home_progress = (home / overall) * 100;
        const away_progress = 100 - home_progress;
        const label = items[item]["label"];
        return {
          label,
          home,
          overall,
          home_progress,
          away_progress,
          away,
          home: isNaN(home) ? "N/A" : home,
          overall: isNaN(overall) ? "N/A" : overall,
          away: isNaN(away) ? "N/A" : away,
        };
      });
      return vals;
    },
  },
  mounted() {
    this.verifyWidth();
  },
};
</script>

<style lang="scss">
@import "~assets/scss/breakpoints";
.play-map {
  display: -webkit-box;
  display: flex;
  background: #303e54;
  height: 40px;
  position: relative;
  background: #60685f;
  border-radius: 4px;
  overflow: hidden;

  .play-progress {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
    // width: 2px;
    background: #60b15a;
    align-self: center;
    height: 24px !important;
    margin: 8px;
    overflow: hidden;
    max-width: calc(98% - 8px);
  }
  .time-gap {
    margin: 0;
    background: #fff;
    z-index: 20;
    font-weight: 600;
    border-radius: 0;
    top: 8px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin: auto;
    bottom: 8px;
    width: 2px;
    padding: 0;
    z-index: 20;
  }
  .events {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 40;
    .event {
      cursor: pointer;
      height: 10px;
      width: 10px;
      position: absolute;
      top: 3px;
      bottom: auto;
      z-index: 20;
      &.away {
        top: auto;
        bottom: 3px;
      }
      &.corners {
        background: url(/events/corners.svg);
        background-size: 10px;
        background-position: 50% 50%;
        background-repeat: no-repeat;
      }
      &.goals {
        background: url(/events/goals.svg);
        background-size: 10px;
        background-position: 50% 50%;
        background-repeat: no-repeat;
      }
    }
  }
}
.formations {
  p {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    text-transform: uppercase;
  }
}
.bottom-in-play-stats {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  font-weight: 500;
}
.in-play-stat {
  column-gap: 40px;
  row-gap: 10px;
  display: flex;
  flex-direction: row;
  //margin-bottom: 30px;
  .stat-label {
    flex: 3;
    text-transform: uppercase;
    font-weight: 600;
    span {
      color: #60b15a;
    }
  }
  /*.stat-label {
    h3 {
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      text-transform: uppercase;
      color: rgba(34, 38, 34, 0.7);

      span {
        color: #60b15a;
      }
    }
  }*/
  .progress-holder {
    display: flex;
    column-gap: 10px;
    flex: 4;
    align-items: center;
    .progress-divider {
      height: 16px;
      background: #222622;
      width: 2px;
      left: 50%;
      position: absolute;
      transform: translateX(-50%);
    }
  }
}
.top-stats {
  display: flex;
  justify-content: space-between;
  .top-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    //flex:1;
    justify-content: center;
    .stat-progress {
      .value {
        min-width: 30px;
      }
    }
    .top-stats-title {
      h3 {
        font-style: normal;
        font-weight: 600;
        font-size: 15px;
        line-height: 24px;
        text-transform: capitalize;
        color: rgba(34, 38, 34, 0.7);
      }
    }
    .value {
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
    }
  }
}
#summary,
.match-summary {
  background: #fff;
  padding: 0px 16px;
  .summary-board {
    border-top: 1px solid #e0e4e0;
    border-bottom: 1px solid #e0e4e0;
    height: 125px;
    padding: 20px 0px;
    box-sizing: border-box;
    display: flex;
    .single-stat {
      flex: 1 1 10%;
      align-items: center;
      justify-content: flex-end;
      flex-direction: column;
      font-weight: 600;
      font-size: 15px;

      > div {
        height: 20px;
        margin-bottom: 10px;
        width: 100%;
        text-align: center;
      }
      &.names {
        > div {
          text-align: left;
        }
      }
      .icon {
        height: 30px;
      }
    }
  }
}
.summary-extended,
.match-summary {
  .event-wrapper {
    display: flex;
    -ms-flex: 0 0 100%;
    flex: 0 0 100%;
    min-height: 32px;
    font-size: 12px;
    -ms-flex-align: stretch;
    align-items: stretch;
    position: relative;
    margin-bottom: 1px;
    font-weight: normal;
    font-size: 15px;
    line-height: 18px;
    .event-item,
    .event-item span {
      font-weight: normal;
      font-size: 15px;
      line-height: 18px;
    }
    .event-goal {
      .event-item,
      .event-item span {
        font-weight: 600 !important;
      }
    }

    .event-item-value {
      column-gap: 12px;
      justify-content: flex-end;
    }
    &.event-home {
      flex-direction: row;
      .event-item-value {
        border-right: 2px solid #c4c4c4;
      }
    }
    &.event-away {
      flex-direction: row-reverse;
      .event-item-value {
        border-left: 2px solid #c4c4c4;
        flex-direction: row-reverse;
      }
    }

    .event-item {
      display: flex;
      flex: 0 1 50%;
      align-items: center;
      padding-left: 12px;
      padding-right: 12px;
      svg.svg-dark {
        filter: grayscale(1) brightness(0) invert(0);
      }
    }

    .event-time {
      display: flex;
      width: 40px;
      -ms-flex: 0 0 auto;
      flex: 0 0 auto;
      -ms-flex-pack: center;
      justify-content: center;
      -ms-flex-align: center;
      align-items: center;
      font-weight: 600;
    }
    .icon {
      display: inline-flex;
      -ms-flex: 0 0 30px;
      flex: 0 0 30px;
      justify-content: center;
    }

    .event-time {
      font-size: 15px;
      line-height: 18px;

      font-weight: 400;
    }
    .event-time {
      font-weight: 600;
    }
  }
}
.summary-container {
  .summary-btn {
    // max-width: 516px;
    height: 56px;
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 4px;
    justify-content: space-between;
    padding: 0 16px;
    width: 100%;
    border: none;
    &:focus {
      box-shadow: none;
    }
    &.not-collapsed {
      .icon {
        img {
          transform: rotate(180deg);
        }
      }
    }
  }
}
@media (max-width: $lg) {
  .in-play-stat {
    column-gap: 40px;
    row-gap: 10px;
    display: flex;
    flex-direction: column;
  }
  .top-stats {
    overflow: hidden;
    text-overflow: ellipsis;
    .top-stats-title {
      h3 {
        font-weight: 600;
        font-size: 12px;
        line-height: 18px;
        width: 90%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
