<template>
  <div>
    <div v-if="!sent">
      <h1 class="">Forgot Password?</h1>
      <h4 class="text-grey" style="font-family: Poppins">
        Please provide your email and we will send you password recover link
      </h4>
      <hr class="mb-4" />
    </div>

    <h4 v-if="sent" style="font-weight:400">
      <Sent />
      <span class="text-primary">
        Success! Password reset link has been sent to your email
        {{ form.email }}.
      </span>

      <br>
      <br>

      (Please Check your
      <b>inbox, promotion tab or spam folder</b>)
    </h4>
    <b-form class="footy-form" v-else>
      <b-form-group label="Email" label-for="email">
        <b-form-input
          id="email"
          class="mt-3"
          v-model="form.email"
          type="text"
          placeholder="someone@email.com"
        ></b-form-input>
      </b-form-group>

      <b-button
        variant="primary"
        block
        :class="loading ? 'signup-button ' : ''"
        class="footy-button"
        transition-style
        @click="sendResetLink"
      >
        Send Recover Link
      </b-button>
    </b-form>
    <div class="text-grey mt-5 mb-3"></div>
    <div>
      <b-button
        block
        variant="lightpink"
        class="footy-button mb-4"
        to="/auth/login/"
      >
        Back to Login
      </b-button>
    </div>
  </div>
</template>

<script>
import Sent from "~/components/animations/Sent";
export default {
  layout: "auth",
  middleware: "auth",
  auth: "guest",
  data() {
    return {
      form: { email: "" },
      sent: false,
      loading: false
    };
  },
  components: {
    Sent
  },
  methods: {
    async sendResetLink() {
      try {
        this.loading = true;
        const reset = await this.$axios.$post(
          "/auth/send-reset-link",
          this.form
        );
        this.sent = true;
      } catch (error) {
        this.$router.push("/auth/forgot");
      } finally {
        this.$scrollToTop();
        this.loading = false;
      }
    }
  }
};
</script>
