<template>
  <div v-if="loading" class="d-flex justify-content-center">
    <Loader />
  </div>
  <div v-else>
    <div class="d-none">
      {{ fixturesCount }}
    </div>

    <div v-for="(country, index) in countries" :key="country.name">
      <div class="country-wrapper">
        <b-button @click="getCountryFixtures(index)" class="country-name" block>
          <div class="country-content">
            <span class="flag-icon mr-2" :class="getFlag(country.iso)"></span>
            <span class="country-text">
              {{ country.name }}
            </span>
          </div>

          <span
            v-if="selected_scroller !== 'in_play_scroller'"
            class="material-icons-outlined icon"
            :class="{ active: country.hidden }"
          >
            keyboard_arrow_down
          </span>
        </b-button>
        <div v-if="!country.hidden">
          <div
            v-for="(fixtures, league_name) in groupByLeague(country.fixtures)"
            :key="country.id + '_' + league_name"
            class="mb-2"
          >
            <div class="league-name pl-2">
              <h6>{{ league_name }}</h6>

              <FixtureLeagueStats />
            </div>

            <div class="mb-1" v-if="!false">
              <FixtureStatsWrapper
                :fixture="fixture"
                :stat="selected_stat"
                :scroller="selected_scroller"
                v-for="fixture in fixtures"
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

    <ModalOnMobile v-model="show_fixture_details" v-if="show_fixture_details">
      <FixtureDetails
        :initialFixture="selected_fixture"
        v-if="selected_fixture"
        @closestats="closeStats"
        :key="selected_fixture_id"
        :fixture_id="selected_fixture_id"
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
    selected_date: Date,
    selected_stat: String,
    selected_settings: Array
  },
  data() {
    return {
      countries: [],
      selected_fixture: null,
      show_fixture_details: false,
      selected_fixture_id: null,
      loading: false
    };
  },
  mounted() {
    this.fetchFixtures();
  },
  components: {
    FixtureLeagueStats
  },
  watch: {
    selected_date() {
      this.fetchFixtures();
    }
  },
  computed: {
    fixturesCount() {
      var count = 0;
      // console.log(Object.values(fixtures));
      for (var country of this.countries) {
        count += country.fixture_ids.length;
      }
      this.$emit("countChange", count);
      return count;
    }
  },
  methods: {
    async fetchFixtures() {
      try {
        this.loading = true;
        const date = this.$moment(this.selected_date).format("YYYY-MM-DD");
        const countries = await this.$axios.$get("/user/fixtures", {
          params: { date, settings: this.selected_settings }
        });
        this.countries = countries;
        this.loading = false;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async getCountryFixtures(index) {
      try {
        if (this.countries[index].fixtures.length) {
          return (this.countries[index].hidden = !this.countries[index].hidden);
        }
        const { fixture_ids } = this.countries[index];
        var fixtures = await this.$axios.$get("/user/fixtures/ids", {
          params: { fixture_ids }
        });
        this.countries[index]["fixtures"] = fixtures;
        this.countries[index].hidden = false;
      } catch (error) {
        console.error(error);
      }
    },
    getFlag(iso) {
      return iso ? "flag-icon-" + iso : "flag-icon-un";
    },
    closeStats() {
      this.show_fixture_details = false;
    },
    groupByLeague(fixtures) {
      if (!fixtures.length) {
        return {};
      }
      let leagues = new Set(fixtures.map(fixture => fixture.league_name));
      let leagues_obj = {};
      leagues.forEach(league => (leagues_obj[league] = []));
      fixtures.forEach(fixture => {
        let { league_name } = fixture;
        leagues_obj[league_name].push(fixture);
      });
      return leagues_obj;
    },
    async showStats(fixture) {
      this.selected_fixture = fixture;
      this.selected_fixture_id = fixture.fixture_id;
      this.show_fixture_details = true;
    }
  }
};
</script>

<style lang="scss">
@import "~assets/scss/breakpoints";
@import "~/assets/scss/colors";
</style>
