<template>
  <div
    style="display: flex; flex-direction: column; background: white"
    class="fixture-details"
  >
    <template v-if="fixture">
      <div class="box-holder position-relative" style="flex: 1">
        <div class="mr-sticky box-inner">
          <div class="d-flex" style="align-items: center; column-gap: 10px">
            <h4 class="text-primary" v-if="fixture.stats">
              {{ fixture.stats.home.goals }}-{{ fixture.stats.away.goals }}
            </h4>
            <h6
              class="text-primary"
              v-if="
                fixture.status in
                { LIVE: 1, HT: 1, PEN_LIVE: 1, BREAK: 1, ET: 1 }
              "
            >
              {{ fixture.minute }}'
            </h6>
          </div>

          <b-button
            variant="white"
            class="float-right rounded"
            @click="$emit('closestats')"
          >
            <span class="material-icons"> close </span>
          </b-button>

          <div class="teams-container d-flex flex-nowrap">
            <div class="team d-flex align-items-center">
              <b-img :src="home_logo" class="team-logo mr-2"></b-img>
              <h4>{{ fixture.home_name | truncate }}</h4>

              <span class="text-grey mx-2">v</span>
            </div>
            <div class="team ml-0 d-flex align-items-center">
              <b-img :src="away_logo" class="team-logo mr-2"></b-img>
              <h4>{{ fixture.away_name | truncate }}</h4>
            </div>
          </div>

          <div class="fixture-timings mb-3">
            <span class="mr-2 text-grey" v-if="fixture.status == 'FT'"
              >{{ fixture.ft_score }} FT
              {{ fixture.ht_score ? "  " + fixture.ht_score + " HT" : "" }}
            </span>

            <span class="mr-2 text-grey" v-if="!liveMode">{{
              $moment
                .utc(fixture.timestamp * 1000)
                .local()
                .format("lll")
              /*.format("DD HH:mm ddd YYYY n ")*/
            }}</span>
          </div>

          <footy-tab-select :options="scrollerOptions" v-model="scroller">
          </footy-tab-select>
          <template v-if="scroller == 'Stats'">
            <footy-tab-select
              name="statmenu"
              :options="statOptions"
              v-model="stat"
              class="statmenu"
              size="sm"
            >
            </footy-tab-select>

            <footy-tab-select
              name="submenu"
              :options="submenuOptions"
              v-model="submenu"
              size="sm"
              v-if="['Goals', 'Corners'].includes(stat)"
            >
            </footy-tab-select>
            <b-row no-gutters v-if="showLocationDropdown">
              <b-col>
                <div class="mr-1">
                  <footy-dropdown-select
                    id="location-home"
                    v-model="location.home"
                    :options="locationOptions"
                  ></footy-dropdown-select>
                </div>
              </b-col>
              <b-col>
                <div class="ml-1">
                  <footy-dropdown-select
                    id="location-away"
                    v-model="location.away"
                    :options="locationOptions"
                  ></footy-dropdown-select>
                </div>
              </b-col>
            </b-row>
          </template>
        </div>
        <div class="box-inner pb-4">
          <div v-if="scroller == 'In-Play'">
            <InPlayScroller :fixture="fixture"> </InPlayScroller>
          </div>
          <div v-else-if="scroller == 'Create Alert'">
            <CreateAlertScroller
              @addOdd="addOdd"
              :fixture="fixture"
              :liveMode="liveMode"
            >
            </CreateAlertScroller>
          </div>
          <div v-else-if="scroller == 'Stats'">
            <StatsScroller
              :fixture="fixture"
              ref="stats"
              :stat="stat"
              :submenu="submenu"
           
              :location="location"
              :type="selected_type"
              :stats="stats"
            >
            </StatsScroller>
          </div>
          <div v-else-if="scroller == 'Value'">
            <ValueScroller :fixture="fixture"> </ValueScroller>
          </div>
          <div v-else-if="scroller == 'Alerts'">
            <AlertsScroller :fixture="fixture"> </AlertsScroller>
          </div>
          <div v-else-if="scroller == 'Odds'">
            <OddsScroller :fixture="fixture"> </OddsScroller>
          </div>
          <div v-else-if="scroller == 'Results'">
            <ResultsScroller
              :fixture="fixture"
              :h2h_results.sync="fixture.h2h_results"
              :h2h_updated.sync="fixture.h2h_updated"
            >
            </ResultsScroller>
          </div>
        </div>

        <div class="modal-bottom" v-if="alertModal">
          <b-button
            variant="white"
            class="float-right rounded"
            @click="closeModal()"
          >
            <span class="material-icons"> close </span>
          </b-button>
          <div class="header-area">
            {{ odd ? odd.title : "" }} - {{ odd ? odd.label : "" }}
          </div>
          <div style="margin: 10px 0px">
            <div class="selectable-title active">Hits</div>
          </div>

          <footy-radio
            :options="timerOptions"
            v-model="form.minute"
            id="minute"
            customInput
          >
            <template v-slot:form-radio>
              <b-form-radio
                :value="
                  !getValues(timerOptions).includes(form.minute)
                    ? form.minute
                    : 0
                "
                class="custom-radio-slot"
              >
                <b-form-input
                  v-if="getValues(timerOptions).includes(form.minute)"
                  placeholder="Custom"
                  type="number"
                ></b-form-input>
                <b-form-input
                  v-else
                  v-model.number="form.minute"
                  type="number"
                ></b-form-input>
              </b-form-radio>
            </template>
          </footy-radio>

          <div class="current-odd" v-if="odd.value">
            {{ odd.value }}
          </div>

          <div class="d-flex align-items-center my-4">
            <label class="mb-0 mr-3 add-note">Add Note</label>
            <footy-switch
              v-model="showNote"
              :whitebg="true"
              name="check-button"
              switch
            >
            </footy-switch>
          </div>

          <footy-input v-if="showNote" v-model="form.note"> </footy-input>

          <b-button
            text="Save Alert"
            variant="primary"
            block="true"
            icon="notifications"
            @click="createQuickAlert"
            :disabled="disabledButton"
          >
            Save Alert
          </b-button>
          <!-- {{ form }} -->
        </div>
      </div>

      <div
        class="fixture-details-footer"
        v-if="scroller == 'In-Play' || scroller == 'Stats'"
      >
        <h6 class="details-addon text-white text-capitalize">
          <div v-if="fixture.weather" class="weather-text">
            {{ fixture.weather.temperature_celcius.temp }}°C,
            {{ fixture.weather.type }}
          </div>
        </h6>

        <div class="details-addon">
          <b-overlay
            :show="loading"
            style="flex: 1"
            v-if="scroller == 'Stats' && stats.home && stats.away"
            spinner-small
          >
            <b-dropdown
              dropup
              size="sm"
              class="footy-tab-select py-0 px-0"
              no-caret
              toggle-class="centered"
            >
              <template slot="button-content" disabled>
                {{ stat_types[selected_type].text }}

                <span class="ml-1">
                  <img :src="`/icons/down.svg?inline`" alt="" />
                </span>
              </template>
              <b-dropdown-item
                v-for="(type, i) in stat_types"
                :key="i"
                @click="selected_type = type.value"
                :disabled="!stats.home[type.value] && type.value != 'all'"
              >
                {{ type.text }}
              </b-dropdown-item>
            </b-dropdown>
          </b-overlay>
          <div v-else style="flex: 1"></div>
          <div
            class="footy-tab-select h2h-stats d-flex flex-nowrap centered"
            @click="scroller = 'Results'"
          >
            <span> H2H Stats </span>
            <span class="ml-md-2 ml-1">
              <img :src="`/icons/side.svg?inline`" alt="" />
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import InPlayScroller from "~/components/partials/scrollers/InPlayScroller";
import AlertsScroller from "~/components/partials/scrollers/AlertsScroller";
import StatsScroller from "~/components/partials/scrollers/StatsScroller";
import ValueScroller from "~/components/partials/scrollers/ValueScroller";

import OddsScroller from "~/components/partials/scrollers/OddsScroller";
import ResultsScroller from "~/components/partials/scrollers/ResultsScroller";
import CreateAlertScroller from "~/components/partials/scrollers/CreateAlertScroller";

export default {
  props: {
    initialFixture: Object,
    liveMode: Boolean,
    fixture_id: Number,
  },
  components: {
    ValueScroller,
    OddsScroller,
    AlertsScroller,
    StatsScroller,
    InPlayScroller,
    CreateAlertScroller,
    ResultsScroller,
  },

  data() {
    return {
      fixture: null,
      stats: { home: {}, away: {} },
      alertModal: false,
      selected_type: "all",
      stat_types: {
        all: { value: "all", text: "All Games", disabled: false },
        last_25: { value: "last_25", text: "Last 25", disabled: true },
        last_10: { value: "last_10", text: "Last 10", disabled: true },
        last_7: { value: "last_7", text: "Last 7", disabled: true },
        last_5: { value: "last_5", text: "Last 5", disabled: true },
      },
      statOptions: ["General", "Goals", "Half", "Corners", "Cards", "H2H"],
      stat: "General",
      scroller: "Stats",
      submenuOptions: ["Stats", "Timings"],
      submenu: "Stats",
      showNote: false,
      disabledButton: false,
      location: {
        home: "overall",
        away: "overall",
      },
      locationOptions: [
        { text: "HOME", value: "home" },
        { text: "AWAY", value: "away" },
        { text: "OVERALL", value: "overall" },
      ],
      timerOptions: [
        { text: "1.60 Mins", value: 1.6, disabled: false },
        { text: "1.80 Mins", value: 1.8, disabled: false },
        { text: "2.00 Mins", value: 2, disabled: false },
        { text: "2.60 Mins", value: 2.6, disabled: false },
        { text: "3.10 Mins", value: 3.1, disabled: false },
      ],
      loading: false,
      form: {
        type: "result",
        result: "home_win",
        minute: 0,
        note: "",
      },
      odd: null,
    };
  },
  beforeMount() {
    if (!this.initialFixture) {
      this.fetchFixture();
    } else {
      // console.log("FIXTURES SET FROM PROPS");
      this.$set(this, "fixture", this.initialFixture);
      this.getStats();
    }
  },
  mounted() {},
  methods: {
    openh2h() {
      this.$refs.stats.stat = "Results";
    },
    toggleType(value) {
      this.selectedType = value;
    },

    async fetchFixture() {
      const fixture = await this.$axios.$get(
        "/user/fixtures/" + this.fixture_id
      );
      this.$set(this, "fixture", fixture);
      const fetchFixture = this.fetchFixture;
      console.log(fixture.status);
      if (["LIVE", "HT", "PEN_LIVE", "BREAK", "ET"].includes(fixture.status)) {
        setTimeout(() => {
          fetchFixture();
        }, 20 * 1000);
      }

      this.getStats();
      // console.log(fixture);
    },
    async getStats() {
      try {
        this.loading = true;
        const stats = await this.$axios.$get(
          "/user/stats/" + this.fixture.fixture_id
        );

        // for (var last in stats) {
        //   const stat = stats[last];
        //   if (stat.home && stat.away) {
        //     this.stat_types[last].disabled = false;
        //   }
        // }
        Object.assign(this.stats, stats);
        if (this.fixture.status == "LIVE") {
          //this.liveMode = true;
          this.scroller = "In-Play";
        }
        // console.log(stats);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    getValues(items) {
      return items.map((i) => i.value);
    },
    async createQuickAlert() {
      // const quick_alert = await this.$axios.$post(
      //   "/user/quickalerts/create",
      //   this.form
      // );
      // console.log(quick_alert);
      // return quick_alert;
      this.closeModal();
    },

    closeModal() {
      this.alertModal = false;
    },
  },
  computed: {
    showLocationDropdown() {
      var stats_without_timings = ["General", "Half", "Cards"];
      var stats_with_timings = ["Goals", "Corners"];
      return (
        this.scroller == "Stats" &&
        (stats_without_timings.includes(this.stat) ||
          (stats_with_timings.includes(this.stat) && this.submenu == "Stats"))
      );
    },
    has_stats() {
      return this.stats.home && this.stats.away;
    },
    // fixture() {
    //   const fixture = this.fixture;
    //   return fixture;
    //   // // console.log(this.stats[this.last], this.stats);
    //   // if (this.stats && this.stats[this.last]) {
    //   //   const { home, away } = this.stats[this.last];
    //   //   return { ...fixture, home, away };
    //   // } else {
    //   //   return fixture;
    // },
    scrollerOptions() {
      if (this.fixture) {
        if (this.fixture.status == "FT") {
          return ["In-Play", "Stats", "Value", "Odds", "Results"];
        } else if (this.fixture.status == "NS") {
          return ["Stats", "Value", "Odds", "Results"];
        } else {
          return ["In-Play", "Stats", "Odds", "Value", "Results"];
        }
      }
    },
    winordraw() {},
    home_logo() {
      if (this.fixture && this.fixture.home_logo) {
        return this.fixture.home_logo;
      }
      return "https://cdn.sportmonks.com/images/soccer/team_placeholder.png";
    },
    away_logo() {
      if (this.fixture && this.fixture.away_logo) {
        return this.fixture.away_logo;
      }
      return "https://cdn.sportmonks.com/images/soccer/team_placeholder.png";
    },
  },
  filters: {
    whichHalf(value) {
      return Number(value) < 46 ? "1st Half" : "2nd Half";
    },
    truncate(value) {
      return value.length > 12 ? value.slice(0, 11) + "…" : value;
    },
  },
  watch: {
    "form.note": function (val) {
      if (val == "") {
        this.disabledButton = true;
      } else {
        this.disabledButton = false;
      }
    },
    showNote(val) {
      if (val && this.form.note == "") {
        this.disabledButton = true;
      } else {
        this.disabledButton = false;
      }
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";
@import "~assets/scss/breakpoints";
.mr-sticky {
  background: $light;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 2;
}
.fixture-details-top {
  display: flex;
  justify-content: space-between;
  column-gap: 12px;

  width: 100%;
  .fixture-details-team-time {
    display: flex;
    flex: 1;
    .fixture-details-close {
    }
    .fixture-name {
      display: flex;
      column-gap: 8px;
      flex: 1;
      .team-name-logo {
        display: flex;
        flex: 1;
        h4 {
          max-width: 50px;
          overflow: hidden;

          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}

.fixture-details {
  right: 1rem;
  bottom: 1rem !important;
  left: auto;
  top: 10%;
  border-radius: 15px;
  width: 564px;
  position: fixed;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  z-index: 100;
  font-weight: 500;
}

@media (max-width: $lg) {
  .fixture-details {
    position: inherit;
    // overflow-y: auto;
    width: 100%;
    height: 100%;
    border-radius: 20px 20px 0px 0px;
  }
}

.fixture-details-footer {
  background: #60b15a;
  border-radius: 0px 0px 20px 20px;
  display: flex;
  padding: 20px;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  flex-grow: 0;
  vertical-align: middle;
  .details-addon {
    display: flex;
    flex: 1;
    font-size: 12px;
    line-height: 18px;
    display: flex;
    align-items: center;
    vertical-align: middle;
  }
  .custom-select {
    font-size: 12px;
    line-height: 18px;
  }
  .h2h-stats {
    cursor: pointer;
    width: 95px !important;
    // width: 100% !important;
    display: flex;
    justify-content: center;
    height: 28px;
    padding: 0px !important;
  }
  .footy-tab-select {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 5px 12px;
    margin: 0px 2px;
    flex: 1;
    color: $dark-1;
    /* white */

    background: #ffffff;
    border-radius: 4px;
    overflow-x: unset !important;
    .btn-secondary {
      background: none !important;
    }
    .dropdown-menu.show {
      box-shadow: 0px 6px 40px rgb(0 0 0 / 7%);
      border-radius: 12px;
      padding: 0;
      border: none;
      min-width: 6rem;
      transform: none !important;
      z-index: 9999;
      right: 0;
      bottom: 28px;
      right: 0;
      top: auto !important;
    }
    .dropdown-toggle-no-caret {
      justify-content: center !important;
    }
  }
}
.box-holder {
  background: #f7f9f7;
  border-radius: 20px 20px 0px 0px;

  .box-inner {
    border-radius: 20px 20px 0px 0px;
    padding: 20px 20px 0px 20px;
  }
  max-height: 100%;

  overflow-y: auto;
  overflow: auto;
  .title {
    font-size: 24px;
    line-height: 36px;
    /* identical to box height */
    color: $dark-1;
  }
  .sub-title {
    font-size: 14px;
    line-height: 21px;
    color: #60685f;
    margin-bottom: 20px;
    span {
      margin-right: 10px;
    }
    span:last-child {
      color: #60b15a;
    }
  }

  .type-a {
    button {
      font-size: 15px;
    }
  }
  .submenu {
    margin-bottom: 3px;
    button {
      font-size: 12px;
    }
  }
  .row-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .dropdown {
      button {
        text-align: left;

        font-size: 16px;
        line-height: 24px;
        text-transform: uppercase;
        border-radius: 4px;
      }

      .dropdown-item {
        font-weight: 500;
        padding: 12px;
        text-transform: uppercase;
      }
    }
    .col-item {
      flex: 1;
    }
    .col-item:first-child {
      margin-right: 6px;
    }
    .col-item:last-child {
      margin-left: 6px;
    }
  }
  .numbers {
    display: flex;
    justify-content: space-between;
    text-transform: uppercase;

    font-size: 16px;
    line-height: 24px;
    margin-bottom: 10px;
    span:nth-child(2) {
      color: $dark-1;

      opacity: 0.7;
    }
  }
  .progress-holder {
    display: flex;
    .progress {
      background: #ffffff;
      height: 12px;
    }
  }
}

.box-holder {
  .teams-container {
    display: flex;
    h4,
    .text-gray,
    span {
      font-style: normal;
      font-weight: 600;
      font-size: 24px;
      line-height: 36px;
      display: flex;
      align-items: center;
    }
    h4 {
      white-space: nowrap;
    }
    .team-logo {
      margin-bottom: 0px;
    }
  }
}

.modal-bottom {
  width: 470px;
  padding: 15px;
  border-radius: 15px 15px 0 0;
  z-index: 50;
  right: 3.8rem;
  bottom: 1rem;
  left: auto;
  border-radius: 15px;
  position: fixed;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  z-index: 101;
  background: #fff;
  .selectable-title {
    height: 30px;
    border-radius: 100px;
    display: -webkit-inline-box;
    display: inline-flex;
    cursor: pointer;
    -webkit-box-align: center;
    align-items: center;
    padding: 0 10px;
    font-size: 0.9rem;
    &.active {
      font-weight: 500;
      background: #60b15a;
      color: #fff;
    }
  }
  .current-odd {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 100%;
    width: 100%;
    background-color: #60b15a;
    color: #fff;
    font-size: 1rem;
    font-weight: 500;

    height: 50px;
    // cursor: pointer;
  }
}
@media (max-width: $lg) {
  .box-holder {
    .box-inner {
      padding: 16px 16px 0px 16px;
    }

    .teams-container {
      // flex-direction: column;
      // align-items: flex-start;
      h4,
      .text-gray,
      span {
        font-size: 16px;
      }
    }
  }
  .fixture-details-footer {
    border-radius: 0px !important;
  }
  .weather-text {
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis;
    // font-size: 11px;
  }
  .modal-bottom {
    width: 100vw;
    bottom: 0;
    background: #f7f9f7;
    border-radius: 20px 20px 0px 0px;
    left: 0;
    right: 0;
  }
}
</style>
