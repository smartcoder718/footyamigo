<template>
  <div class="">
    <div class="d-flex flex-col row-gap-20">
      <div>
        <h1 class="">Sign Up ✌️</h1>
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
        <b-img src="/vectors/google.svg" class="mr-2"> </b-img> Sign Up with
        Google
      </b-button>
    </div>

    <hr />
    <b-form class="footy-form" @submit.prevent="signupUser" id="footy-form">
      <b-alert v-model="showErrorAlert" variant="light" dismissible class="p-0">
        <div>Please check the following fields</div>
        <div class="p-3">
          <ul class="mb-0">
            <li
              class="text-danger small"
              v-for="error in errors"
              :key="error.param"
              v-html="errormessages[error.param]"
            ></li>
          </ul>
        </div>
      </b-alert>

      <div v-show="!enableCode">
        <b-form-group label="Email" label-for="email" class="footy-input-group">
          <b-form-input
            id="email"
            v-model="form.email"
            type="text"
            label="Email"
            name="email"
          ></b-form-input>
        </b-form-group>

        <div class="d-grid grid-col-2 gap-10">
          <b-form-group
            label="First Name"
            label-for="firstname"
            class="footy-input-group"
            description="Must be between than 3 and 20 characters"
          >
            <b-form-input
              id="firstname"
              name="firstname"
              v-model="form.firstname"
              type="text"
              label="First Name"
              :state="firstnameState || form.firstname.length == 0"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label="Last Name"
            label-for="lastname"
            class="footy-input-group"
            description="Must be between than 3 and 20 characters"
          >
            <b-form-input
              id="lastname"
              name="lastname"
              v-model="form.lastname"
              type="text"
              :state="lastnameState || form.lastname.length == 0"
              label="Last Name"
            ></b-form-input>
          </b-form-group>
        </div>
    

        <b-form-group
          label="Password"
          label-for="password"
          class="footy-input-group"
          description="Must be atleast 8 characters"
        >
          <b-form-input
            id="password"
            name="password"
            v-model="form.password"
            :state="passwordState || !form.password"
            type="password"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Repeat Password"
          label-for="password_confirmation"
          class="footy-input-group"
          description="Repeat the same password entered above"
        >
          <b-form-input
            id="password_confirmation"
            v-model="form.password_confirmation"
            type="password"
            :state="confirmState || !form.password_confirmation"
          ></b-form-input>
        </b-form-group>
      </div>

      <div v-show="enableCode">
        <h2 style="font-size: 26px; line-height: 32px" class="mb-3">
          Account activation code has been sent to your email
        </h2>
        <small style="font-weight: 400">
          Please enter the 6 digit code sent to your email {{ form.email }} to
          finish the signup process. <br />(Please Check your
          <b>inbox, promotion tab or spam folder</b>)
        </small>
        <div class="centered my-3">
          <OtpInput v-model="form.code"> </OtpInput>
        </div>
      </div>

      <b-button
        variant="primary"
        block
        class="footy-button mb-3 "
        type="submit"
        transition-style
        :class="loading ? 'signup-button ' : ''"
        :disabled="!validForm"
      >
        <span> {{ enableCode ? "Finish " : "" }} Signup</span>
      </b-button>

      <b-button
        variant="secondary"
        block
        class="footy-button centered "
        type="button"
        @click="goBack"
        v-if="enableCode"
      >
        <span
          class="material-icons-outlined icon-left"
          style="font-size: 14px;"
        >
          arrow_back
        </span>
        Go Back
      </b-button>
    </b-form>
    <div class="text-grey mt-5 mb-3">Already Registered?</div>
    <div>
      <b-button
        block
        variant="lightpink"
        class="footy-button mb-4"
        to="/auth/login/"
      >
        Login
      </b-button>
    </div>
  </div>
</template>

<script>
import OtpInput from "~/components/OtpInput";
export default {
  layout: "auth",
  data() {
    return {
      form: {
        remember: false,
        email: "",
        firstname: "",
        lastname: "",
        password: "",
        password_confirmation: "",
        utcoffset: new Date().getTimezoneOffset() * -1,
        code: ""
      },
      loading: false,
      showErrorAlert: false,
      errormessage: null,
      errors: [],
      enableCode: false,
      errormessages: {
        firstname: "First Name must contains only alphabets",
        lastname: "Last Name must contains only alphabets",
        email: "Email must be a valid email. Like someone@gmail.com"
      }
    };
  },
  components: {
    OtpInput
  },
  middleware: "auth",
  auth: "guest",
  methods: {
    async signupUser() {
      try {
        this.loading = true;
        await this.$axios.$post("/auth/signup", this.form);
        if (this.enableCode) {
          await this.$auth.loginWith("cookie", { data: this.form });
        }
        this.enableCode = true;
        //await this.$auth.loginWith("cookie", { data: this.form });
        //this.$router.push("/dashboard");
      } catch (error) {
        this.loading = false;
        if (error.response) {
          this.errors = error.response.data.errors.errors;
        } else {
          console.error(error);
        }

        this.showErrorAlert = true;
      } finally {
        this.loading = false;
      }
    },
    goBack() {
      this.enableCode = false;
      this.form.code = "";
    }
  },
  watch: {
    "form.email"(val) {
      return (this.form.email = val.toLowerCase().trim());
    },
    "form.firstname"(val) {
      return (this.form.firstname = val.trim());
    },
    "form.lastname"(val) {
      return (this.form.lastname = val.trim());
    },
    "form.password"(val) {
      return (this.form.password = val.trim());
    },
    "form.password_confirmation"(val) {
      return (this.form.password_confirmation = val.trim());
    },
    "form.code"(val) {
      return (this.form.code = val.trim());
    }
  },
  computed: {
    passwordState() {
      return this.form.password.length > 7;
    },
    firstnameState() {
      return this.form.firstname.length >= 3 && this.form.firstname.length < 20;
    },
    lastnameState() {
      return this.form.lastname.length >= 3 && this.form.lastname.length < 20;
    },
    confirmState() {
      return this.form.password_confirmation == this.form.password;
    },
    validForm() {
      return (
        this.form.email &&
        this.firstnameState &&
        this.lastnameState &&
        this.passwordState &&
        this.confirmState
      );
    }
  }
};
</script>

<style lang="scss">
@import "~assets/scss/breakpoints";
@import "~/assets/scss/colors";

.was-validated .form-control:invalid,
.form-control.is-invalid,
.was-validated .form-control:valid,
.form-control.is-valid {
  background-image: none !important;
}
.is-invalid,
.is-invalid:focus {
  // border-color: ;
  border: 1px solid #ff1111 !important;
}
.is-invalid + small {
  color: #ff1111 !important;
}

// :root {
//   --surface: hsl(208 50% 10%);
//   --surfaceHSL: 0 0% 6%;
//   --text: hsl(208 50% 78%);
//   --white: hsl(205 100% 94%);
//   --brand: hsl(208 46% 52%);
//   --brandHSL: 208 46% 52%;
//   --brand-alt: hsl(205 100% 20%);
//   --pink: hsl(328 60% 58%);
//   --high-contrast: hsl(205 100% 96%);
// --primary
//   --layer-surface: 1;
//   --layer-tooltip: 2;
//   --layer-sticky: 3;
// }

// @media (prefers-color-scheme: light) {
//   :root {
//     --surface: hsl(216 80% 100%);
//     --surfaceHSL: 0 0% 100%;
//     --text: hsl(208 25% 35%);
//     --white: hsl(0 0% 100%);
//     --brand: hsl(216 60% 54%);
//     --brandHSL: 216 60% 54%;
//     --brand-alt: hsl(205 100% 86%);
//     --pink: deeppink;
//     --high-contrast: hsl(205 100% 10%);
//   }
// }
</style>
