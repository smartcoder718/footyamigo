<template>
  <div id="change-password">
    <div v-if="!sent">
      <h1 class="">Change Password?</h1>
      <h4 class="text-grey" style="font-family: Poppins">
        Please enter a new password for your account.
      </h4>
      <hr class="mb-4" />
    </div>

    <div v-if="sent">
      <div class="centered">
        <Success />
      </div>
      <h3 style="font-weight:400">
        Password change successful. You can now login to your account with your
        new password.
      </h3>
    </div>

    <b-form class="footy-form" v-else>
      <b-form-group label="Password" label-for="password">
        <b-form-input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="Enter a strong password"
        ></b-form-input>
      </b-form-group>
      <b-form-group label="Confirm Password" label-for="password-confirmation">
        <b-form-input
          id="password-confirmation"
          v-model="form.password_confirmation"
          type="password"
          placeholder="Repeat the same password"
        ></b-form-input>
      </b-form-group>

      <input id="token" v-model="form.token" type="hidden" />
      <b-button
        variant="primary"
        block
        :class="loading ? 'signup-button ' : ''"
        :disabled="!isValidPass"
        class="footy-button"
        transition-style
        href="#nuxt"
        @click="changePassword"
      >
        Change Password
      </b-button>
    </b-form>
    <div class="text-grey mt-5 mb-3"></div>
    <div>
      <b-button
        block
        :variant="sent ? 'primary' : 'light'"
        class="footy-button mb-4"
        to="/auth/login/"
      >
        Go to Login
      </b-button>
    </div>
  </div>
</template>

<script>
import Success from "~/components/animations/Success";
import Loader from "~/components/Loader.vue";
export default {
  layout: "auth",
  middleware: "auth",
  auth: "guest",
  data() {
    return {
      form: { password: "", password_confirmation: "", token: "" },
      sent: false,
      loading: false
    };
  },
  components: {
    Success,
    Loader
  },
  mounted() {
    if (!this.token) {
      this.$router.push("/auth/forgot");
    } else {
      this.form.token = this.token;
    }
  },
  computed: {
    token() {
      return this.$route.query.token;
    },
    isValidPass() {
      return (
        this.form.password.length > 7 &&
        this.form.password == this.form.password_confirmation
      );
    }
  },
  methods: {
    async changePassword() {
      try {
        this.loading = true;
        const reset = await this.$axios.$post(
          "/auth/change-password",
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
