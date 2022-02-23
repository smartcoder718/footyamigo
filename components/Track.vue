<template>
  <div class="betting-systems-container">
    <h3>Odds Performance</h3>
    <div class="text-small mb-4 text-grey">
      <strong class="text-dark">How it works:</strong> This tool allows you to
      analyse the odds of your filter, per market. It will take all of the
      fixtures that your filter has processed and allow you to dive into each
      market, seeing how many fixtures hit certain odds and if those fixtures
      were in fact winners within your filter. Remember that the winners and
      losers are defined by your desired outcomes. Profit is calculated based on
      unit being placed on each fixture that hits the odds you set.
    </div>

    <b-row no-gutters>
      <b-col xl="8" lg="6" sm="12">
        <!--footy-dropdown-select
          label="Select Market"
          :options="Object.values(pre_match_odds_no_team)"
          v-model="active_market"
          class="mr-3"
        >
        </footy-dropdown-select-->
      </b-col>
      <b-col xl="4" lg="6" sm="12">
        <footy-radio
          :options="Object.values(odd_types)"
          label="Odds Type"
          v-model="odd_type"
        >
        </footy-radio>
      </b-col>
    </b-row>
    <div class="range-container">
      <DualRangeSlider
        :range="range"
        :step="0.1"
        :min="0"
        :max="20"
        :label="odd_types[odd_type].label"
      >
      </DualRangeSlider>
    </div>
    <b-row class="odds-data-wrapper" cols-sm="1" cols-md="2" cols-lg="4">
      <b-col>
        <div class="odds-data">
          <h3>1270</h3>
          <div class="odds-label">Games Hit Odds</div>
        </div>
      </b-col>
      <b-col>
        <div class="odds-data positive-odds">
          <h3>1247</h3>
          <div class="odds-label">98.19% Met Desired Outcomes</div>
        </div>
      </b-col>
      <b-col>
        <div class="odds-data negative-odds">
          <h3>23</h3>
          <div class="odds-label">1.81% Lost</div>
        </div>
      </b-col>
      <b-col>
        <div class="odds-data positive-odds">
          <h3>974.6U</h3>
          <div class="odds-label">Profit / Loss</div>
        </div>
      </b-col>
    </b-row>
    <div class="text-small text-center text-grey">
      If you see fewer games as a total here than expected, remember that peak
      odds tracking launched on January 24th. It's also possible that some
      fixtures were removed from Bet365. Only fixtures with peak odds are
      considered for this tool.
    </div>
  </div>
</template>

<script>
import DualRangeSlider from "~/components/DualRangeSlider";

//import pre_match_odds_no_team from "~/components/json/pre-match-odds";
export default {
  data() {
    return {
      options: [],
      range: [0, 20],
      active_market: "ft_result",
      //pre_match_odds_no_team,
      odd_types: {
        "peak-odds": {
          value: "peak-odds",
          text: "Peak Odds",
          label: "Odds Peaked"
        },
        "pre-match-odds": {
          value: "pre-match-odds",
          text: "PreMatch Odds",
          label: "PreMatch Odds"
        }
      },
      odd_type: "pre-match-odds"
    };
  },
  components: {
    DualRangeSlider
  }
};
</script>

<style lang="scss">
.odds-data-wrapper {
  .odds-data {
    background: white;
    padding: 35px 10px;
    display: flex;
    border: 1px solid #d5ded5;
    box-sizing: border-box;
    border-radius: 12px;
    flex-direction: column;
    align-items: center;
    text-align: center;
    justify-content: space-around;
    margin-bottom: 16px;
    .odds-label {
      color: #60685f;
    }
    &.positive-odds {
      background: #eef5ed;
      color: #60b15a;
      .odds-label {
        color: #60b15a;
      }
      border: 1px solid #60b15a;
    }
    &.negative-odds {
      background: rgba(220, 96, 96, 0.1);
      color: #dc6060;
      .odds-label {
        color: #dc6060;
      }

      border: 1px solid #dc6060;
    }
  }
}
.range-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
