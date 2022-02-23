<template>
  <b-row no-gutters>
    <b-col md="6" sm="12">
      <b-form class="footy-form">
        <b-form-group
          label="Old Password"
          label-for="old-password"
          class="mb-4"
        >
          <footy-input
            id="old-password"
            v-model="password.password"
            type="password"
          ></footy-input>
        </b-form-group>
        <b-form-group
          label="New Password"
          label-for="new-password"
          class="mb-4"
        >
          <footy-input
            id="new-password"
            v-model="password.new"
            type="password"
          ></footy-input>
        </b-form-group>
        <b-form-group
          label="Repeat Password"
          label-for="repeat-password"
          class="mb-4"
        >
          <footy-input
            id="repeat-password"
            v-model="password.repeat"
            type="password"
          ></footy-input>
        </b-form-group>

        <b-button
          variant="primary"
          block
          class="footy-button"
          @click="updatePassword"
        >
          Update Password
        </b-button>
        <b-button
          variant="dangerous"
          block
          class="footy-button mt-5"
          :disabled="!isValid"
        >
          Delete Account
        </b-button>
      </b-form>
    </b-col>
  </b-row>
</template>

<script>
export default {
  data() {
    return {
      password: {
        password: "",
        new: "",
        repeat: ""
      }
    };
  },
  methods: {
    isValidPassword(password) {
      return password.length >= 8;
    },
    async updatePassword() {
      try {
        const message = await this.$axios.post(
          "/user/update-password",
          this.password
        );

        await this.$bvToast.toast(
          `Yay! Your password has been successfully updated.`,
          {
            title: "Success",
            variant: "primary",
            position: "b-toaster-bottom-center",
            solid: true,
            autoHideDelay: 5000
          }
        );
      } catch (error) {
        console.error(error)
        await this.$bvToast.toast(
          `Oops! Password update failed. Please enter correct old password.`,
          {
            title: "Failed",
            variant: "danger",
            position: "b-toaster-bottom-center",
            solid: true,
            autoHideDelay: 10000
          }
        );
      }
    }
  },

  computed: {
    isValid() {
      return (
        this.isValidPassword(this.password.password) &&
        this.isValidPassword(this.password.new) &&
        this.password.new === this.password.repeat
      );
    }
  }
};
</script>

<style lang="scss">
.password-tab {
  margin-top: 32px;

  .btn-danger {
    background: #ffefef;
    color: #dc6060;
    border: none;
    font-weight: 600 !important;
  }
}
</style>
