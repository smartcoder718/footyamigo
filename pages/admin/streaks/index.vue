<template>
  <div>
    <b-row>
      <b-col cols="12">
        <b-button class="footy-button" to="/admin/streaks/create">
          Add streak
        </b-button>

        <b-table :items="streaks" class="my-4" borderless :fields="fields">
          <template #cell(actions)="data">
            <b-button
              class="footy-button"
              :to="'/admin/streaks/edit/' + data.item.market"
            >
              Edit Streak
            </b-button>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      streaks: [],
      fields: ["market", "title", "subtitle", "actions"],

    };
  },
  methods: {
    async fetchStreaks() {
      try {
        const streaks = await this.$axios.$get("/admin/streaks");
        this.streaks = streaks;
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.fetchStreaks();
  },
};
</script>

<style lang="scss">
.add-streak-form {
  .footy-input {
    margin-bottom: 10px;
  }
}
</style>
