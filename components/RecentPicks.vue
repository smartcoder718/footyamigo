<template>
  <div class="d-grid gap-20" style="align-content: start;   ">
    <h3 class="inner-heading">Recent Match Picks</h3>
    <footy-radio
      id="recent-picks"
      v-model="recentPick.active"
      :options="recentPick.modes"
      radioClass="w-100-mobile centered "
    >
    </footy-radio>

    <div class="fmt" v-if="picks.length">
      <div class="fmt-head fmt-row text-grey">
        <div class="fixture-title">
          FIXTURE
        </div>
        <div class="created-at">SENT AT</div>
        <div class="actions centered">ACTIONS</div>
      </div>

      <div v-for="(pick, i) in picks" :key="i" class="fmt-row">
        <div class="fmt-label text-grey">
          FIXTURE
        </div>
        <div class="fmt-label text-grey">
          SENT AT
        </div>
        <div class="fixture-title">
          {{ pick.home_name }} - {{ pick.away_name }}
        </div>
        <div class="created-at">
          {{ $moment.utc(pick.sending_time*1000).local().format("lll") }}
        </div>
        <div class="actions">
          <b-button
            variant="secondary"
            class="footy-button "
            block
            :to="'/fixtures?fixture_id=' + pick.fixture_id"
            >View</b-button
          >
        </div>
      </div>
    </div>
    <div v-else class="centered py-3">
      <h4 class="text-grey">No picks sent yet !</h4>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showStrategy: false,
      strategyId: null,
      recentPicks: {
        sent_to_user: [
          // { title: "Arsenal - Chelsea", date: new Date() },
          // { title: "Liverpool- Man United", date: new Date() },
          // { title: "Barcelona - Real Ma...", date: new Date() },
          // { title: "Bangladesh - Nigeria", date: new Date() },
        ],
        sent_to_others: [
          // { title: "Demo - Demo1", date: new Date() },
          // { title: "Daniel - Vishal", date: new Date() },
          // { title: "Laora - Lesson", date: new Date() },
          // { title: "Damn - Bangladesh", date: new Date() },
        ]
      },
      recentPick: {
        modes: [
          { text: "Sent to Others", value: "sent_to_others" },
          { text: "Sent to You", value: "sent_to_user" }
        ],
        active: "sent_to_others",
        fields: ["title", "created_at", "actions"]
      }
    };
  },
  computed: {
    picks() {
      return this.recentPicks[this.recentPick.active];
    }
  },
  mounted() {
    this.getRecentPicks();
  },
  methods: {
    async getRecentPicks() {
      try {
        let picks = await this.$axios.getRecentPicks();
        this.recentPicks = picks;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
