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
  mounted() {},
  components: {
    CreateOrEditUpdate
  }
};
</script>
