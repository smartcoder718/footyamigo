<template>
  <div class="fixture-wrapper mb-1">
    <div
      class="fixture-listing"
      :id="'fixture-' + fixture.id"
      :class="liveMode ? 'is-live' : ''"
    >
      <FavoriteWrapper :fixture="fixture" v-if="!hideFavorite">
      </FavoriteWrapper>
      <TimerWrapper :liveMode="liveMode" :fixture="fixture"> </TimerWrapper>
      <TeamsWrapper
        :liveMode="liveMode"
        :fixture="fixture"
        :isWin="isWin"
        @click="$emit('showstats')"
        @click.native="$emit('showstats')"
      >
      </TeamsWrapper>

      <CardsWrapper :liveMode="liveMode" :fixture="fixture"> </CardsWrapper>
      <!-- Mobile For All of Wrappers -->
      <mobile-wrapper
        :isWin="isWin"
        :liveMode="liveMode"
        @click="$emit('showstats')"
        @click.native="$emit('showstats')"
        :fixture="fixture"
      >
      </mobile-wrapper>
      <template v-if="liveMode">
        <LiveWrapper :fixture="fixture"> </LiveWrapper>
      </template>

      <div class="live-pre-wrapper">
        <template
          v-if="scroller == 'in_play_scroller' && liveMode && fixture.stats"
        >
          <InPlayWrapper :fixture="fixture"> </InPlayWrapper>
        </template>

        <template
          v-else-if="
            scroller == 'stats_scroller' && fixture.home && fixture.away
          "
        >
          <template v-if="stat == 'h2h'">
            <H2HWrapper :fixture="fixture"> </H2HWrapper>
          </template>

          <template v-else>
            <StatsWrapper
              v-for="item in stats_scroller[stat]"
              :item="item"
              :key="item.title"
              :fixture="fixture"
            >
            </StatsWrapper>
          </template>
        </template>
        <template
          v-else-if="
            scroller == 'in_play_scroller' && fixture.home && fixture.away
          "
        >
          <InPlayWrapper :fixture="fixture"> </InPlayWrapper>
        </template>

        <template v-else-if="scroller == 'probability_scroller'">
          <template v-if="fixture.probability">
            <ProbabilityWrapper
              v-for="item in probability_scroller"
              :item="item"
              :key="item.title"
              :fixture="fixture"
            >
            </ProbabilityWrapper>
          </template>
          <div class="no-stats-wrapper wrapper" v-else>
            <b-badge variant="secondary">{{ fixture.probability }}</b-badge>
          </div>
        </template>

        <template v-else-if="scroller == 'peak_odds_scroller'">
          <template v-if="fixture.peak_odds">
            <PeakOddsWrapper
              v-for="item in odds_scroller"
              :item="item"
              :key="item.title"
              :fixture="fixture"
            >
            </PeakOddsWrapper>
          </template>
          <div class="no-stats-wrapper wrapper" v-else>
            <b-badge variant="secondary">No data</b-badge>
          </div>
        </template>
        <template v-else-if="scroller == 'odds_scroller'">
          <template v-if="fixture.pre_odds">
            <OddsWrapper
              v-for="item in odds_scroller"
              :item="item"
              :key="item.title"
              :fixture="fixture"
              :liveMode="liveMode"
            >
            </OddsWrapper>
          </template>
          <div class="no-stats-wrapper wrapper" v-else>
            <b-badge variant="secondary">No data</b-badge>
          </div>
        </template>

        <div v-else>
          <div class="no-stats-wrapper wrapper">
            <b-badge variant="secondary">No data</b-badge>
          </div>
        </div>
      </div>
      <ScrollWrapper
        @scrollleft="scrollLeft"
        @scrollright="scrollRight"
        v-if="scroller != 'in_play_scroller' && !liveMode"
      >
      </ScrollWrapper>

      <b-button
        class="footy-button centered stats-button"
        @click="$emit('showstats')"
        v-if="statshidden"
        >Stats
      </b-button>
    </div>
  </div>
</template>

<script>
import stats_scroller from "~/components/json/stats-scroller.json";

import probability_scroller from "~/components/json/probability-scroller.json";
import odds_scroller from "~/components/json/odds-scroller.json";
import FavoriteWrapper from "~/components/Wrappers/FavoriteWrapper.vue";
import TimerWrapper from "~/components/Wrappers/TimerWrapper.vue";
import TeamsWrapper from "~/components/Wrappers/TeamsWrapper.vue";
import InPlayWrapper from "~/components/Wrappers/InPlayWrapper.vue";
import CardsWrapper from "~/components/Wrappers/CardsWrapper.vue";
import StatsWrapper from "~/components/Wrappers/StatsWrapper.vue";
import LiveWrapper from "~/components/Wrappers/LiveWrapper.vue";
import ProbabilityWrapper from "~/components/Wrappers/ProbabilityWrapper.vue";
import PeakOddsWrapper from "~/components/Wrappers/PeakOddsWrapper.vue";
import OddsWrapper from "~/components/Wrappers/OddsWrapper.vue";
import ScrollWrapper from "~/components/Wrappers/ScrollWrapper.vue";
import H2HWrapper from "~/components/Wrappers/H2HWrapper.vue";
import MobileWrapper from "./Wrappers/MobileWrapper.vue";

export default {
  components: {
    FavoriteWrapper,
    CardsWrapper,
    TeamsWrapper,
    InPlayWrapper,
    ScrollWrapper,
    StatsWrapper,
    ProbabilityWrapper,
    TimerWrapper,
    LiveWrapper,
    PeakOddsWrapper,
    OddsWrapper,
    MobileWrapper,
    H2HWrapper,
  },
  props: {
    fixture: Object,
    scroller: String,
    statshidden: Boolean,
    stat: String,
    liveMode: Boolean,
    hideFavorite: Boolean,
    isWin: { type: Boolean, default: null },
  },
  data() {
    return {
      stats_scroller,
      probability_scroller,
      odds_scroller,
    };
  },

  methods: {
    scrollLeft() {
      let scrollTo =
        this.$el.querySelector(".live-pre-wrapper").scrollLeft - 100;
      document.querySelectorAll(".live-pre-wrapper").forEach((element) => {
        element.scrollLeft = scrollTo;
      });
    },
    scrollRight() {
      let scrollTo =
        this.$el.querySelector(".live-pre-wrapper").scrollLeft + 100;
      document.querySelectorAll(".live-pre-wrapper").forEach((element) => {
        element.scrollLeft = scrollTo;
      });
    },
  },
};
</script>

<style lang="scss">
@import "~assets/scss/colors";
@import "~assets/scss/breakpoints";
.fixture-listing {
  background: white;
  display: flex;
  align-items: center;
  padding: 16px;
  row-gap: 8px;
}
.star-icon {
  font-weight: 200;
  color: #60685f;
}

.wrapper {
  display: flex;
  padding: 13px;
  height: 94px;
  align-items: center;
  border-right: 1px solid #f0f1f0;
  justify-content: center;
  flex-direction: column;
  flex-shrink: 0;
  flex-grow: 0;

  &.no-stats-wrapper {
    border: none;

    color: $dark-1;
  }
}

.live-pre-wrapper {
  display: flex;
  display: inline-flex;
  flex-wrap: nowrap;
  flex: 1 0 1px;
  height: 100%;
  overflow: hidden;
  overflow-x: scroll;
  scrollbar-width: none;
  align-items: center;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
}

.inner {
  display: -webkit-inline-box;
  display: inline-flex;
}

.livestat {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  font-weight: bold !important; //COLFAX
  font-size: 16px;
}
.fixture-wrapper {
  overflow: scroll;
  overflow-x: hidden;
  border: 1px solid #f0f1f0;
  position: relative;
}

.fixture-wrapper-strategy {
  border-left: 4px solid #60b15a;
  margin-bottom: 2px;
  &.active-fixture {
    background: #f7f9f7;
    border: 1px solid #60b15a;
    border-left: 4px solid #60b15a;
  }
}

.info-wrapper {
  -webkit-box-flex: 1;
  flex: 1 0 1px;
  overflow: hidden;
  scroll-behavior: smooth;
  cursor: pointer;
  display: -webkit-box;
  display: flex;
  position: relative;
  height: auto;
  padding: 15px;

  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: start;
  justify-content: flex-start;
  flex-wrap: wrap;
}

@media screen and (min-width: $lg) {
  .fixture-listing {
    .stats-wrapper {
      padding: 0;
      // border-left: 1px solid #0a111e;
      background: white;
      //background: linear-gradient(90deg, #192536 0%, #111b29 100%);
      //border-right: 1px solid #0a111e;
    }
    .info-wrapper {
      flex-basis: 100%;
      -webkit-box-flex: 1.3;
      flex: 1.3 0 1px;
      max-width: 320px;
      padding: 0;
    }
    .status {
      margin-bottom: 0.3rem;
    }
    .teams {
      padding: 0 5px 0 0;
      margin: 0;
    }
  }
  .feed-glance {
    padding-right: 15px;
    border-right: 1px solid whitesmoke;
  }
  .break {
    display: none;
  }
}

@media (max-width: $lg) {
  .is-live {
    .live-wrapper {
      //display: none;
      border: 1px solid $light;
    }
    .live-pre-wrapper {
      .wrapper {
        border-right: 1px solid white;
      }
    }
    .stats-button {
      display: none;
    }
  }

  .stats-button {
    width: 100%;
  }
  .fixture-wrapper {
    overflow-x: scroll;
    padding: 0px !important;
  }
  .live-pre-wrapper {
    flex: 0 0 100%;
    // padding-left: 18px;
    margin-bottom: 16px;
    margin-top: 7px;
  }
  .fixture-listing {
    flex-wrap: wrap;
  }
}
</style>
