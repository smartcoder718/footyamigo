<template>
  <div class="fixtures-wrapper" style="position: relative">
    <div
      class="fixture-container"
      v-for="(fixtures, human_date, i) in groupByDate"
      :key="i"
    >
      <div class="day">{{ human_date }}</div>
      <div class="fixtures">
        <div
          class="
              fixture
              d-flex
              align-items-center
              justify-content-between
              flex-wrap
            "
          v-for="(fixture, k) in fixtures"
          :key="k"
          :class="{ active: bets[fixture.key] }"
        >
          <div
            class="fixture-content"
            @click="$emit('showstats', fixture.fixture_id)"
            style="flex:1"
          >
            <div class="fixture-timings d-flex align-items-center">
              <div class="country-img">
                <span
                  class="flag-icon mr-2"
                  :class="$getFlag(fixture.iso)"
                ></span>
              </div>
              <span class="time ml-2">
                {{ $moment.utc(fixture.timestamp * 1000).local().format("LT") }}
              </span>
              <span class="position ml-2"
                >{{ nth(fixture.home_position) }}
                v
                {{ nth(fixture.away_position) }}
              </span>
            </div>
            <div class="fixture-name d-none d-lg-block">
              <h3>
                <b-img
                  :src="fixture.home_logo || home_logo"
                  class="team-logo"
                ></b-img>
                <span class="text"> {{ fixture.home_name }}</span>
              </h3>
              <h3>
                <b-img
                  :src="fixture.away_logo || away_logo"
                  class="team-logo"
                ></b-img>
                <span class="text"> {{ fixture.away_name }}</span>
              </h3>
            </div>
            <div class="fixture-name d-block d-lg-none">
              <h3>{{ fixture.fixture_name }}</h3>
            </div>
          </div>
          <div class="fixture-odds" @click="toggleBet(fixture.key)">
            {{ fixture[market] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    marketFixtures: { type: Array, default: () => [] },
    bets: Object,
    market: String
  },
  data() {
    return {
      home_logo: `https://cdn.sportmonks.com/images/soccer/team_placeholder.png`,
      away_logo: `https://cdn.sportmonks.com/images/soccer/team_placeholder.png`
    };
  },
  methods: {
    toggleBet(fixture_key) {
      this.$emit("toggleBet", fixture_key);
    },

    nth(n) {
      n = parseInt(n);
      if (isNaN(n)) {
        return "Na";
      }
      var s = ["th", "st", "nd", "rd"],
        v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }
  },

  computed: {
    groupByDate() {
      const dates = this.marketFixtures.map(fixture => {
        return { [this.$moment.utc(fixture.timestamp * 1000).format("LL")]: [] };
      });
      const fixture_obj = Object.assign({}, ...dates);
      this.marketFixtures.forEach(fixture => {
        fixture_obj[this.$moment.utc(fixture.timestamp * 1000).format("LL")].push(
          fixture
        );
      });
      return fixture_obj;
    }
  }
};
</script>

<style lang="scss" scoped></style>
