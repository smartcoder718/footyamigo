<template>
  <div>
    {{ filter }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      filter: null
    };
  },
  mounted() {
    this.getFilter(2);
  },
  methods: {
    async getFilter(id, page) {
      const params = { id };
      const filter = await this.$axios.$get(`/user/strategies/id/`, {
        params
      });

      this.filter = filter;

      //console.log(this.filter, this.filter.id);
    }
  }
};
</script>

<style></style>
