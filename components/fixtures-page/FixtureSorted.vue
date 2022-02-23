<template>
  <div id="infinite-list">
    <div class="d-none">
      {{ fixturesCount }}
    </div>
    <h4 v-if="!loading && !fixtures.length" class="centered text-grey">
      No Games !
    </h4>
    <!-- <div v-if="loading" class="d-flex justify-content-center">
      <Loader />
    </div> -->
    <div id="infinite-list" v-else>
      <div
        v-for="(league, index) in groupByLeague(fixtures)"
        :key="league.name + index"
      >
        <div class="country-wrapper">
          <div class="country-name" block>
            <div class="country-content">
              <span class="flag-icon mr-2" :class="getFlag(league.iso)"></span>
              <span class="country-text">
                {{ league.name }}
              </span>
            </div>
          </div>
          <div>
            <div class="mb-2">
              <div class="mb-1" v-if="!false">
                <FixtureStatsWrapper
                  :fixture="fixture"
                  :stat="selected_stat"
                  :scroller="selected_scroller"
                  v-for="(fixture, index) in league.fixtures"
                  :key="fixture.fixture_id + '-' + index"
                  @showstats="showStats(fixture)"
                  @closestats="closeStats"
                  showingDetails
                  :statshidden="!show_fixture_details"
                >
                </FixtureStatsWrapper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <MugenScroll
      :handler="fetchFixtures"
      :should-handle="!loading"
      v-if="!loaded"
    >
      <div class="centered my-4">
        <b-spinner variant="primary" v-if="loading"></b-spinner>
      </div>
    </MugenScroll>

    <ModalOnMobile v-model="show_fixture_details" v-if="show_fixture_details">
      <FixtureDetails
        :initialFixture="selected_fixture"
        v-if="selected_fixture"
        @closestats="closeStats"
        :selected_scroller="selected_scroller"
        :liveMode="liveMode"
      >
      </FixtureDetails>
    </ModalOnMobile>
  </div>
</template>

<script>
import FixtureLeagueStats from "~/components/fixtures-page/FixtureLeagueStats.vue";

export default {
  props: {
    selected_scroller: String,
    liveMode: Boolean,
    selected_stat: String,
    selected_date: Date,
    selected_settings: Array,
    ruleFilters: Array,
  },
  data() {
    return {
      fixtures: [],
      initialized: false,
      selected_fixture: null,
      show_fixture_details: false,
      loading: false,
      loaded: false,
      page: 1,
      totalCount: 0,
      isSorted: false,
      tempData: {},
      sortByField: null,
      sortByOrder: null,
      liveFeedInterval: null,
    };
  },
  beforeMount() {
    this.fetchFixtures();
  },
  beforeDestroy() {
    clearInterval(this.liveFeedInterval);
  },
  mounted() {
    clearInterval(this.liveFeedInterval);
  },
  components: {
    FixtureLeagueStats,
  },
  methods: {
    async fetchFixtures() {
      try {
        this.loading = true;
        const date = this.$moment(this.selected_date).format("YYYY-MM-DD");
        const { fixtures, total } = await this.$axios.$post(
          "/user/fixtures/sorted",
          {
            page: this.page,
            ft_results: this.selected_settings.includes("ft_results"),
            sort_by_time: this.selected_settings.includes("sort_by_time"),
            upcoming: this.selected_settings.includes("upcoming"),
            filters: this.ruleFilters,
            date,
          }
        );
        this.page += 1;
        this.fixtures.push(...fixtures);
        window.scrollBy(0, -800);
        this.totalCount = total;
        this.loading = false;
        if (fixtures.length < 20) {
          this.loaded = true;
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.initialized = true;
      }
    },
    async fetchByIds() {
      const feeds = await this.$axios.$get("/user/fixtures/live-feed", {
        params: {
          ids: this.fixtures.filter((f) => f.is_live == true).map((f) => f.id),
        },
      });
      const hashMap = this.$arrayToObject(feeds, "fixture_id");
      for (var i = 0; i < this.fixtures.length; i++) {
        const { fixture_id } = this.fixtures[i];
        if (fixture_id in hashMap) {
          this.fixtures.splice(i, 1, hashMap[fixture_id]);

          //this.fixtures[i] = hashMap[fixture_id];
        }
      }
      // console.log(hashMap);
    },

    getFlag(iso) {
      return iso ? "flag-icon-" + iso : "flag-icon-un";
    },
    closeStats() {
      this.show_fixture_details = false;
    },
    groupByLeague(fixtures) {
      const leagues = Object.assign(
        {},
        ...fixtures.map((fixture) => {
          return {
            [fixture.timestamp + "-" + fixture.league_id]: {
              fixtures: [],
              id: fixture.timestamp + "-" + fixture.league_id,
              iso: fixture.iso,
              name: fixture.country_name + " • " + fixture.league_name,
            },
          };
        })
      );
      for (var fixture of fixtures) {
        const { league_id, timestamp } = fixture;
        leagues[timestamp + "-" + league_id].fixtures.push(fixture);
      }
      return leagues;
    },
    async showStats(fixture) {
      this.selected_fixture = fixture;
      this.show_fixture_details = true;
    },
  },
  computed: {
    fixturesCount() {
      this.$emit("countChange", this.totalCount);
      return this.totalCount;
      this.$emit("countChange", this.fixtures.length);
      return this.fixtures.length;
    },
  },
};
</script>

<style lang="scss">
@import "~assets/scss/breakpoints";
@import "~/assets/scss/colors";
</style>
