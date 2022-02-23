<template>
  <CreateOrEditStreak v-model="form" @updateStreak="addStreak" />
</template>

<script>
import CreateOrEditStreak from "~/components/streaks/CreateOrEditStreak.vue";
export default {
  data() {
    return {
      form: {
        market: "",
        title: "",
        subtitle: "",
        header: "",
        description: "",
      },
    };
  },
  components: {
    CreateOrEditStreak,
  },
  methods: {
    async addStreak() {
      try {
        const res = await this.$axios.$post("/admin/streaks/create", this.form);
        this.$router.push("/admin/streaks/")
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style></style>
