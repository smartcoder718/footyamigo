<template>
  <CreateOrEditUpdate v-model="form" />
</template>

<script>
import CreateOrEditUpdate from "~/components/admin/updates/CreateOrEditUpdate";
export default {
  layout: "admin",
  data() {
    return {
      form: {
        title: "",
        content: "",
        version: null,
        datetime: new Date(),
        completed: false
      }
    };
  },
  mounted() {
    this.fetchUpdate();
  },
  methods: {
    async fetchUpdate() {
      const form = await this.$axios.$get("/admin/updates/id", {
        params: this.$route.params
      });
      this.$set(this, "form", form);
    }
  },
  components: {
    CreateOrEditUpdate
  }
};
</script>
