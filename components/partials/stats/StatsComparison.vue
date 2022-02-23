<template>
  <div class="statscroller">
    <div v-for="item in fixtureStats" :key="item.key">
      <template v-if="item.type == 'heading'">
        <h4 class="stat-header my-4">
          {{ item.label }}
        </h4>
      </template>
      <template v-else-if="item.active">
        <div class="numbers">
          <span>{{ item.home + (item.type == "per" ? "%" : "") }}</span>
          <span>{{ item.label }}</span>
          <span>{{ item.away + (item.type == "per" ? "%" : "") }}</span>
        </div>

        <div class="progress-holder">
          <div style="flex: 1" class="left">
            <b-progress
              :value="item.home * 100"
              :max="item.overall * 100"
              class="mb-3"
              :variant="item.home >= item.away ? 'primary' : 'grey'"
            ></b-progress>
          </div>

          <div style="flex: 1" class="right">
            <b-progress
              :value="item.away * 100"
              :max="item.overall * 100"
              :variant="item.away >= item.home ? 'primary' : 'grey'"
              class="mb-3"
            ></b-progress>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import statKeysGrouped from "~/components/json/stat-keys-grouped.json";
import pairs from "~/components/json/pairs.json";
export default {
  props: {
    fixture: Object,
    stat: String,
    location: Object,
  },
  data() {
    return {
      statKeysGrouped,
      pairs,
    };
  },
  methods: {
    extractData(key, location, team) {
      let stat_key;
      let options = pairs[key]["options"];
      if (options) {
        stat_key = options[location];
      } else {
        stat_key = key;
      }
      if (team == "home") {
        return Number(this.fixture.home[stat_key]);
      } else {
        return Number(this.fixture.away[stat_key]);
      }
    },
  },
  computed: {
    fixtureStats() {
      let stats = statKeysGrouped[this.stat].map((item) => {
        if (typeof item === "string") {
          if (item == "League Pos.") {
          
            return {
              label: "League Pos.",
              home: this.fixture["home_position"],
              away: this.fixture["away_position"],
              overall:
                this.fixture["home_position"] + this.fixture["away_position"],
              active: true,
            };
          } else {
            item = item.substring(1);
            return { type: "heading", label: item, active: true };
          }
        } else {
          let key = item.key;
          let home = this.extractData(key, this.location.home, "home");
          let away = this.extractData(key, this.location.away, "away");
          let overall = home + away;
          let label = pairs[key]["alias"] || pairs[key]["title"];
          let type = pairs[key]["type"];
          let active = pairs[key]["active"];
          return { home, away, label, overall, type, active };
        }
      });
      return stats;
    },
  },
};
</script>

<style lang="scss">
.statscroller {
  .progress-holder {
    .progress {
      border-radius: 8px;
      .progress-bar {
        border-radius: 8px;
      }
    }
    .left {
      margin-right: 4px;
      -webkit-transform: scaleX(-1);
      transform: scaleX(-1);
    }
    .right {
      margin-left: 4px;
    }
  }
}
</style>
