<template>
  <div class="">
    <div class="d-flex flex-col row-gap-20">
      <div>
        <h1 class="">Login ✌️</h1>
        <h4 class="text-grey" style="font-family: Poppins">
          Do it smarter, not harder! Login in seconds and see what FootyAmigo
          can do for you!
        </h4>
      </div>
      <b-button
        block
        variant="lightpink"
        class="footy-button mb-4 d-none"
        href="https://accounts.google.com"
        disabled
      >
        <b-img src="/vectors/google.svg" class="mr-2"> </b-img> Sign In with
        Google
      </b-button>
    </div>

    <hr />
    <b-form class="footy-form d-flex flex-col row-gap-20" @submit.prevent="loginUser">
      <b-alert
        v-model="showErrorAlert"
        variant="danger"
        dismissible
        dismiss-count-down="3"
      >
        {{ errormessage }}
      </b-alert>

      <footy-input
        id="email"
        v-model="form.email"
        type="text"
        label="Email"
      ></footy-input>
      <footy-input
        id="password"
        v-model="form.password"
        type="password"
        label="Password"
      ></footy-input>

      <div class="reset-remember mb-4">
        <b-form-checkbox
          id="checkbox-1"
          v-model="form.remember"
          :value="true"
          :unchecked-value="false"
          :class="form.remember ? 'text-primary' : 'text-grey'"
        >
          Remember me
        </b-form-checkbox>
        <div class="">
          <nuxt-link to="/auth/forgot" class="text-grey">
            Forgot password?
          </nuxt-link>
        </div>
      </div>

      <b-button
        variant="primary"
        block
        class="footy-button"
        type="submit"
        :disabled="!validForm"
      >
        Login
      </b-button>
    </b-form>
    <div class="text-grey mt-5 mb-3">Not Registered yet?</div>
    <div>
      <b-button
        block
        variant="lightpink"
        class="footy-button mb-4"
        to="/auth/signup/"
      >
        Sign Up
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  layout: "auth",
  data() {
    return {
      form: { remember: false, email: "", password: "" },
      showErrorAlert: false,
      errormessage: null
    };
  },
  middleware: "auth",
  auth: "guest",
  methods: {
    async loginUser() {
      try {
        await this.$auth.loginWith("cookie", { data: this.form });
        // this.$router.push("/dashboard");
      } catch (error) {
        if (error.response) {
          this.errormessage = error.response.data;
        } else {
          console.error(error);
        }
        this.showErrorAlert = true;
        const $vm = this;
        setTimeout(() => {
          $vm.showErrorAlert = false;
        }, 3000);
      }
    }
  },
  computed: {
    validForm() {
      return this.form.email && this.form.password.length > 7;
    }
  },
  watch: {
    "form.email"(val) {
      return (this.form.email = val.toLowerCase().trim());
    },
    "form.password"(val) {
      return (this.form.password = val.trim());
    }
  }
};
</script>

<style lang="scss">
// .auth-page {
//   h1,
//    .title {
//     font-size: 48px;
//     line-height: 72px;
//     letter-spacing: -1px;

//     margin-bottom: 16px;
//   }
//   h3,
//    .description {
//     font-weight: 600;
//     font-size: 16px;
//     line-height: 24px;
//     color: #60685f;
//     margin-bottom: 20px;
//   }
//   label {
//     margin-bottom: 12px;

//   }
//   .btn-lightpink {

//   }
//   .reset-remember{
//     label{
//       margin-bottom: 0px;
//     }
//   }
// }
</style>
