<template>
  <CreateOrEditStreak v-model="form" @updateStreak="updateStreak" />
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
  mounted() {
    this.fetchStreak();
  },
  components: {
    CreateOrEditStreak,
  },
  methods: {
    async fetchStreak() {
      try {
        const streak = await this.$axios.$get("/admin/streaks/market", {
          params: { market: this.$route.params.market },
        });
        Object.assign(this.form, streak);
      } catch (error) {
        console.log(error);
      }
    },
    async updateStreak() {
      try {
        const res = await this.$axios.$post("/admin/streaks/edit", this.form);
        this.$router.push("/admin/streaks/");
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style></style>
