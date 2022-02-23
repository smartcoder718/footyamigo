<template>
  <CreateBetBuilder v-model="form" v-if="form" />
</template>

<script>
import CreateBetBuilder from "~/components/admin/betbuilders/CreateBetBuilder";
export default {
  layout: "admin",
  data() {
    return {
      form: null
    };
  },
  mounted() {
    this.fetchBetBuilder();
    this.$store.dispatch("fetchLeagues")
  },
  methods: {
    async fetchBetBuilder() {
      const params = { id: this.$route.params.id };
      const bet_builder = await this.$axios.$get("/admin/bet-builders/id", {
        params
      });
      this.$set(this, "form", bet_builder);
    }
  },

  components: {
    CreateBetBuilder
  }
};
</script>
