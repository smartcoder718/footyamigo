<template>
  <div v-if="betsCount > 0">
    <div class="slip-button" @click="toggleCollapse" v-if="is_collapsed">
      <div class="slip-content">
        <h3>Bet Slip</h3>
        <p>{{ coins }} Virtual Coins</p>
      </div>
      <h3 class="selected">{{ betsCount }} Selected</h3>
    </div>
    <div class="slip-container" v-else>
      <div class="slip-header slip">
        <div class="slip-content">
          <h3>Bet Slip</h3>
          <p>{{ coins }} Virtual Coins</p>
        </div>
        <div class="clear-btns d-flex align-items-center">
          <div class="delete-btn" @click="clearBets()">
            <span class="text mr-2"> Clear </span>
            <icon icon-name="delete_forever" class-names="text-danger" />
          </div>
          <div class="close-btn" @click="toggleCollapse">
            <icon icon-name="close" />
          </div>
        </div>
      </div>
      <hr class="my-0" />
      <div class="selected-bets">
        <div
          class="bet"
          v-for="(fixture_key, i) in selectedBets"
          :key="i"
          :bet="(bet = fixtures[fixture_key])"
        >
          <div class="bet-content">
            <h3 class="fixture-name">{{ bet.fixture_name }}</h3>
            <p class="rule">
              {{ bet.market_name }} @
              {{ bet[bet.market_key] }}
            </p>
          </div>
          <div class="delete-btn" @click="toggleBet(bet.key)">
            <icon icon-name="delete_forever" class-names="text-danger" />
          </div>
        </div>
      </div>
      <div class="bet-buttons-container">
        <div
          class="bet-content d-flex align-items-center justify-content-between"
        >
          <h3>Stake</h3>
          <h3>{{ betsCount }} Games @ {{ totalOdds }}</h3>
        </div>
        <div class="bet-buttons">
          <b-input
            class="footy-input"
            v-model="stake"
            type="number"
          ></b-input>
          <b-button
            click="createBet"
            class="footy-button"
            variant="primary"
            v-b-popover.click.right="'Coming soon'"
            >Place Virtual Bet</b-button
          >
          <div class="twitter-btn btn d-none d-lg-flex">
            <twitter-icon></twitter-icon>
            <span class="text"> Share On Twitter </span>
          </div>
          <div class="facebook-btn btn d-none d-lg-flex">
            <icon icon-name="facebook" class-names="mr-1" />
            <span class="text"> Share On Facebook </span>
          </div>
          <div class="twitter-btn btn d-flex d-lg-none">
            <twitter-icon></twitter-icon>
            <span class="text"> Share </span>
          </div>
          <div class="facebook-btn btn d-flex d-lg-none">
            <icon icon-name="facebook" class-names="mr-1" />
            <span class="text"> Share </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TwitterIcon from "../common/TwitterIcon.vue";
import Icon from "../common/Icon.vue";

export default {
  components: { TwitterIcon, Icon },
  props: {
    selectedBets: Array,
    coins: Number,
    fixtures: Object
  },
  data() {
    return {
      stake: 10,
      is_collapsed: true
    };
  },
  watch: {
    betsCount(val) {
      if (!val) {
        this.is_collapsed = true;
      }
    }
  },
  computed: {
    betsCount() {
      return this.selectedBets.length;
    },
    totalOdds() {
      return this.selectedBets
        .map(key => {
          const bet = this.fixtures[key];
          const odd = bet[bet.market_key];
          return odd;
        })
        .reduce((a, b) => Number(a) * Number(b), 1)
        .toFixed(2);
    }
  },
  methods: {
    createBet() {
      return; //to be done later
    },
    clearBets() {
      this.$emit("clearBets");
    },
    toggleCollapse() {
      this.is_collapsed = !this.is_collapsed;
    },
    toggleBet(fixture_key) {
      this.$emit("toggleBet", fixture_key);
    }
  }
};
</script>

<style lang="scss">
.b-popover {
  // border: 1px solid rgb(48, 116, 48);
}
</style>
