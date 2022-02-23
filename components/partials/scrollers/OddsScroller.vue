<template>
  <div>
    <b-table
      hover
      :items="odds_data"
      :fields="fields"
      small
      borderless
      thead-class="text-uppercase text-grey"
    >
      <template #cell(pre)="data">
        <template v-if="data.value != null">
          {{ data.value }}
        </template>
      </template>
      <template #cell(peak)="data">
        <template v-if="data.value != null">
          {{ data.value }}
        </template>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  props: {
    preodds: Object,
    fixture: Object
  },
  data() {
    return {
      attributes: {
        draw: { label: "Draw", key: "draw" },
        home_win: { label: "Home Win", key: "home_win" },
        away_win: { label: "Away Win", key: "away_win" },
        draw_ht: { label: "Draw (HT)", key: "draw_ht" },
        home_win_ht: { label: "Home Win (HT)", key: "home_win_ht" },
        away_win_ht: { label: "Away Win (HT)", key: "away_win_ht" },
        home_win_or_draw: {
          label: "Double Chance (1X)",
          key: "home_win_or_draw"
        },
        away_win_or_draw: {
          label: "Double Chance (X2)",
          key: "away_win_or_draw"
        },
        home_win_or_away_win: {
          label: "Double Chance (12)",
          key: "home_win_or_away_win"
        },
        dnb_home: { label: "1 DNB", key: "dnb_home" },
        dnb_away: { label: "2 DNB", key: "dnb_away" },
        btts: { label: "BTTS", key: "btts" },

        o25_goals: {
          label: "Over 2.5 Goals",
          key: "o25_goals"
        },
        u25_goals: {
          label: "Under 2.5 Goals",
          key: "u25_goals"
        },
        o35_goals: {
          label: "Over 3.5 Goals",
          key: "o35_goals"
        },
        u35_goals: {
          label: "Under 3.5 Goals",
          key: "u35_goals"
        },
        o45_goals: {
          label: "Over 4.5 Goals",
          key: "o45_goals"
        },
        u45_goals: {
          label: "Under 4.5 Goals",
          key: "u45_goals"
        },
        o05_goals_1h: {
          label: "Over 0.5 Goals (1H)",
          key: "o05_goals_1h"
        },
        u05_goals_1h: {
          label: "Under 0.5 Goals (1H)",
          key: "u05_goals_1h"
        },
        o15_goals_1h: {
          label: "Over 1.5 Goals (1H)",
          key: "o15_goals_1h"
        },
        u15_goals_1h: {
          label: "Under 1.5 Goals (1H)",
          key: "u15_goals_1h"
        },
        o95_asian_corners: {
          label: "Over 9.5 Asian Corners",
          key: "o95_asian_corners"
        },
        u95_asian_corners: {
          label: "Over 9.5 Asian Corners",
          key: "u95_asian_corners"
        },
        o10_asian_corners: {
          label: "Over 10 Asian Corners",
          key: "o10_asian_corners"
        },
        asian_corners_under_10: {
          label: "Under 10 Asian Corners",
          key: "asian_corners_under_10"
        }
      },

      fields: [
        {
          key: "label",
          label: "Label"
        },
        {
          key: "pre",
          label: "Pre",
          class: "text-right"
        },
        {
          key: "peak",
          label: "Peak",
          class: "text-right"
        }
      ]
    };
  },
  mounted() {},
  methods: {
    async getOdds(fixture_id) {
      const params = { fixture_id };
      const {
        peak_odds,
        pre_odds,
        attributes
      } = await this.$axios.$get("/user/odds/", { params });
      //this.peak_odds = peak_odds || {};
      //this.pre_odds = pre_odds || {};
      this.attributes = attributes;
    }
  },
  computed: {
    peak_odds() {
      return this.fixture.peak_odds;
    },
    pre_odds() {
      return this.fixture.pre_odds;
    },
    odds_data() {
      const { attributes, peak_odds, pre_odds } = this;
      const odds_data = {};
      for (const key in attributes) {
        odds_data[key] = {
          label: attributes[key].label,
          pre: pre_odds ? pre_odds[key] : null,
          peak: peak_odds ? peak_odds[key] : null
        };
      }

      // console.log(Object.values(odds_data));
      return Object.values(odds_data);
      for (const key in peak_odds) {
        odds_data[key].peak = peak_odds[key];
      }
      for (const key in pre_odds) {
        odds_data[key].pre = pre_odds[key];
      }
      return Object.values(odds_data);
    }
  }
};
</script>
