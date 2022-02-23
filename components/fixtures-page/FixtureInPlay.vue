<template>
  <div id="infinite-list">
    <div class="d-none">
      {{ fixturesCount }}
    </div>
    <FixtureFilterWrapper
      v-if="!loading && fixtures.length"
      @sortField="sortField"
      :title="selected_scroller.title"
      @resetFilters="resetFilters"
      :sortByField="sortByField"
      :sortByOrder="sortByOrder"
    />
    <h4 v-if="!loading && !fixtures.length" class="centered text-grey">
      No Live Games !
    </h4>
    <!-- <div v-if="loading" class="d-flex justify-content-center">
      <Loader />
    </div> -->
    <div id="infinite-list" v-if="isSorted">
      <div v-for="fixture in sortedFixtures" :key="fixture.name">
        <div class="country-wrapper">
          <div class="country-name" block>
            <div class="country-content">
              <span class="flag-icon mr-2" :class="getFlag(fixture.iso)"></span>
              <span class="country-text">
                {{ fixture.country_name }} • {{ fixture.league_name }}
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
                  :liveMode="liveMode"
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
                  v-for="fixture in league.fixtures"
                  :key="fixture.id"
                  :liveMode="liveMode"
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
        :fixture_id="selected_fixture.fixture_id"
        v-if="selected_fixture"
        @closestats="closeStats"
        class="fixture-details-box"
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
        const fixtures = await this.$axios.$get("/user/fixtures/live", {
          params: {
            page: this.page,
          },
        });
        this.page += 1;
        this.fixtures.push(...fixtures);
        window.scrollBy(0, -800);
        this.loading = false;
        if (fixtures.length < 50) {
          this.loaded = true;
        }
        this.setLiveFeedInterval();
      } catch (error) {
        console.error(error);
      } finally {
        this.initialized = true;
      }
    },
    setLiveFeedInterval() {
      clearInterval(this.liveFeedInterval);
      const instance = this;
      this.liveFeedInterval = setInterval(() => {
        instance.fetchByIds();
      }, 15000);
    },
    async fetchByIds() {
      const feeds = await this.$axios.$get("/user/fixtures/live-feed", {
        params: {
          ids: this.fixtures.map((f) => f.id),
        },
      });
      const hashMap = this.$arrayToObject(feeds, "fixture_id");
      for (var i = 0; i < this.fixtures.length; i++) {
        const { fixture_id } = this.fixtures[i];
        if (fixture_id in hashMap) {
          const fixture = hashMap[fixture_id];
          // console.log(fixture);
          if (fixture.status in { FT: 1, FT_PEN: 1 }) {
            this.fixtures.splice(i, 1);
          } else {
            this.fixtures.splice(i, 1, fixture);
          }

          // console.log(fixture_id, "her");
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

    sortByCountry(order, fixtures) {
      return fixtures.sort(function (a, b) {
        if (a.country_name > b.country_name) {
          return 1 * order;
        }
        if (b.country_name > a.country_name) {
          return -1 * order;
        }
        return 0;
      });
    },

    sortByTime(order, fixtures) {
      return fixtures.sort(
        (a, b) => (Number(b.minute) - Number(a.minute)) * order
      );
    },
    sortField({ field, order }) {
      this.sortByField = field;
      this.sortByOrder = order;
      this.isSorted = true;
    },
    resetFilters() {
      this.isSorted = false;
      this.sortByField = null;
      this.sortByOrder = null;
      clearInterval(this.liveFixturesInterval);
      //this.getCountries();
    },
  },
  computed: {
    sortedFixtures() {
      if (!this.isSorted) {
        return this.fixtures;
      }
      const fixtures = [...this.fixtures];
      this.isSorted = true;
      const field = this.sortByField;
      const order = this.sortByOrder;
      switch (field) {
        case "time":
          this.sortByTime(order, fixtures);
        case "country":
          this.sortByCountry(order, fixtures);
        default:
          fixtures.sort(
            (a, b) =>
              (Number(a.stats["home"][field]) +
                Number(a.stats["away"][field]) -
                (Number(b.stats["home"][field]) +
                  Number(b.stats["away"][field]))) *
              order
          );
      }
      return fixtures;
    },
    fixturesCount() {
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
