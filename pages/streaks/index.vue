<template>
  <GeneralPage
    pageTitle="Streaks"
    class="streaks-page"
    pageDescription="The Streaks page is an accumulation of fixtures updated daily based on the Streaks and Trends of teams around the world with their respective betting markets Odds. Exclusive to Footy Amigo Pro users."
  >
    <template v-slot:howItWorks>
      <HowItWorks location="streaks" />
    </template>

    <div class="px-5 mb-3 d-none d-lg-block">
      <carousel
        :perPageCustom="[
          [0, 1],
          [768, 5],
        ]"
        :minSwipeDistance="50"
        :navigationEnabled="true"
        :paginationEnabled="false"
        paginationColor="#f7f9f7"
        navigationNextLabel="<span class='material-icons-outlined arrow-button'>arrow_forward_ios</span>"
        navigationPrevLabel="<span class='material-icons-outlined'>arrow_back_ios</span>"
      >
        <slide v-for="option in streakOptions" :key="option.value">
          <div class="px-1">
            <b-button
              class="footy-button"
              block
              @click="active_market = option.value"
              :variant="active_market == option.value ? 'primary' : ''"
            >
              {{ option.text }}
            </b-button>
          </div>
        </slide>
      </carousel>
    </div>
    <footy-tab-select
      class="d-flex d-lg-none"
      :options="streakOptions"
      v-model="active_market"
      :buttonMode="true"
    >
    </footy-tab-select>

    <LoadMore v-if="loading" />
    <div class="streaks-table-page" v-else>
      <h3 class="text-center">{{ streak_data.title }} 🔥</h3>
      <h6 class="text-grey text-center mt-2 mb-4">
        {{ streak_data.subtitle }}
      </h6>
      <!-- <UpgradeToPro
        message="Upgrade to Pro to regain access to Streaks."
        :showUpgrade="!this.$store.getters.subscriptionType"
      > -->
      <carousel
        :perPageCustom="[
          [0, 1],
          [768, 2],
        ]"
        :navigationEnabled="false"
      >
        <slide
          v-for="streak_form in streak_data.streaks"
          :key="streak_form.form"
          class="p-2"
        >
          <StreaksTable
            @showStats="showStats"
            :fixtures="streak_form.fixtures"
            :title="streak_form.label"
            @toggleBet="toggleBet"
            :selectedBets="selectedBets"
          >
          </StreaksTable>
        </slide>
      </carousel>
      <!-- </UpgradeToPro> -->
      <!-- <div class="d-grid grid-col-md-2 gap-20">
        <StreaksTable
          :fixtures="streak_form.fixtures"
          :title="streak_form.label"
          v-for="streak_form in streak_data.streaks"
          :key="streak_form.form"
        >
        </StreaksTable>
      </div> -->
      <div class="my-3 d-flex" style="justify-content: center">
        <div class="bg-light rounded-10 w-100" style="max-width: 600px">
          <div class="p-3">
            <h3>{{ streak_data.header || streak_data.subtitle }} 💡</h3>
          </div>
          <hr class="m-0" />
          <div class="p-3">
            <h6
              class="bg-white p-3 text-grey rounded-10"
              v-html="streak_data.description"
            ></h6>
          </div>
        </div>
      </div>
    </div>

    <SlipContent
      :coins="coins"
      :selectedBets="selectedBets"
      @clearBets="clearBets"
      @toggleBet="toggleBet"
      :fixtures="allFixtures"
    >
    </SlipContent>

    <ModalOnMobile v-model="show_fixture_details" v-if="show_fixture_details">
      <FixtureDetails
        v-if="selected_fixture_id"
        @closestats="closeStats"
        :fixture_id="selected_fixture_id"
      >
      </FixtureDetails>
    </ModalOnMobile>
  </GeneralPage>
</template>

<script>
import StreaksTable from "~/components/streaks/StreaksTable";
// import { Hooper, Slide, HooperNavigation } from "hooper";
// import "hooper/dist/hooper.css";
import streakOptions from "~/components/json/streak-options.json";
import { Carousel, Slide } from "vue-carousel";
// import { Hooper as Carousel, Slide } from "hooper";
// import 'hooper/dist/hooper.css';

import SlipContent from "~/components/betbuilder/SlipContent.vue";
export default {
  data() {
    return {
      streak_data: {},
      loading: false,
      hooperSettings: {
        itemsToShow: 2,
        centerMode: true,
      },
      coins: 40,
      bets: {},
      streak_builder: {},
      selected_fixture_id: null,
      show_fixture_details: false,
      streakOptions,
      active_market: "home_win",
    };
  },
  components: {
    StreaksTable,
    Carousel,
    Slide,
    SlipContent,
  },
  mounted() {
    this.fetchStreaks();
  },
  watch: {
    active_market() {
      this.fetchStreaks();
    },
  },
  computed: {
    selectedBets() {
      return Object.keys(this.bets).filter((bet) => this.bets[bet]);
    },
    allFixtures() {
      //Fixtures will store every fixtures in each bet market
      const fixtures = [];
      this.streakOptions.map((market) => {
        const streak_builder = this.streak_builder[market.value];
        //Attach market name and key to each fixture in a market
        if (streak_builder) {
          const streak_builder_fixtures = streak_builder.data.map((fixture) => {
            return {
              ...fixture,
              market_name: market.text,
              market_key: market.value,
            };
          });
          fixtures.push(...streak_builder_fixtures);
        }
      });
      //Convert list of fixtures to an Object where fixture.key is the key of the object and fixture itself is the value
      return Object.assign(
        {},
        ...fixtures.map((fixture) => {
          return { [fixture.key]: fixture };
        })
      );
    },
  },
  methods: {
    async showStats(fixture_id) {
      this.selected_fixture_id = fixture_id;
      this.show_fixture_details = true;
    },
    closeStats() {
      this.selected_fixture_id = null;
      this.show_fixture_details = false;
    },
    clearBets() {
      this.bets = {};
    },
    toggleBet(fixture_key) {
      const is_selected = this.bets[fixture_key];
      this.$set(this.bets, fixture_key, !is_selected);
    },
    async fetchStreaks() {
      try {
        this.loading = true;
        const streak_data = await this.$axios.$get(
          "/user/streaks/" + this.active_market
        );
        const data = [];
        for (var streak of streak_data.streaks) {
          data.push(...streak.fixtures);
        }
        this.$set(this.streak_builder, this.active_market, { data });
        console.log(this.streak_builder, "BBB");
        this.streak_data = streak_data;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
