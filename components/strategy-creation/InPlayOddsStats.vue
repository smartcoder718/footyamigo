<template>
  <div class="row-gap-30 flex-col">
    <footy-radio
      v-model="subcategoryLocal"
      v-if="category == 'odds'"
      label="InPlay or PreMatch Odds"
      :options="subcategories"
    ></footy-radio>

    <footy-dropdown-select
      v-model="idLocal"
      label="Select InPlay Stat"
      :options="ruleOptions"
      info="Select an inplay live stat and event you want to be alerted on, e.g Shots On Target, Corners, Goals, etc"
    ></footy-dropdown-select>

    <template v-if="hasTeam">
      <footy-dropdown-select
        v-model="teamLocal"
        label="Team"
        :options="filteredTeams"
        id="team"
        info=" Select the team that you want the inplay stat above to match e.g Home Team, Away Team, Favorite Playing at Home, etc"
      ></footy-dropdown-select>
    </template>
  </div>
</template>

<script>
//import in_play_statistics from "~/components/json/in-play-statistics.json";
import in_play_team from "~/components/json/in-play-team.json";

export default {
  props: {
    id: [Number, String],
    team: [Number, String],
    category: String,
    subcategory: String,
    teams: Array
  },
  data() {
    return {
      in_play_team,
      subcategories: [
        { text: "Live Odds", value: "live_odds" },
        { text: "Pre Match Odds", value: "pre_odds" }
      ]
    };
  },

  watch: {
    filteredTeams: {
      handler: function(val) {
        const team = val[0];
        if (team) {
          //this.teamLocal = team.value;
        }
      },
      immediate: true
    },
    // subcategory: {
    //   handler: function(val) {
    //     const option = this.ruleOptions[0];
    //     if (option) {
    //       this.idLocal = option.value;
    //     }
    //   },
    //   immediate: true
    // },
    category: {
      handler: function(val) {
        const option = this.ruleOptions[0];
        if (option) {
          //this.idLocal = option.value;
        }
      },
      immediate: true
    }


  },
  computed: {
    idLocal: {
      get: function() {
        return this.id;
      },
      set: function(value) {
        this.$emit("update:id", value);
      }
    },
    teamLocal: {
      get: function() {
        return this.team;
      },
      set: function(value) {
        this.$emit("update:team", value);
      }
    },
    subcategoryLocal: {
      get: function() {
        return this.subcategory;
      },
      set: function(value) {
        this.$emit("update:subcategory", value);
      }
    },
    filteredTeams() {
      if (this.teams) {
        return Object.values(in_play_team).filter(x =>
          this.teams.includes(x.value)
        );
      } else {
        return Object.values(in_play_team);
      }
    },
    ruleOptions() {
      const rules = this.$store.state.in_play_rules
        .filter(rule => rule.category == this.category)
        .map(rule => {
          return {
            value: rule.id,
            text: rule.label
          };
        });

      return rules;
    },
    hasTeam() {
      const { lookupInPlayRules } = this.$store.getters;
      return lookupInPlayRules[this.id] && lookupInPlayRules[this.id].has_team;
    }
  }
};
</script>

<style></style>
