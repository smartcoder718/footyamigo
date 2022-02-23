<template>
  <StrategyDetailsLayout
    :pageTitle="filter ? filter.title : 'Loading...'"
    class="strategy-details-page"
    :pageDescription="
      'Desired outcome: ' + (filter ? filter.outcome.label : 'Loading')
    "
  >
    <template v-slot:pageButton>
      <div class="d-flex col-gap-12 wrap-on-mobile">
        <div
          class="filter-actions d-flex align-items-center col-gap-16"
          v-if="filter"
        >
          <div class="hit-rate" v-if="filter.type == 'pre-match'">
            <h6>Hit Rate</h6>
            <p :class="[$getColor(filter.hit_rate, 'text-')]">
              {{ /*filter.hit_rate*/ }} NA%
            </p>
          </div>
          <div v-else>
            <h6>Strike Rate</h6>
            <p :class="[$getColor(filter.strike_rate, 'text-')]">
              {{ filter.strike_rate }}%
            </p>
          </div>

          <b-dropdown
            size="sm"
            class="footy-dropdown"
            :class="filter.trusted ? 'trusted' : 'testing'"
            no-caret
          >
            <template slot="button-content">
              {{ filter.trusted ? "Trusted" : "Testing" }}

              <span class="material-icons-outlined"> expand_more </span>
            </template>
            <b-dropdown-item @click="untrustStrategy(filter.id)"
              >Testing</b-dropdown-item
            >
            <b-dropdown-item @click="trustStrategy(filter.id)"
              >Trusted</b-dropdown-item
            >
          </b-dropdown>
          <div class="field">
            <h3 class="title mr-2">Active</h3>
            <footy-switch
              v-model="filter.active"
              @click.native.prevent="toggleActiveStatus(filter.id)"
            >
            </footy-switch>
          </div>
        </div>
        <div class="d-flex col-gap-12">
          <b-button
            class="footy-button"
            target="_blank"
            :href="`/api/user/strategies/picks/export/` + $route.params.id"
          >
            <span>
              <img :src="`/icons/download.svg?inline`" alt="" />
            </span>
            Download
          </b-button>
          <b-button
            class="footy-button"
            v-for="option in filterActions"
            :to="option.href"
            :key="option.key"
          >
            <span>
              <img :src="`/icons/${option.icon}.svg?inline`" alt="" />
            </span>
            {{ option.label }}
          </b-button>
        </div>
      </div>
    </template>

    <div class="d-flex row-gap-20 wrap-on-mobile col-gap-14" v-if="filter">
      <div class="footy-button-group scroll-on-mobile">
        <b-button
          class="footy-button"
          v-for="link in nagivationlinks"
          :key="link.id"
          :to="`/${type}/${link.slug}/${filter.id}`"
        >
          <component :is="link.icon" class="icon-left"> </component>
          {{ link.label }}
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
            class="bg-lightpink search-input p-0"
            placeholder="Search"
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <hr class="mt-3 mb-4" />
    <PromptModal
      v-model="showPrompt"
      @accepted="excludeLeague(exclude_league_id)"
    />
    <component
      :is="activePage"
      :filter="filter"
      v-if="filter"
      :includedLeagues="includedLeagues"
      @promptExcludeLeague="promptExcludeLeague"
    >
    </component>
  </StrategyDetailsLayout>
</template>
<script>
import StrategyDetailsLayout from "~/components/StrategyDetailsLayout.vue";
import Leagues from "~/components/strategy-details/Leagues.vue";
import Picks from "~/components/strategy-details/Picks.vue";
import Upcoming from "~/components/strategy-details/Upcoming.vue";
import Results from "~/components/strategy-details/Results.vue";

export default {
  components: {
    StrategyDetailsLayout,
    Leagues,
    Picks,
    Upcoming,
    Results,
  },
  props: {
    nagivationlinks: Array,
    type: String,
  },
  data() {
    return {
      active: "results",
      page: 1,
      filter: null,
      results: [],
      showPrompt: false,
      exclude_league_id: null,
      filterActions: [
        // {
        //   key: "download",
        //   label: "Download",
        //   icon: "download",
        //   href: `/api/picks/export/` + this.$route.params.id,
        //   target: "_blank",
        // },
        {
          key: "edit",
          label: "Edit",
          icon: "edit",
          href: `/${this.type}/edit/` + this.$route.params.id,
        },
        {
          key: "close",
          label: "",
          href: `/${this.type}/`,
          icon: "close",
        },
      ],
    };
  },
  created() {
    console.log(this.$route);
    this.$store.dispatch("fetchLeagues");
    this.getFilter(this.$route.params.id);
  },
  methods: {
    async nextPage() {
      const page = (this.page += 1);
      await this.getFilter(this.$route.params.id, page);
      this.page = page;
    },
    async prevPage() {
      const page = (this.page -= 1);
      await this.getFilter(this.$route.params.id, page);
      this.page = page;
    },
    async trustStrategy(id) {
      await this.$axios.trustStrategy(id);
      this.getFilter(this.$route.params.id, this.page);
    },
    async untrustStrategy(id) {
      await this.$axios.untrustStrategy(id);
      this.getFilter(this.$route.params.id, this.page);
    },
    async getFilter(id) {
      const params = { id };
      const filter = await this.$axios.$get(`/user/strategies/id/`, {
        params,
      });

      this.filter = filter;

      //console.log(this.filter, this.filter.id);
    },
    async getResults(id, page) {
      const params = { page, id };
      const results = await this.$axios.$get(
        `/user/strategies/${this.type}/results/`,
        {
          params,
        }
      );
      this.results = results;
      //this.filter = filter;
    },
    async toggleActiveStatus(id) {
      await this.$axios.toggleActiveStatus(id);
      this.getFilter(this.$route.params.id, this.page);
    },
    async excludeLeague(league_id) {
      const strategy = await this.$axios.$post(
        "/user/strategies/exclude-league/" + this.filter.id,
        { league_id }
      );
      var index = this.filter.leagues.indexOf(league_id);
      if (index !== -1) {
        this.filter.leagues.splice(index, 1);
      }
    },
    async promptExcludeLeague(league_id) {
      this.showPrompt = true;
      this.exclude_league_id = league_id;
    },
  },
  computed: {
    activePage() {
      switch (this.$route.params.type.toLowerCase()) {
        case "leagues":
          return Leagues;
        case "picks":
          return Picks;
        case "upcoming":
          return Upcoming;
        case "results":
          return Results;
        default:
          return "div";
      }
    },
    includedLeagues() {
      if (!this.filter) {
        return {};
      }
      return Object.assign(
        {},
        ...this.filter.leagues.map((id) => {
          return {
            [id]: 1,
          };
        })
      );
    },
  },
};
</script>
<style lang="scss">
@import "~/assets/scss/colors";
@import "~assets/scss/breakpoints";
.strategy-details-page {
  .filter-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    //max-width: 317px !important;
    //width: 100% !important;
    border: 1px solid #e3e3e3;
    box-sizing: border-box;
    border-radius: 12px;
    height: 60px;
    padding: 20px;
    .field {
      display: flex;
      align-items: center;
      h3 {
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;

        opacity: 0.7;
      }
    }
    h6,
    p {
      font-weight: 600;
      font-size: 12px;
      line-height: 18px;
      color: rgba(34, 38, 34, 0.7);
    }
    p {
      color: #60b15a;
    }
  }
  h3.page-title {
    font-weight: 600;
    font-size: 48px;
    line-height: 72px;
    letter-spacing: -1px;
  }
}

@media (max-width: $lg) {
  .strategy-details-page {
    .filter-actions {
      max-width: 100% !important;
      width: 100% !important;
      margin: 12px 0;
    }
    h3.page-title {
      font-size: 24px;
      line-height: 36px;
    }
    .actions {
    }
  }
}

.strategy-details-tab-button {
  font-size: 13px !important;
  line-height: 18px !important;
}
</style>
