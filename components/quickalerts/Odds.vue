<template>
  <div>
    <b-row no-gutters>
      <b-col cols="12">
        <footy-tab-select
          :options="subTabs"
          v-model="selectedTab"
          
        >
        </footy-tab-select>
      </b-col>
    </b-row>
    <div class="odds-container">
      <component
        v-bind:is="selectedTab"
        :fixture="fixture"
        @addOdd="addOdd"
      ></component>
    </div>
  </div>
</template>

<script>
import OddsContainer from "./Odds/OddsContainer.vue";
import PreMatch from "./Odds/PreMatch.vue";
import Live from "./Odds/Live.vue";
import Peak from "./Odds/Peak.vue";

export default {
  components: { OddsContainer, PreMatch, Live, Peak },
  name: "Odds",
  data() {
    return {
      selectedTab: "PreMatch",
    };
  },
  props: {
    liveMode: Boolean,
    fixture: Object,
  },

  computed: {
    subTabs() {
      if (this.liveMode) {
        return ["PreMatch", "Live", "Peak"];
      } else {
        return ["PreMatch"];
      }
    },
  },
  watch: {
    selectedTab(newVal) {
      if (newVal === "PreMatch") {
        this.selectedTab = "PreMatch";
      }
      console.log(this.selectedTab);
    },
  },
  methods: {
    addOdd(odd) {
      // console.log(odd);
      this.$emit("addOdd", odd);
    },
  },
};
</script>

<style lang="scss">
.odds-container {
  .odds-group {
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    margin-bottom: 10px;
    color: #fff;
    .odds-title {
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 10px;
      display: -webkit-box;
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-pack: justify;
      justify-content: space-between;
      h3,
      label {
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 36px;
        display: flex;
        align-items: center;
        
        // font-family: "Poppins"; //REPLACEDTEMPORARILY //REPLACED
      }
    }
    .odds-row {
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-pack: justify;
      justify-content: space-between;
      .item {
        text-align: center;
        display: -webkit-box;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-flex: 1;
        flex: 1;
        font-size: 0.9rem;
        margin: 0 1px;
        border-radius: 0;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        flex-direction: column;
        flex: 1 0 0px;
        span.key {
          background: #eef5ed;
          font-weight: 600;
          text-transform: capitalize;
          white-space: nowrap;
          padding: 0 5px;
          display: -webkit-inline-box;
          display: inline-flex;
          line-height: 32px;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 9pt;
          
        }
        span {
          display: flex;
          background-color: #28a745;
          border-radius: 0;
          -webkit-box-flex: 1;
          flex: 1;
          height: 100%;
          -webkit-box-align: center;
          align-items: center;
          -webkit-box-pack: center;
          justify-content: center;
          min-height: 32px;
          margin-bottom: 2px;
          width: 100%;
          cursor: pointer;
        }
      }
    }
  }
}
</style>