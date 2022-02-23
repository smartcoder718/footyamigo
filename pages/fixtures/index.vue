<template>
  <b-row>
    <b-col>
      <div class="p-lg-15">
        <section
          class="footy-page-header d-grid grid-col-md-2 gap-20"
          style="display: grid !important"
        >
          <div class="fixture-page-title-and-switch">
            <h1 class="footy-page-title">{{ pageTitle }}</h1>
            <HowItWorks location="fixtures" />
            <b-badge class="footy-button live-button" variant="white">
              <div class="mr-3">Live</div>
              <footy-switch v-model="liveMode"> </footy-switch>
            </b-badge>
          </div>
          <div style="display: grid; align-items: center">
            <div class="vishal-search-box-container">
              <form class="vishal-search-box">
                <span class="mx-2">
                  <img :src="`/icons/search.svg?inline`" alt="" />
                </span>

                <input
                  placeholder="Search"
                  v-model="searchText"
                  class="vishal-search-input"
                />
                <div v-if="searchLoading">
                  <b-spinner variant="grey" label="Spinning"></b-spinner>
                </div>

                <span
                  class="mx-2 cursor-pointer"
                  v-else-if="searchText"
                  @click="closeSearch"
                >
                  <img :src="`/icons/close.svg?inline`" alt="" />
                </span>
              </form>

              <b-list-group
                size="sm"
                variant="link"
                class="vishal-search-box-items shadow-sm rounded-10"
                toggle-class="text-decoration-none"
                no-caret
                no-flip
                v-if="showSearchResults"
                ref="searchDropdown"
              >
                <b-list-group-item>
                  <footy-tab-select
                    :options="searchTypes"
                    v-model="searchType"
                    class="mb-0"
                  >
                  </footy-tab-select>
                </b-list-group-item>
                <template v-if="searchResults.length">
                  <b-list-group-item
                    class="vishal-search-box-item shadow-sm"
                    v-for="fixture in searchResults"
                    :key="'search' + fixture.fixture_id"
                    href="#"
                    @click="showStats(fixture.fixture_id)"
                  >
                    <div>
                      <span class="flag-icon" :class="$getFlag(fixture.iso)">
                      </span>
                    </div>
                    <div class="">
                      <h6 class="text-grey">
                        <span v-if="fixture.ft_score" class="text-primary"
                          >FT: {{ fixture.ft_score }}
                        </span>
                        {{
                          $moment(fixture.timestamp * 1000)
                            .local()
                            .format("lll")
                        }}
                        -
                        {{ fixture.league_name }}
                      </h6>
                      <div>
                        {{ fixture.fixture_name }}
                      </div>
                    </div>
                  </b-list-group-item>
                </template>
                <template v-else>
                  <b-list-group-item class="vishal-search-box-item">
                    <div class="">No Results!</div>
                  </b-list-group-item>
                </template>
              </b-list-group>
            </div>
          </div>
        </section>

        <b-row class="founds-container" no-gutters>
          <b-col md="6" sm="12" class="d-flex align-items-center">
            <h6 class="mb-3 m-md-0">
              {{ fixturesCount }} Match{{ fixturesCount > 1 ? "es" : "" }} Found
            </h6>
          </b-col>
          <b-col md="6" sm="12">
            <section class="">
              <div class="filter-items-wrapper scroll-on-mobile column-gap-10">
                <FixtureFilterPicker @search="filterFixtures">
                </FixtureFilterPicker>
                <FixtureSettingsPicker v-model="selected_settings" />
                <FixtureStatPicker v-model="selected_stat" />
                <FixtureDatePicker v-model="selected_date" v-if="!liveMode" />
              </div>
            </section>
          </b-col>
          <b-col cols="12"> </b-col>
        </b-row>
        <hr />

        <div class="fixture-list fixture-stats-section">
          <!--FixtureFilterWrapper
                v-if="liveMode"
                @sortAscending="sortAscending"
                @sortDescending="sortDescending"
                @sortField="sortField"
                :title="selected_scroller.title"
                @resetFilters="resetFilters"
              /-->

          <!-- {{ selected_settings }} -->
          <FixtureInPlay
            :selected_scroller="selected_scroller"
            :liveMode="liveMode"
            :selected_stat="selected_stat"
            :selected_date="selected_date"
            @countChange="countChange"
            v-if="liveMode"
          />
          <template v-else>
            <FixtureSorted
              :selected_scroller="selected_scroller"
              :liveMode="liveMode"
              :selected_stat="selected_stat"
              :selected_date="selected_date"
              :selected_settings="selected_settings"
              @countChange="countChange"
              v-if="selected_settings.length > 0 || ruleFilters.length"
              :ruleFilters="ruleFilters"
              :key="
                selected_settings.length +
                '-' +
                selected_date +
                '-' +
                filtererId
              "
            />
            <FixturePreMatch
              :selected_scroller="selected_scroller"
              :liveMode="liveMode"
              :selected_stat="selected_stat"
              :selected_date="selected_date"
              :selected_settings="selected_settings"
              @countChange="countChange"
              v-else
            />
          </template>
        </div>

        <FixtureScrollPicker v-model="selected_scroller" />
      </div>
    </b-col>

    <b-col cols="12">
      <ModalOnMobile v-model="show_fixture_details" v-if="show_fixture_details">
        <FixtureDetails
          v-if="selected_fixture_id"
          @closestats="closeStats"
          :fixture_id="selected_fixture_id"
        >
        </FixtureDetails>
      </ModalOnMobile>
    </b-col>
  </b-row>
</template>

<script>
import FixtureScrollPicker from "~/components/fixtures-page/FixtureScrollPicker.vue";
import FixtureSettingsPicker from "~/components/fixtures-page/FixtureSettingsPicker.vue";
import FixtureStatPicker from "~/components/fixtures-page/FixtureStatPicker.vue";
import FixtureDatePicker from "~/components/fixtures-page/FixtureDatePicker.vue";
import FixturePreMatch from "~/components/fixtures-page/FixturePreMatch.vue";
import FixtureInPlay from "~/components/fixtures-page/FixtureInPlay.vue";
import FixtureSorted from "~/components/fixtures-page/FixtureSorted.vue";
import FixtureFilterPicker from "/components/common/FootyFilterFixturesDropdown.vue";
export default {
  data() {
    return {
      pageTitle: "Fixtures",
      liveMode: false,
      selected_date: new Date(),
      countries: [],
      fixturesCount: 0,
      searchResults: [],
      selected_scroller: "stats_scroller",
      selected_stat: "ft_result",
      selected_settings: [],
      selected_fixture: null,
      selected_fixture_id: null,
      show_fixture_details: false,
      searchType: "upcoming",
      liveFixturesInterval: null,
      searchText: "",
      interval: null,
      ruleFilters: [],
      searchLoading: false,
      showSearchResults: false,
      filtererId: null,
      searchTypes: [
        { value: "upcoming", text: "Upcoming" },
        { value: "results", text: "Results" },
      ],
    };
  },
  watch: {
    searchText(val) {
      // const durationInSeconds = this.$moment().diff(
      //   this.$moment(this.lastInput),
      //   "seconds"
      // );
      clearInterval(this.interval);
      if (val) {
        const instance = this;
        this.interval = setTimeout((x) => {
          instance.searchFixtures();
        }, 1000);
      } else {
        this.showSearchResults = false;
      }
    },
    searchType(val) {
      if (this.searchText) {
        this.searchFixtures();
      }
    },

    selected_settings() {
      this.liveMode = false;
    },
  },
  mounted() {
    if (this.$route.query.fixture_id) {
      this.selected_fixture_id = this.$route.query.fixture_id;
      this.show_fixture_details = true;
    }
  },
  components: {
    FixtureSettingsPicker,
    FixtureStatPicker,
    FixtureDatePicker,
    FixtureScrollPicker,
    FixturePreMatch,
    FixtureInPlay,
    FixtureSorted,
    FixtureFilterPicker,
  },

  methods: {
    async showStats(fixture_id) {
      this.selected_fixture_id = fixture_id;
      this.show_fixture_details = true;
    },
    countChange(value) {
      this.fixturesCount = value;
    },
    filterFixtures(rules) {
      this.ruleFilters = rules;
      this.filtererId = this.$uuid.v4();
    },
    closeStats() {
      this.show_fixture_details = false;
    },
    closeSearch() {
      this.showSearchResults = false;
      this.searchText = "";
    },
    async searchFixtures() {
      this.searchLoading = true;
      const searchResults = await this.$axios.$get("/user/fixtures/search", {
        params: { searchText: this.searchText, type: this.searchType },
      });
      this.searchResults = searchResults;
      // this.$refs.searchDropdown.show(true);
      this.searchLoading = false;
      this.showSearchResults = true;
    },
  },
};
</script>
<style lang="scss">
@import "~assets/scss/breakpoints";
@import "~/assets/scss/colors";

@media (max-width: $md) {
  ::-webkit-scrollbar {
    display: none;
  }
}

.vishal-search-box-container {
  position: relative;
}

.vishal-search-box {
  display: flex;
  align-items: center;

  column-gap: 10px;
  background: #f0f2ef;
  border-radius: 12px;
  height: 54px;
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
  .vishal-search-input {
    background: transparent;
    width: 100%;
    border: none;
    outline: none;
    &:active {
      outline: none;
    }
  }
}
.vishal-search-box-items {
  position: absolute;
  width: 100%;
  top: 60px;
  left: 0px;
  background: white;
  max-height: 550px;
  font-weight: 500;
  overflow-y: auto;
  max-width: 480px;
  .list-group-item {
    border: 1px solid white;
    border-top: 1px solid $light;
  }
  .list-group-item:first-child {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    border-bottom: 1px solid $light;
  }
  .list-group-item:last-child {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  .vishal-search-box-item {
    padding: 14px;
    display: flex;
    align-items: center;
    column-gap: 10px;
  }
  z-index: 100;
}
.fixture-page-title-and-switch {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  .page-title {
    flex: 1;
  }
}
.live-button {
  border: 1px solid #e3e3e3;
  padding: 16px;
}
.fixture-page-search-box {
  flex: 1;
  display: flex;

  align-items: center;
}
.search-box {
  max-width: 100%;
  height: 54px;
  width: 100%;
  button {
    background: transparent;
    left: 0px;
    border: none;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    width: 50px;
    height: 54px;
    left: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  input {
    border: none;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    height: 54px;
    background: rgba(240, 242, 239, 0.5);
    width: 100%;
    padding-left: 52px;
    border-radius: 12px;

    font-weight: 500;
    font-size: 18px;
    line-height: 30px;
    color: #60685f;

    &:focus {
      box-shadow: none;
      border: none;
      outline: none;
    }
    &::placeholder {
      font-weight: 500;
      font-size: 18px;
      line-height: 30px;
      color: #60685f;
      transform: translateY(2px);
    }
  }
}

.country-name {
  display: flex;
  align-items: center;
  background: white;
  text-transform: uppercase;
  vertical-align: middle;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  color: $dark-2;
  padding: 0px;
  z-index: 5;
  margin-bottom: 8px;
  border: none;
  cursor: pointer;
  justify-content: space-between;
  padding: 10px;

  &.active-country {
    background: red;
    border: 0px;
  }
  .icon {
    transform: rotate(180deg);
    &.active {
      transform: rotate(0deg);
    }
  }
  &:active,
  &:focus,
  &:hover {
    background: none !important;
    background: #f7f9f7 !important;
  }
  .country-content {
    display: flex;
    align-items: center;
    .country-text {
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      text-transform: uppercase;
      color: rgba(34, 38, 34, 0.7);
      // opacity: 0.7;
    }
  }
}
.league-name {
  background: $light;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  padding: 16px 0px;
  h6 {
    text-transform: uppercase;
    color: $dark-2;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    margin-top: 3px;
    @media (max-width: $lg) {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      width: 100px;
      height: 24px;
    }
  }
}

.title-and-switch {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .page-title {
    flex: 1;
  }
}
.collapsed-country {
  display: none;
}
.view-options {
  position: fixed;
  bottom: 35px;
  right: 30px;
  z-index: 99;
  display: -webkit-box;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  width: 144px;
  height: 32px;

  display: flex;
  background: #60b15a;
  border-radius: 4px;
  justify-content: center;
  .dropdown-toggle {
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    color: #ffffff;
    &:focus,
    &:hover,
    &:active {
      background: none !important;
      border: none !important;
    }
  }
  .dropdown-content {
    .text {
      transform: translateY(2px);
      margin-left: 4px;
    }
  }
  .icon-text {
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    // border-width: 50%;
    padding: 0 5px;
    padding-left: 10px;
    .text {
      transform: translateY(1px);
      font-weight: 600;
      font-size: 11px;
      line-height: 18px;
      color: #ffffff;
      transform: translateY(1px);
    }
  }
}

.feed-glance {
  margin-left: 15px;
}

.status {
  font-weight: bold !important; //COLFAX
  font-size: 11px;
  line-height: 16px;
  color: #60685f;
  display: -webkit-inline-box;
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-flex: 1;
  flex: 1 0 1px;
  margin-bottom: 0.5rem;
}

.break {
  flex-basis: 100%;
  width: 0;
}

// Frontend Development Styles

.page-title {
  font-weight: 600;
  font-size: 48px;
  line-height: 72px;
  letter-spacing: -1px;
}

.nav-form {
  max-width: 100%;
  height: 54px;
  width: 100%;
  button {
    background: transparent;
    left: 0px;
    border: none;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    width: 50px;
    height: 54px;
    left: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  input {
    border: none;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    height: 54px;
    background: rgba(240, 242, 239, 0.5);
    width: 100%;
    padding-left: 52px;
    border-radius: 12px;
    font-weight: 500;
    font-size: 18px;
    line-height: 30px;
    color: #60685f;

    &:focus {
      box-shadow: none;
      border: none;
      outline: none;
    }
    &::placeholder {
      font-weight: 500;
      font-size: 18px;
      line-height: 30px;
      color: #60685f;
      transform: translateY(2px);
    }
  }
}
.founds-container {
  margin-top: 24px;
  h6 {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #11142d;
  }
  .filter-dropdown {
    //margin-right: 16px;
    position: relative;
    button {
      .text {
        font-weight: 600;
        font-size: 15px;
        line-height: 18px;
        color: #60685f;
      }
    }
    button.dropdown-toggle {
      width: 100% !important;
      padding-left: 24.5px !important;
      padding-right: 24.5px !important;
    }
    .dropdown-menu.show {
      background: #ffffff;
      box-sizing: border-box;
      box-shadow: 0px 10px 35px rgba(0, 0, 0, 0.05);
      border-radius: 8px;
      width: 400px;
      height: 420px;
      overflow-y: auto;
      right: 0;
      transform: none !important;
      top: 40px !important;
      li {
        width: 100%;
        height: 100%;
        a {
          padding: 0;
          &:hover {
            background: none !important;
          }
        }
        .rules-container {
          width: 100%;
          height: 100%;
        }
      }
      .rules-container {
        .nav-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border: none;
          height: 39px;
          .nav-item {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            .nav-link {
              margin: 0;
              text-align: center;
              width: 100%;
              height: 100%;
              border: none;
              &:hover {
                border: none;
              }
              .tab-title {
                font-size: 12px;
                line-height: 18px;

                height: 100%;
                line-height: 39px;
                border-bottom: 1px solid #f0f1f0;
              }
              &.active {
                border: none;
                .tab-title {
                  border-bottom: 2px solid #60b15a;
                }
              }
            }
            border-bottom: 0px;
          }
        }
        .tab-content {
          padding-top: 4px;
          padding-bottom: 20px;
        }
        .saved-rules {
          height: 100%;
          overflow-y: auto;
          .tab-content {
            padding: 20px 20px;
          }
          .rules {
            height: 100%;
            overflow-y: auto;
            .rule {
              display: flex;
              justify-content: space-between;
              padding: 4px 12px;
              height: 48px;
              margin-bottom: 5px;
              align-items: center;
              background: #f7f9f7;
              border-radius: 4px;
              h3 {
                font-weight: 600;
                font-size: 12px;
                line-height: 18px;
              }
              .action-btns {
                button {
                  background: #eef5ed;
                  border-radius: 12px;
                  padding: 12px;
                  font-weight: 600;
                  font-size: 12px;
                  line-height: 18px;

                  height: 40px;
                }
                .use-btn {
                  margin-left: 6px;
                  color: #60b15a;
                }
                height: 100%;
              }
            }
          }
        }
        .tab-content {
          .create-rules {
            padding: 20px;
            height: 100%;
            overflow-y: auto;
            .action-rules {
              grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
              column-gap: 5px;
              display: grid;
              button {
                background: #60b15a;
                border-radius: 12px;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 48px;
                width: 100%;
                .text {
                  font-weight: 600;
                  font-size: 13px;
                  line-height: 18px;
                  text-align: center;
                  color: #ffffff;
                  display: inline-block;
                  transform: translateY(2px);
                }
              }
            }
          }
        }
        .create-rules {
          .main-rules {
            .rules-length {
              display: flex;
              justify-content: space-between;
              align-items: center;
              h3,
              p {
                font-weight: 600;
                font-size: 18px;
                line-height: 18px;
              }
            }
          }
        }
        .rules-creation {
          .sub-heading,
          .text,
          .label,
          label .h1 {
            font-weight: 600;

            margin-bottom: 12px;
            font-size: 16px;
            line-height: 24px;
          }
          .sub-heading {
          }
          .h1 {
            margin-bottom: 0px;
          }
          .description {
            font-weight: 600 !important;
            font-size: 11px;
            line-height: 20px;
            text-align: center;
            color: #60685f;
            margin-bottom: 20px;
          }
        }
      }
    }
  }
}
#scroller-dropdown {
  width: 100%;
}
// Mobile Styles
@media (max-width: $lg) {
  .fixture-actions {
    overflow-x: auto;
  }
  // .founds-containerxxx {
  //   .filter-dropdown {
  //     .dropdown-menu.show {
  //       transform: none !important;
  //       z-index: 1051;
  //       min-width: calc(100vw);
  //       background: transparent;
  //       top: 50px !important;
  //       left: 0px;
  //       background: #f7f9f7;
  //       border-radius: 20px !important;
  //       position: fixed !important;
  //       height: 100% !important;
  //       width: 100%;
  //       .rules-container {
  //         .nav-tabs {
  //           .nav-item {
  //             .nav-link {
  //               background: none;
  //               &.active {
  //                 .tab-title {
  //                   // border-bottom: 2px solid #60b15a;
  //                   // background: #fff;
  //                 }
  //               }
  //             }
  //           }
  //         }

  //         .saved-rules {
  //           .rules {
  //             .rule {
  //               background: #fff;
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
  .page-title {
    font-size: 24px;
    line-height: 36px;
  }
  .nav-form {
    margin-top: 16px;
  }

  .founds-container {
    margin-top: 20px;
  }
}

.date-btn {
  width: 115px !important;
  height: 40px !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  background: #eef5ed !important;
  border-radius: 4px !important;
  // width: 100% !important;
  padding: 0 !important;
  .content {
    width: 100%;
    height: 100%;
    justify-content: center;
    display: flex;
    align-items: center;
    .text {
      transform: translateY(2px);
      margin-left: 10px;
      font-weight: 600 !important;
      font-size: 15px;
      line-height: 18px;
      color: #60685f;
    }
  }
}
</style>
