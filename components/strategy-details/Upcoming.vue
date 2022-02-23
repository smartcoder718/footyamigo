<template>
  <div>
    <div class="d-flex column-gap-10 mb-3" style="justify-content: flex-end">
      <FixtureDatePicker
        v-model="selected_date"
        :minDate="new Date()"
        :buttonText="$moment(selected_date).format('LL')"
      />
      <FixtureStatPicker v-model="selected_stat" />
    </div>

    <UpgradeToPro
      message="Upgrade to Pro to gain access to upcoming fixtures matching your strategy"
      :showUpgrade="showUpgrade"
    >
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
    </UpgradeToPro>
    <LoadMore v-if="loading" />
    <MugenScroll :handler="getResults" :should-handle="!loading" v-if="!loaded">
      <!--div class="centered my-4">
        <b-spinner variant="primary" v-if="loading"></b-spinner>
      </div-->
    </MugenScroll>
    <h4 v-if="!loading && loaded && !showUpgrade" class="centered text-grey">
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
import dummy_upcoming from "~/components/json/dummy-upcoming";

export default {
  props: {
    includedLeagues: Object,
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
      showUpgrade: false,
      loaded: false,
      selected_date: new Date(),
    };
  },
  components: {
    FixtureScrollPicker,
    FixtureDatePicker,
    FixtureStatPicker,
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
  methods: {
    async showStats(fixture) {
      this.show_fixture_details = true;
      this.selected_fixture = fixture;
    },
    closeStats() {
      this.show_fixture_details = false;
      this.selected_fixture = null;
    },
    showDemoToExpired() {
      this.fixtures = dummy_upcoming;
      this.loaded = true;
      // console.log(dummy_strategies);
      this.showUpgrade = true;
    },
    async getResults() {
      try {
        if (this.$store.getters.subscriptionType == "trial") {
          return this.showDemoToExpired();
        }
        this.loading = true;

        const params = {
          page: this.page,
          date: this.$moment(this.selected_date).unix(),
          id: this.$route.params.id,
        };

        const { fixtures } = await this.$axios.$get(
          `/user/strategies/${this.type}/upcoming/`,
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
        this.loading = false;
        this.initialized = true;
      }
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";
@import "~/assets/scss/breakpoints";

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
