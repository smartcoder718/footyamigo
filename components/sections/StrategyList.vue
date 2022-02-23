<template>
  <GeneralPage :pageTitle="pageTitle" :pageDescription="pageDescription">
    <template v-slot:pageButton>
      <b-button
        class="footy-button"
        variant="primary"
        block
        :disabled="!$store.getters.subscriptionType"
        :to="`/${strategyType}/create`"
      >
        <PlusIcon class="icon-left" />

        <span class="text"> Add a new strategy </span>
      </b-button>
    </template>
    <template v-slot:howItWorks>
      <HowItWorks :location="strategyType" />
    </template>

    <div class="strategy-list-table-wrapper">
      <div class="nav-items-search">
        <div class="nav-items-button scroll-on-mobile">
          <b-button
            class="footy-button"
            :to="`/${strategyType}/${mode.slug}`"
            v-for="mode in strategyModes"
            :key="mode.slug"
          >
            <component class="icon-left" :is="mode.icon" />
            <span class="text">{{ mode.label }}</span>
          </b-button>
        </div>

        <div class="search-box-holder bg-lightpink">
          <b-input-group size="lg" class="search-box">
            <b-input-group-prepend>
              <div class="bg-lightpink centered p-2">
                <span style="margin-bottom: 2px">
                  <img :src="`/icons/search.svg?inline`" alt="" />
                </span>
              </div>
            </b-input-group-prepend>
            <b-form-input
              class="bg-lightpink search-input"
              placeholder="Search"
              v-model="searchText"
            ></b-form-input>
          </b-input-group>
        </div>
      </div>

      <b-overlay :show="loading" rounded="sm" class="mt-4">
        <AlertsTable
          :strategies="userStrategies"
          @refetchTable="refetchTable"
          :selectedType.sync="selectedType"
          :selectedSort.sync="selectedSort"
          :type="strategyType"
          :total="total"
          :strategyType="strategyType"
          edited
          @deleteStrategy="deleteStrategy"
          class="strategy-list-table"
          :showUpgrade="showUpgrade"
          :strategyMode="strategyMode"
        ></AlertsTable>
      </b-overlay>
      <MugenScroll
        :handler="fetchStrategies"
        :should-handle="!loading"
        v-if="!loaded && !showUpgrade"
      >
      </MugenScroll>
      <b-alert
        v-model="isAlert"
        class="position-fixed fixed-bottom m-0 rounded-0 d-flex align-items-center justify-content-center"
        style="z-index: 2000"
      >
        Alert has been added
      </b-alert>
    </div>
  </GeneralPage>
</template>

<script>
import GeneralPage from "../GeneralPage";
import AlertsTable from "~/components/AlertsTable";
import dummy_strategies from "~/components/json/dummy-strategies";

import HowItWorks from "~/components/HowItWorks";
import PlusIcon from "~/static/icons/plus.svg";
import PresetIcon from "~/static/icons/preset.svg";
import BellIcon from "~/static/icons/bell.svg";
import ExploreIcon from "~/static/icons/explore.svg";
export default {
  props: {
    pageTitle: String,
    pageDescription: String,
    strategyType: String,
    strategyMode: String,
  },
  data() {
    return {
      strategyModes: [
        { label: "Strategies", slug: "", icon: BellIcon },
        { label: "Preset", slug: "preset-alerts", icon: PresetIcon },
        { label: "Explore", slug: "explore-alerts", icon: ExploreIcon },
      ],
      initialized: false,
      alerts: [],
      loading: false,
      loaded: false,
      page: 1,
      total: 0,
      loading: false,
      selectedType: "all",
      showUpgrade: false,
      selectedSort: "updated_at",
      isAlert: false,
      searchText: "",
      interval: null,
    };
  },
  beforeMount() {
    this.fetchStrategies();
  },
  watch: {
    searchText(val) {
      // const durationInSeconds = this.$moment().diff(
      //   this.$moment(this.lastInput),
      //   "seconds"
      // );
      clearInterval(this.interval);

      const instance = this;
      this.interval = setTimeout((x) => {
        instance.refetchTable();
      }, 1000);
    },
    selectedType() {
      this.refetchTable();
    },
    selectedSort() {
      this.refetchTable();
    },
  },

  methods: {
    async deleteStrategy(id) {
      var index = this.alerts.findIndex((item) => item.id === id);

      if (index !== -1) {
        this.alerts.splice(index, 1);
      }
    },

    async refetchTable() {
      this.page = 1;
      this.alerts = [];
      this.loaded = false;
      await this.fetchStrategies();
    },
    async fetchStrategies() {
      try {
        if (!this.$store.getters.subscriptionType) {
          return this.showDemoToExpired();
        }
        this.loading = true;
        // console.log(this.selectedSort);
        var { total, strategies } = await this.$axios.fetchStrategies({
          type: this.strategyType,
          mode: this.strategyMode,
          page: this.page,
          sortBy: this.selectedSort,
          filterBy: this.selectedType,
          search: this.searchText,
        });
        this.page += 1;
        this.total = total;
        this.alerts.push(...strategies);
        window.scrollBy(0, -200);
        this.loading = false;
        if (strategies.length < 20) {
          this.loaded = true;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    showDemoToExpired() {
      this.alerts = dummy_strategies;
      // console.log(dummy_strategies);
      this.showUpgrade = true;
    },
  },
  components: {
    AlertsTable,
    PlusIcon,
    PresetIcon,
    BellIcon,
    GeneralPage,
    HowItWorks,
  },
  created() {
    if (this.$route.query.showAlert) {
      this.isAlert = true;
      setTimeout(() => {
        this.isAlert = false;
      }, 5000);
    }
  },
  computed: {
    userStrategies() {
      return this.alerts;
      if (this.searchText.length === 0) return this.alerts;
      return this.alerts.filter((option) => {
        return (
          option.title.toUpperCase().indexOf(this.searchText.toUpperCase()) !=
          -1
        );
      });
    },
  },
};
</script>

<style lang="scss">
@use "sass:map";
@import "~/assets/scss/colors";
@import "~/assets/scss/breakpoints";
.strategy-list-table-wrapper {
  font-weight: 500;
  .fixed-bottom {
    background: #60b15ad3 !important;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #ffffff !important;
  }
  .btn.nuxt-link-exact-active.nuxt-link-active {
    background: $primary;
    color: white;
    svg {
      filter: grayscale(1) brightness(0) invert(1);
    }
  }
}

.nav-items-search {
  display: flex;
  row-gap: 1rem;
  column-gap: 8px;
  .nav-items-button {
    display: flex;
    column-gap: 8px;
    flex-shrink: 0;
  }
}

@media screen and (max-width: $lg) {
  .nav-items-search {
    flex-direction: column;
  }
  .nav-items-button {
    .btn {
      flex: 1;
    }
  }
}
</style>
