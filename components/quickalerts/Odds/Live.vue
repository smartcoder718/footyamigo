<template>
  <b-row no-gutters class="mb-3">
    <b-col cols="12">
      <footy-dropdown-select
        :options="oddGroups"
        v-model="group"
        label="Groups"
        @input="toggleType"
        class="mr-md-1 mr-0"
      ></footy-dropdown-select>
    </b-col>

    <b-col cols="12">
      <div class="odds-container">
        <div v-if="loading" class="d-flex justify-content-center">
          <Loader />
        </div>
        <odds-container
          @addOdd="addOdd"
          :filteredOdds="filteredOdds"
        ></odds-container>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import OddsContainer from "./OddsContainer.vue";

export default {
  components: { OddsContainer },
  name: "PreMatch",
  props: {
    liveMode: Boolean,
  },
  data() {
    return {
      odds: null,
      filteredOdds: null,
      oddGroups: [
        { text: "All", value: "all" },
        { text: "Result", value: "result" },
        { text: "Goals", value: "goals" },
        { text: "Corners", value: "corners" },
        { text: "Half", value: "half" },
        { text: "Asian", value: "asian" },
      ],

      group: "all",
      loading: false,

      selectedTab: "Prematch",
    };
  },
  mounted() {
    this.fetchList();
  },
  methods: {
    filterOdds(odds, key) {
      let tempOdds = [];

      if (key == "all") {
        return odds;
      }
      odds.forEach((odd) => {
        // Check if group is comma separared and have current key
        if (odd.groups.indexOf(",") > -1) {
          if (odd.groups.split(",").includes(key)) {
            tempOdds.push(odd);
          }
        }
        // Check if group is simple and have current key === group
        if (odd.groups == key) {
          tempOdds.push(odd);
        }
      });
      return tempOdds;
    },
    async fetchList() {
      try {
        let odds;
        this.loading = true;
        const ax = await this.$axios.create();
        ax.setBaseURL("/");
        odds = await ax.$get("json/odds.json");
        this.odds = odds;
        this.loading = false;
        this.filteredOdds = this.filterOdds(this.odds, this.group);
      } catch (e) {
        console.log(e);
      }
    },

    toggleType(val) {
      this.group = val;
      this.filteredOdds = this.filterOdds(this.odds, this.group);
    },
    addOdd(odd) {
      this.$emit("addOdd", odd);
    },
  },
};
</script>

<style lang="scss">
</style>