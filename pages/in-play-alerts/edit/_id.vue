<template>
  <div>
    <CreateStrategy
      v-model="form"
      :pageTitle="pageTitle"
      :strategyType="strategyType"
      v-if="form"

    />
  </div>
</template>

<script>
import CreateStrategy from "@/components/strategy-creation/CreateStrategy";

export default {
  data() {
    return {
      form: null,
      pageTitle: "Edit InPlay Strategy",
      strategyType: "in-play-alerts"
    };
  },
  mounted() {
    this.getFilter(this.$route.params.id);
  },
  methods: {
    async getFilter(id) {
      try {
        const params = { id };
        const filter = await this.$axios.$get("/user/strategies/id", {
          params
        });
        this.$set(this, "form", filter);
      } catch (error) {
        console.error(error);
      }
    }
  },
  components: {
    CreateStrategy
  }
};
</script>

<style></style>
