<template>
  <div v-if="loading" class="loading"><Loading /></div>
  <div class="results" v-else>
    <div>
      <footy-tab-select
        :options="Object.values(teams)"
        v-model="team"
        size="sm"
      >
      </footy-tab-select>
    </div>
    <b-list-group v-if="team != 'h2h'">
      <footy-tab-select
        :options="locationOptions"
        id="location"
        v-model="location"
        size="sm"
      >
      </footy-tab-select>
      <div></div>
      <b-list-group-item
        v-for="(result, index) in data[team][location].results"
        :key="index"
      >
        <result
          v-if="result.home_id == teams[team].id"
          :teamName="result.away_name"
          location="Home"
          :result="result"
          :winlose="winOrLose(result.winner, teams[team].id)"
        >
        </result>
        <result
          v-else
          :teamName="result.home_name"
          location="Away"
          :result="result"
          :winlose="winOrLose(result.winner, teams[team].id)"
        >
        </result>
      </b-list-group-item>
    </b-list-group>
    <b-list-group v-else>
      <b-list-group-item
        v-for="(result, index) in data.h2h.results"
        :key="index"
      >
        <result :location="fixture.league_name" :result="result"> </result>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import Result from "./Result.vue";
import Loading from "~/components/Loading.vue";
export default {
  props: {
    fixture: Object,
    h2h_updated: null,
    h2h_results: Object
  },
  data() {
    return {
      team: "h2h",
      locationOptions: [
        { text: "All", value: "all" },
        { text: "Home", value: "home" },
        { text: "Away", value: "away" }
      ],
      location: "home",
      loading: true,
      data: {
        h2h: {},
        home: {},
        away: {}
      }
    };
  },
  mounted() {
    this.fetchResults();
  },
  methods: {
    async fetchResults() {
      try {
        if (this.fixture.h2h_updated) {
          return (this.data = this.fixture.h2h_results);
        }
        this.loading = true;

        const { fixture_id } = this.fixture;
        console.log(this.fixture.fixture_id, "ID");
        const params = { fixture_id };
        const data = await this.$axios.$get("/user/stats/results/", { params });
        this.data = data;
        this.$emit("update:h2h_updated", true);
        this.$emit("update:h2h_results", data);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    getResults(team) {
      let items = { home: [], away: [], all: [] };
      for (var result of this.fixture[team].results) {
        if (result.home_id == this.fixture[team].smid) {
          items.home.push(result);
        } else {
          items.away.push(result);
        }
        items.all.push(result);
      }
      return items;
    },
    winOrLose(winner, teamID) {
      if (winner == teamID) {
        return "win";
      } else if (winner == null) {
        return "draw";
      } else {
        return "lose";
      }
    }
  },
  components: {
    Result,
    Loading
  },
  computed: {
    teams() {
      return {
        h2h: { text: "H2H", value: "h2h" },
        home: {
          text: this.fixture.home_name,
          value: "home",
          id: this.fixture.home_id
        },
        away: {
          text: this.fixture.away_name,
          value: "away",
          id: this.fixture.away_id
        }
      };
    }
  }
};
</script>

<style lang="scss">
.loading {
  width: 100%;
}
.results {
  .list-group-item {
    background: #ffffff;
    border: 1px solid #f0f1f0;
    border-radius: 8px;
    margin-bottom: 10px;
  }
}
</style>
