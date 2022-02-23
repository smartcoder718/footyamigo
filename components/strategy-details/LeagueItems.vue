<template>
  <b-overlay :show="loading" class="w-100">

    <div class="footy-page-container flex-col w-100" style=" gap:13px;" v-if="$store.state.leagues">
      <slot name="heading">
        <div class="include-exclude-title d-none d-lg-flex">
          <h3>{{ title }}</h3>

          <h4 class="text-grey">{{ count }} Leagues</h4>
        </div>
      </slot>
      <input type="hidden" :value="count" />
      <div>
        <b-input
          type="text"
          placeholder="Filter...."
          class="footy-input w-100"
          v-model="searchText"
          style="height:44px"
        />
      </div>
      <!-- {{leagues}} -->
      <div
        class="list-of-countries"
        style="max-height: 746px; overflow-y: auto;"
      >
        <template v-for="country in filteredCountries">
          <div
            :key="country.id"
            v-if="country[itemkey].length"
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

            <div class="leagues-in-country ">
              <div
                class="league-info-wrapper"
                :class="[itemkey]"
                v-for="league_id in country[itemkey]"
                :key="'league' + league_id"
              >
                <div class="league-name-outcome">
                  <div class="league-name-ellipsis">
                    {{ leagues[league_id].name }}
                  </div>
                  <div class="text-right">
                    <h6 class="text-grey">
                      {{ filter.outcome.label }}
                    </h6>
                    <h6 class="text-primary">
                      NA% (0/0)
                    </h6>
                  </div>
                </div>
                <div class="block-on-mobile">
                  <ArrowCheckbox
                    v-model="country[itemkey]"
                    :checkbox_value="league_id"
                    @click="uncheck(league_id)"
                    :reversed="itemkey == 'excluded'"
                  />
                  <input
                    type="checkbox"
                    hidden
                    v-model="country[opposite]"
                    :id="`${opposite}-` + league_id"
                    :value="league_id"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </b-overlay>
</template>

<script>
export default {
  props: {
    title: String,
    countries: Array,
    leagues: Object,
    itemkey: String,
    filter: Object,
    loading: Boolean
  },
  data() {
    return {
      searchText: ""
    };
  },
  computed: {
    opposite() {
      return this.itemkey == "included" ? "excluded" : "included";
    },
    count() {
      var sum = 0;
      for (var country of this.countries) {
        sum += country[this.itemkey].length;
      }
      this.$emit("updateCount", sum);
      return sum;
    },
    filteredCountries() {
      if (this.searchText.length === 0) return this.countries;
      const pattern = new RegExp(this.searchText, "gi");

      return this.countries.filter(country => {
        return (
          country.name.search(pattern) != -1 ||
          country.leagues.some(
            league => league.league_name.search(pattern) != -1
          )
        );
      });
    }
  },
  methods: {
    uncheck(id) {
      document.querySelector(`#${this.opposite}-` + id).click();
    },
    lowerCase(value) {
      if (value) {
        return value.toLowerCase();
      } else {
        return "";
      }
    }
    // filter(items, key) {
    //   if (this.searchText.length === 0) return items;
    //   const pattern = new RegExp(this.searchText, "gi");

    //   return this.items.filter(country => {
    //     return (
    //       country[key].search(pattern) != -1 ||
    //       country.leagues.some(
    //         league => league.league_name.search(pattern) != -1
    //       )
    //     );
    //   });
    // }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";

@import "~/assets/scss/breakpoints";
.list-of-countries {
  display: grid;
  row-gap: 26px;
  font-weight: 500;
  ::-webkit-scrollbar-thumb {
    //background: #60685f7c;
    background: rgba(192, 192, 192, 0.445);
  }
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
        gap: 12px;
        // justify-content: space-between;
        align-items: center;
        &.excluded {
          flex-direction: row-reverse;
        }
        .league-name-outcome {
          display: flex;
          flex: 1;
          justify-content: space-between;
          align-items: center;
          .league-name-ellipsis {
            width: 220px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
          }
        }
        // padding: 0 16px;
        // margin-bottom: 4px;
      }
    }
  }
}
@media screen and (max-width: $lg) {
  .list-of-countries {
    .country-league {
      .leagues-in-country {
        .league-info-wrapper {
          flex-direction: column;
          &.excluded {
            flex-direction: column;
          }
        }
      }
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
</style>
