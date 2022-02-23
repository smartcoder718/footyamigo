<template>
  <div>
    <footy-tab-select
      id="basic"
      :options="submenuOptions"
      v-model="submenu"
      size="sm"
    >
    </footy-tab-select>
    <!-- <pre>
      <code>
{{currentMarkets}}
      </code>
    </pre> -->
    <footy-vertical-checkbox
      :id="submenu + '-checkbox'"
      v-model="selected"
      :options="currentMarkets"
      v-if="currentMarkets"
    >
    </footy-vertical-checkbox>


    <b-button
      variant="primary"
      block
      icon="notifications"
      class="footy-button my-3"
      @click="createQuickAlert"
      :disabled="!selected.length"
    >
      Alert Me !
    </b-button>
  </div>
</template>

<script>
export default {
  name: "Availability",
  props: {
    liveMode: Boolean
  },
  data() {
    return {
      submenuOptions: [
        { value: "cards", text: "Cards" },
        { value: "corners", text: "Corners" },
        { value: "specials", text: "Specials" },
        { value: "asian_handicap", text: "Asian Handicap" }
      ],
      submenu: "cards",
      teams: [
        { value: "home", text: "Home Team" },
        { value: "away", text: "Away Team" }
      ],
      settings: {
        teams: ["home"]
      },
      existing: new Set(),
      selected: [],
      markets: null,
      availabilityList: []
    };
  },
  mounted() {
    this.fetchList();
  },
  methods: {
    async fetchList() {
      const ax = await this.$axios.create();
      ax.setBaseURL("/");
      this.markets = await ax.$get("json/availability.json");
      this.existing = new Set(this.markets.existing);
    },
    async createQuickAlert() {
      // const quick_alert = await this.$axios.$post(
      //   "/user/quickalerts/create",
      //   this.form
      // );
      // console.log(quick_alert);
      // alert()
      console.log(this.availabilityList);

      // return quick_alert;
    }
  },
  computed: {
    currentMarkets() {
      if (this.markets) {
        return this.markets[this.submenu].map(market => {
          return {
            value: market.smid,
            text: market.name,
            disabled: this.existing.has(market.smid)
          };
        });
      }
    },
    titles() {
      return Object.keys(this.availabilityList).filter(
        key => key !== "existing"
      );
    }
  }
};
</script>
