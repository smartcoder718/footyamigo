<template>
  <div>
    <div v-if="!breakdownMode" class="picks-head " style="">
      <!-- <h3 class="mr-4 responsive-h3">
          Picked Matches on {{ $moment(selected_date).format("ll") }}
        </h3> -->
      <div class="footy-button-group" style="justify-self: flex-end">
        <!-- <b-button
            class="footy-button footy-small-button"
            @click="modalShow = !modalShow"
          >
            <DownloadIcon class="icon-left" />
            Download
          </b-button> -->
        <b-button
          @click="clearStrike"
          class="btn centered btn-light text-grey"
          style="font-weight: 500"
        >
          <span class="material-icons-outlined mr-2" style="font-size: 17px;">
            clear
          </span>
          Clear Strike Rate
        </b-button>
        <!-- <FixtureDatePicker
          v-model="selected_date"
          :maxDate="new Date()"
          :buttonText="$moment(selected_date).format('ll')"
        /> -->
      </div>
    </div>
    <div v-else class="picks-head mb-3">
      <b-button
        @click="breakdownMode = false"
        class="footy-button footy-small-button mr-2"
      >
        <span class="material-icons mr-2"> keyboard_backspace </span> Back
      </b-button>
      <h3 class="responsive-h3">Strategy History Breakdown By League</h3>
    </div>

    <div class="pick-details wrap-on-mobile" v-if="!breakdownMode">
      <div class="pick-details-items">
        <div class="calc-stats">
          <h3 class="title">Picks</h3>
          <h3>
            {{ picksCount }}
          </h3>
        </div>
        <div class="calc-stats">
          <h3 class="title">Strike Rate</h3>
          <h3>{{ strikeRate }}%</h3>
        </div>
        <div class="calc-stats">
          <h3 class="title">Fair Odd</h3>
          <h3>
            {{ fairOdd }}
          </h3>
        </div>
      </div>

      <div>
        <b-button @click="breakdownMode = true" class="footy-button">
          Breakdown by League
        </b-button>
      </div>
    </div>

    <div v-if="breakdownMode">
      <BreakdownByLeague
        :items="leagueBreakdown"
        @deleteleague="deleteLeague"
      />
    </div>
    <div
      v-else
      style="min-height:200px; align-items:center; display:grid"
      class=""
    >
      <LoadMore v-if="loading" />
      <template v-else-if="picks.length > 0">
        <div v-for="{ date, picks } in groupFixturesByDate(picks)" :key="date">
          <b-button
            class="date-wrapper"
            block
            style="font-weight:500"
            variant="light"
            @click="changeDate(date)"
            :id="date"
            :href="'#' + date"
          >
            {{ date }}
          </b-button>
          <template v-if="date == active_date">
            <div
              v-for="(league, league_id, index) in $groupFixturesByLeague(
                picks
              )"
              :key="league_id"
              class="mb-4 animate__animated"
              :class="[index % 2 ? 'animate__fadeIn' : 'animate__fadeIn']"
            >
              <div
                class="text-uppercase pl-2 wrap-on-mobile mb-3 league-name-inner-strategy"
              >
                <div>
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

              <PickWrapper
                :pick="pick"
                v-for="pick in league.fixtures"
                :key="pick._id"
                @deletepick="deletePick(pick._id)"
                @showstats="showStats(pick.fixture_id)"
                @closestats="closeStats"
                :statshidden="selected_fixture == null"
              >
              </PickWrapper>
            </div>
          </template>
        </div>
      </template>
      <h4 v-else class="centered text-grey">
        No picks for this date
      </h4>
    </div>

    <ModalOnMobile v-model="show_fixture_details" v-if="show_fixture_details">
      <FixtureDetails
        v-if="selected_fixture_id"
        @closestats="closeStats"
        :fixture_id="selected_fixture_id"
        class="fixture-details-box"
      >
      </FixtureDetails>
    </ModalOnMobile>
    <b-modal
      v-model="modalShow"
      :title="filter.title"
      hide-header
      hide-footer
      modal-class="p-0"
      body-class="p-0 border-0 rounded-20"
      content-class="border-0 rounded-20"
    >
      <Download> </Download>
    </b-modal>
  </div>
</template>

<script>
import StrategyDetails from "~/components/strategy-details/StrategyDetails";
import Download from "~/components/CreatePreMatchAlert/Download.vue";
import PickWrapper from "./PickWrapper";
import BreakdownByLeague from "./BreakdownByLeague";
import FixtureDetails from "~/components/FixtureDetails";

// import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import FixtureDatePicker from "~/components/fixtures-page/FixtureDatePicker.vue";
export default {
  props: {
    id: String,
    type: String,
    filter: Object,
    includedLeagues: Object
  },
  data() {
    return {
      modalShow: false,
      selected_fixture_id: null,
      show_fixture_details: false,
      picks: [],
      selected_date: new Date(),
      active_date: this.$moment().format("LL"),
      breakdownMode: false,
      selected_fixture: null,
      loading: false,
      breakdownFields: [
        "league",
        "picked_matches",
        "strike_rate",
        "fair_odd",
        "action"
      ]
    };
  },
  components: {
    PickWrapper,
    FixtureDetails,
    Download,
    BreakdownByLeague,
    StrategyDetails,

    FixtureDatePicker
  },

  watch: {
    selected_date() {
      // this.getPicks(this.filter.id);
    }
  },
  mounted() {
    this.getPicks(this.filter.id);
    this.$store.dispatch("fetchLeagues");
  },
  computed: {
    picksCount() {
      return this.picks.length;
    },

    leagueBreakdown() {
      const leagues = this.groupFixturesByLeague(this.picks);
      const breakdown = [];

      for (const league_id in leagues) {
        const league = leagues[league_id];
        const { picks } = league;
        const strike_rate = this.getStrikeRate(picks);
        const picked_matches = picks.length;
        const fair_odd = this.getFairOdd(strike_rate);
        const data = {
          league_id,
          league: `<span class="flag-icon flag-icon-${league.iso ||
            "un"}"> </span> <span>${league.name}</span>`,
          picked_matches,
          strike_rate,

          fair_odd
        };
        breakdown.push(data);
      }
      return breakdown;
    },
    strikeRate() {
      return this.getStrikeRate(this.picks);
    },
    fairOdd() {
      return this.getFairOdd(this.strikeRate);
    }
  },
  methods: {
    async showStats(fixture_id) {
      this.selected_fixture_id = fixture_id;
      this.show_fixture_details = true;
    },
    changeDate(date) {
      this.active_date = date;
    },
    groupFixturesByDate(picks) {
      const dates = {};
      picks.forEach(pick => {
        var date = this.$moment
          .utc(pick.sending_time ? pick.sending_time * 1000 : pick.updated_at)
          .local()
          .format("LL");
        var group = dates[date];
        if (!group) {
          dates[date] = {
            id: this.$moment
              .utc(
                pick.sending_time ? pick.sending_time * 1000 : pick.updated_at
              )
              .local()
              .startOf("day")
              .unix(),
            picks: [],
            date
          };
        }
        dates[date].picks.push(pick);
      });
      const sorted_date = Object.values(dates).sort((y, x) => {
        return x.id - y.id;
      });
      console.log(sorted_date);
      return sorted_date;
    },
    groupFixturesByLeague(picks) {
      const leagues = {};
      picks.forEach(pick => {
        var { league_id, league_name, country_name, iso } = pick;

        var group = leagues[league_id];
        if (!group) {
          leagues[league_id] = {
            name: league_name,
            picks: [],
            country_name,
            iso
          };
        }
        leagues[league_id].picks.push(pick);
      });
      return leagues;
    },
    getStrikeRate(picks) {
      const picks_with_hit = picks.filter(x => x.strike);
      // const picks_with_hit_or_miss = picks.filter(x => x.strike != null);
      return Math.round((picks_with_hit.length / picks.length) * 100) || 0;
    },
    getFairOdd(strikeRate) {
      if (strikeRate == 0) {
        return 0;
      }
      return (1 / (strikeRate / 100)).toFixed(2);
    },

    async deletePick(id) {
      if (
        confirm(
          "Are you sure you want ot delete this pick? This action is irreversible!"
        )
      ) {
        await this.$axios.get("/user/strategies/picks/delete/" + id);
      }

      const index = this.picks.findIndex(x => x._id == id);
      console.log("WOW", index);
      if (index >= 0) {
        this.picks.splice(index, 1);
      }
    },
    closeStats() {
      this.selected_fixture_id = null;
      this.show_fixture_details = false;
    },
    async deleteLeague(league_id) {
      const params = { strategy_id: this.filter.id, league_id };
      await this.$axios.$get("/user/strategies/picks/league/delete/", {
        params
      });

      this.picks = this.picks.filter(pick => pick.league_id != league_id);
    },
    async getFixture(id) {
      const fixture = await this.$axios.$get("/user/fixtures/id/" + id);
      return fixture;
    },
    async getFixture(id) {
      const fixture = await this.$axios.$get("/user/fixtures/id/" + id);
      return fixture;
    },

    // async showStats(id) {
    //   console.log("FIXTUREID", id);
    //   const index = this.picks.findIndex(x => x.id == id);
    //   if (index >= 0) {
    //     const pick = this.picks[index];
    //     var fixture = pick.fixture;
    //     if (!fixture) {
    //       fixture = await this.getFixture(pick.fixture_id);
    //       this.picks[index].fixture = fixture;
    //     }
    //     this.selected_fixture = fixture;
    //   }
    // },
    async clearStrike() {
      const params = { strategy_id: this.filter.id };
      await this.$axios.$get("/user/strategies/picks/clearstrike", { params });
      await this.getPicks(this.filter.id);
    },
    async getPicks(strategy_id) {
      this.loading = true;
      const params = { strategy_id, date: this.selected_date };
      const { picks } = await this.$axios.$get("/user/strategies/picks/", {
        params
      });
      var sending_time = Math.max(...picks.map(pick => pick.sending_time));
      // console.log(picks);
      picks.sort((x, y) => {
        x.sending_time - y.sending_time;
      });
      this.picks = picks.map(pick => {
        return {
          ...pick.fixture,
          ...pick
        };
      });
      this.loading = false;
      this.active_date = this.$moment
        .utc(sending_time * 1000)
        .local()

        .format("LL");
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";

@import "~/assets/scss/breakpoints";

.footy-small-button {
  padding: 13px 16px;
}
.picks-head {
  display: flex;
  align-items: center;
}
.picks-breakdown-thead-tr {
  th {
    padding: 4px 16px;
  }
}
.picks-breakdown-tbody-tr {
  border: 1px solid #f0f1f0;

  td {
    padding: 28px 20px;
  }
}
.pick-details {
  display: flex;
  margin-bottom: 20px;
  margin-top: 20px;
  gap: 20px;
  .pick-details-items {
    display: flex;
    flex: 1;
    flex-shrink: 0;
    gap: 20px;
    .calc-stats {
      background: #ffffff;
      border: 1px solid #d5ded5;
      box-sizing: border-box;
      border-radius: 12px;
      display: flex;
      padding: 18px;
      flex: 1;
      justify-content: space-between;
      // min-width: 270px;
      // margin-right: 20px;
      vertical-align: middle;

      .title {
        color: #60685f;
      }
    }
  }
}

@media screen and (max-width: $lg) {
  .pick-details {
    .pick-details-items {
      display: flex;
      width: 100%;
      justify-content: center;
      text-align: center;
      .calc-stats {
        // flex: 1;
        padding: 4px;
        flex-direction: column;
        h3 {
          font-size: 14px;
          line-height: 21px;
        }
      }
    }
  }
}
.country-name-wrapper {
  font-size: 16px;
  line-height: 24px;
  text-transform: uppercase;
  margin-bottom: 3px;
  font-family: Poppins;
  align-items: center;
  display: flex;
  color: $grey;
  background: #f7f9f7;
  padding: 7px;
}
.date-wrapper {
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: 9px;
  color: $grey;
  padding: 7px;
}
</style>
