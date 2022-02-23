<template>
  <div>
    <b-row align-h="center">
      <b-col cols="12" md="8" lg="6">
        <div class="d-grid gap-20">
          <h3>Send Broadcast</h3>
          <div>
            <label for="">Title</label>
            <b-input v-model="form.title"> </b-input>
          </div>
          <div>
            <label for="">Message</label>
            <b-textarea v-model="form.message" rows="12"> </b-textarea>
          </div>
          <div>
            <label for="">Platform</label>
            <footy-radio
              :options="platforms"
              v-model="form.platform"
            ></footy-radio>
          </div>
          <div>
            <label for="">Audience</label>
            <footy-vertical-radio
              :options="audiences"
              v-model="form.audience"
            ></footy-vertical-radio>
          </div>
          <b-button
            class="footy-button"
            :variant="loading ? 'secondary' : 'primary'"
            @click="sendBroadcast"
            >Send Message

            <b-spinner small v-if="loading"> </b-spinner
          ></b-button>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      form: {
        title: "",
        message: "",
        audience: "free",
        platform: "telegram",
      },
      loading: false,
      platforms: [
        { value: "telegram", text: "Telegram" },
        { value: "footyamigo", text: "Footyamigo" },
      ],
      audiences: [
        { value: "free", text: "Free Users" },
        { value: "trial", text: "Trial Users" },
        { value: "pro", text: "Pro Users" },
        { value: "all", text: "All Users" },
      ],
    };
  },
  methods: {
    async sendBroadcast() {
      try {
        this.loading = true;
        if (confirm("Send?")) {
          const result = await this.$axios.$post(
            "/admin/broadcast/send",
            this.form
          );
          this.$bvToast.toast(`Message Sent to ${this.form.audience} users`, {
            title: `Success!`,
            variant: "success",
            toaster: "b-toaster-top-center",
            solid: true,
          });
          Object.assign(this.form, {
            title: "",
            message: "",
            audience: "free",
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style></style>
