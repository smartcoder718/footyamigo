<template>
  <CreateBetBuilder v-model="form" />
</template>

<script>
import CreateBetBuilder from "~/components/admin/betbuilders/CreateBetBuilder";
export default {
  layout: "admin",
  data() {
    return {
      form: {
        rules: [],
        probabilities: [],
        odds: [],
        outcomes: null,
        title: null,
        leagues: []
      }
    };
  },
  mounted() {
    this.$store.dispatch("fetchLeagues").then(leagues => {
      console.log(leagues);
      this.form.leagues = leagues.map(x => x.value);
    });
  },
  components: {
    CreateBetBuilder
  }
};
</script>
