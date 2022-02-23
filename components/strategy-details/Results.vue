<template>
  <div>
    <div class="d-flex column-gap-10 mb-3" style="justify-content: flex-end">
      <SummaryWrapper
        :summary="summary"
        text="Summary"
        icon="summarize"
        v-if="
          ['footyamigo@gmail.com', 'vishalbty@gmail.com'].includes(
            $auth.user.email
          )
        "
      />
      <FixtureDatePicker
        v-model="selected_date"
        :maxDate="new Date()"
        :minDate="minDate"
        :class="'results-date-picker-' + $store.getters.subscriptionType"
        :buttonText="$moment(selected_date).format('ll')"
      />
      <FixtureStatPicker v-model="selected_stat" />
    </div>

    <b-overlay rounded="sm">
      <div style="min-height: 100px">
        <div
          v-for="(league, league_id) in $groupFixturesByLeague(fixtures)"
          :key="league_id + 'league'"
          class="mb-4"
        >
          <div
            class="text-uppercase pl-2 wrap-on-mobile mb-3 league-name-inner-strategy"
            block
          >
            <div class="country-content">
              <span class="flag-icon mr-2" :class="league.flagicon"></span>
              <span class="country-text">
                {{ league.name }}
              </span>
            </div>
            <b-button
              class="text-warning"
              size="sm"
              variant="transparent"
              @click="$emit('promptExcludeLeague', league.league_id)"
              v-show="league.league_id in includedLeagues"
            >
              EXCLUDE LEAGUE
            </b-button>
          </div>

          <FixtureStatsWrapper
            :fixture="fixture"
            :stat="selected_stat"
            :scroller="selected_scroller"
            v-for="fixture in league.fixtures"
            :key="fixture.id"
            :isWin="fixture.is_hit"
            :class="fixture.is_hit ? 'is_hit' : 'not_hit'"
            :liveMode="false"
            :hideFavorite="true"
            @showstats="showStats(fixture)"
            @closestats="closeStats"
            :statshidden="selected_fixture == null"
          >
          </FixtureStatsWrapper>
        </div>

        <ModalOnMobile
          v-model="show_fixture_details"
          v-if="show_fixture_details"
        >
          <FixtureDetails
            :initialFixture="selected_fixture"
            v-if="selected_fixture"
            @closestats="closeStats"
            class="fixture-details-box"
            :selected_scroller="selected_scroller"
            :liveMode="false"
          >
          </FixtureDetails>
        </ModalOnMobile>
      </div>
    </b-overlay>
    <LoadMore v-if="loading" />

    <MugenScroll :handler="getResults" :should-handle="!loading" v-if="!loaded">
      <!--div class="centered my-4">
        <b-spinner variant="primary" v-if="loading"></b-spinner>
      </div-->
    </MugenScroll>
    <h4 v-if="!loading && loaded" class="centered text-grey">
      <template v-if="fixtures.length"> No more results ! </template>
      <template v-else>
        No fixtures that meets your rules were found for this day, try another
        date
      </template>
    </h4>

    <FixtureScrollPicker v-model="selected_scroller" />
  </div>
</template>

<script>
import FixtureDatePicker from "~/components/fixtures-page/FixtureDatePicker.vue";
import FixtureScrollPicker from "~/components/fixtures-page/FixtureScrollPicker.vue";
import FixtureStatPicker from "~/components/fixtures-page/FixtureStatPicker.vue";
import SummaryWrapper from "./SummaryWrapper.vue";
export default {
  props: {
    includedLeagues: Object,
    filter: Object,
  },
  data() {
    return {
      fixtures: [],
      type: "pre-match-alerts",
      show_fixture_details: false,
      selected_fixture: null,
      selected_stat: "ft_result",
      selected_scroller: "stats_scroller",
      stat: "ft_result",
      page: 1,
      initialized: false,
      loading: false,
      loaded: false,
      selected_date: new Date(),
    };
  },
  components: {
    FixtureScrollPicker,
    FixtureDatePicker,
    FixtureStatPicker,
    SummaryWrapper,
  },
  beforeMount() {
    this.getResults();
  },
  watch: {
    selected_date() {
      this.page = 1;
      this.fixtures = [];
      this.getResults();
    },
  },

  computed: {
    minDate() {
      if (this.$store.getters.subscriptionType == "trial") {
        return this.$moment()
          .subtract(2, "days")

          .startOf("day")
          .toDate();
      } else {
        return this.$moment("2021-01-01", "YYYY-MM-DD").toDate();
      }
    },
    summary() {
      var count = 0;
      var revenue = 0;
      var wins = 0;
      var losses = 0;
      for (var fixture of this.fixtures) {
        if (fixture.pre_odds && this.outcomeCode in fixture.pre_odds) {
          count += 1;
          if (fixture.is_hit) {
            var odds = fixture.pre_odds[this.outcomeCode];
            var r = odds * 100;

            revenue += r;
            wins++;
          } else {
            losses++;
          }
        }
      }
      revenue = Math.round(revenue);

      var wager = 100 * count;
      var profit = revenue - wager;
      var roi = Math.round((revenue / (wager || 1)) * 100);
      return {
        roi,
        count,
        profit,
        revenue,
        wins,
        losses,
        wager,
      };
    },
    outcomeCode() {
      return this.filter.outcome.code;
    },
  },
  methods: {
    async showStats(fixture) {
      this.show_fixture_details = true;
      this.selected_fixture = fixture;
    },
    closeStats() {
      this.show_fixture_details = false;
      this.selected_fixture = null;
    },

    async getResults() {
      try {
        this.loading = true;

        const params = {
          page: this.page,
          date: this.$moment(this.selected_date).endOf("day").utc().unix(),
          id: this.$route.params.id,
        };

        // console.log(this.$moment(this.selected_date).toDate());
        const { fixtures } = await this.$axios.$get(
          `/user/strategies/${this.type}/results/`,
          {
            params,
          }
        );
        this.loaded = fixtures.length < 50 ? true : false;
        if (!this.loaded) {
          window.scrollBy(0, -300);
        }

        this.page += 1;
        this.fixtures.push(...fixtures);
      } catch (error) {
        console.error(error);
      } finally {
        this.initialized = true;
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";
@import "~/assets/scss/breakpoints";

.results-date-picker-trial {
  span.vc-day-content.is-disabled:before {
    font-family: "Material Icons Outlined";
    content: "clock";
    position: absolute;
    left: 0;
    right: 0;

    background: white;
  }
}

@media screen and (min-width: $lg) {
  .is_hit {
    border-left: 4px solid $primary;
  }
  .not_hit {
    border-left: 4px solid $red;
  }
}
@media screen and (max-width: $lg) {
  .is_hit {
    border-top: 4px solid $primary;
  }
  .not_hit {
    border-top: 4px solid $red;
  }
}
</style>
