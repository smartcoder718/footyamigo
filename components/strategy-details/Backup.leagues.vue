<template>
  <div class="d-grid grid-col-md-2 gap-20">
    <div class="footy-page-container flex-col">
      <div class="include-exclude-title">
        <h3>Included</h3>
        <h4 class="text-grey">{{ included_ids.length }} Leagues</h4>
      </div>
      <!-- {{leagues}} -->
      <div>
        <div
          v-for="country in countries"
          :key="country.id"
          class="country-league"
        >
          <div class="country-name-wrapper">
            <span
              class="flag-icon mr-2"
              :class="'flag-icon-' + (lowerCase(country.iso) || 'un')"
            >
            </span>
            {{ country.name }}
          </div>
          {{ country.included }}
          <div class="leagues-in-country">
            <div
              class="league-info-wrapper"
              v-for="league_id in country.included"
              :key="'league' + league_id"
            >
              <div class="league-name-outcome">
                <div>
                  {{ leagues[league_id].name }}
                </div>
                <div>
                  <div>
                    {{ filter.outcome.label }}
                  </div>
                  <div>
                    NA% (0/0)
                  </div>
                </div>
              </div>
              <div>
                <ArrowCheckbox
                  v-model="country.excluded"
                  :checkbox_value="league_id"
                />
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="footy-page-container flex-col">
      <div class="include-exclude-title">
        <h3>Included</h3>
        <h4 class="text-grey">{{ included_ids.length }} Leagues</h4>
      </div>
      <!-- {{leagues}} -->
      <div>
        <div
          v-for="country in countries"
          :key="country.id"
          class="country-league"
        >
          <div class="country-name-wrapper">
            <span
              class="flag-icon mr-2"
              :class="'flag-icon-' + (lowerCase(country.iso) || 'un')"
            >
            </span>
            {{ country.name }}
          </div>
          {{ country.excluded }}
          <div class="leagues-in-country">
            <div
              class="league-info-wrapper"
              v-for="league_id in country.excluded"
              :key="'league' + league_id"
            >
              <div class="league-name-outcome">
                <div>
                  {{ leagues[league_id].name }}
                </div>
                <div>
                  <div>
                    {{ filter.outcome.label }}
                  </div>
                  <div>
                    NA% (0/0)
                  </div>
                </div>
              </div>
              <div>
                <ArrowCheckbox
                  v-model="country.included"
                  :checkbox_value="league_id"
                />
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
Set.prototype.intersection = function(otherSet) {
  // creating new set to store intersection
  var intersectionSet = new Set();

  // Iterate over the values
  for (var elem of otherSet) {
    // if the other set contains a
    // similar value as of value[i]
    // then add it to intersectionSet
    if (this.has(elem)) intersectionSet.add(elem);
  }

  // return values of intersectionSet
  return intersectionSet;
};

import FixtureStatsWrapper from "~/components/FixtureStatsWrapper";
export default {
  props: {
    id: String,
    type: String,
    filter: Object
  },
  data() {
    return {
      include: "",
      exclude: "",
      includeLength: "",
      excludeLength: "",
      league_ids: [],
      included_ids: [],
      excluded_ids: [],
      countries: [],
      included: []
    };
  },
  components: {
    FixtureStatsWrapper
  },
  // computed: {
  //   included() {
  //     return new Set(this.filter.leagues);
  //   },
  //   excluded() {
  //     const included = new Set(this.included);
  //     return this.$store.state.leagues
  //       .filter(league => {
  //         console.log(league.value, included);
  //         return !included.has(league.value);
  //       })
  //       .map(league => league.value);
  //   }
  // },
  computed: {
    leagues() {
      return this.$arrayToObject(this.$store.state.leagues_raw, "id");
    },
    league_ids_all() {
      return this.$store.state.leagues.map(league => league.value);
    }
  },
  mounted() {
    //this.getFilter(this.id);
    this.included_ids = this.$jsonify(this.filter.leagues);
    //this.$store.dispatch("fetchLeagues");
    this.getLeagues();
  },
  methods: {
    lowerCase(value) {
      if (value) {
        return value.toLowerCase();
      } else {
        return "";
      }
    },
    async getLeagues() {
      try {
        const leagues = await this.$axios.$get("/user/leagues/countries");
        this.countries = leagues;
        // this.leagues = leagues;
        const existing = new Set(this.included_ids);
        this.excluded_ids = leagues.filter(
          league => !existing.has(league.league_id)
        );
        console.log(this.countries);
      } catch (err) {
        console.log(err);
      }
    },
    async getFilter(id) {
      try {
        const params = { id };
        const filter = await this.$axios.$get("/user/strategies/id", {
          params
        });
        this.filter = filter;
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>
<style lang="scss">
.country-league {
  display: flex;
  flex-direction: column;
  .leagues-in-country {
    display: grid;
    gap: 4px;
    .league-info-wrapper {
      background: #ffffff;
      border: 1px solid #f0f1f0;
      border-radius: 8px;
      // max-width: 500px;
      // width: 100%;
      // height: 64px;
      padding: 12px 16px;
      display: flex;
      // justify-content: space-between;
      align-items: center;
      .league-name-outcome {
        display: flex;
        flex: 1;
        justify-content: space-between;
        align-items: center;
      }
      // padding: 0 16px;
      // margin-bottom: 4px;
    }
  }
}
.include-exclude-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.leagues-container {
  // .footy-page-container {
  //   max-height: 650px;
  //   overflow-y: auto;
  // }
  .inner-heading {
    font-weight: 600 !important;
  }

  .country-name-wrapper {
    font-weight: 600;
    font-size: 16px;

    line-height: 24px;
    text-transform: uppercase;
    color: rgba(34, 38, 34, 0.7);
  }
  .league-text,
  h3.name {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;

    &.text-light {
      color: #60685f !important;
      font-size: 14px;
      line-height: 21px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    &.text-right {
      font-size: 14px;
      line-height: 21px;
      color: #60b15a;
    }
  }
}
// .leagues-container {
//   .common-tab {
//   }

//   .nav-tabs {
//     justify-content: space-between;
//     border: none;
//     li {
//       flex: 0 0 50%;
//       max-width: 50%;
//       margin-bottom: -2px;
//       // padding-bottom: 12px;
//       .nav-link {
//         margin-bottom: 0px;
//         border: none;
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//         padding: 0px;
//         min-height: 70px;
//         h3,
//         p {
//           font-weight: 600;
//           font-size: 20px;
//           line-height: 30px;
//         }
//         p {
//           color: #60685f;
//           font-size: 16px;
//           line-height: 24px;
//         }
//         &.active {
//           border-bottom: 2px solid #60b15a;
//         }
//       }
//     }
//     border-bottom: 2px solid #e0e9e0;
//   }
//   .tab-content {
//     .country-name-wrapper {
//       background: none;
//     }
//     .league-info-wrapper {
//       min-height: 140px;
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       background: #ffffff;
//       border: 1px solid #f0f1f0;
//       border-radius: 8px;
//       margin-bottom: 12px;
//       padding: 16px;
//       height: auto;
//       align-items: flex-start;
//       .league-content {
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         margin-bottom: 16px;
//         width: 100%;
//         .name {
//           font-weight: 600;
//           font-size: 16px;
//           line-height: 24px;

//           flex: 0 0 75%;
//           max-width: 75%;
//           max-width: 68%;
//           width: 100%;
//           white-space: wrap;
//         }
//         .content {
//           flex: 0 0 25%;
//           max-width: 25%;
//           width: 100%;
//         }
//       }
//     }
//   }
// }
</style>
