<template>
  <b-row no-gutters class="card-content">
    <b-col v-if="step == 1" md="6" sm="12">
      <h3 class="main-heading">Pay via Card or Paypal</h3>
      <p class="sub-description">
        Billing Amount: <span class="active">£24.99/month</span>
      </p>

      <b-form class="pro-forms">
        <b-form-group label="Email" label-for="subscription_form-email">
          <footy-input
            id="subscription_form-email"
            v-model="subscription_form.email"
          ></footy-input>
        </b-form-group>

        <b-button
          variant="primary"
          block
          class="footy-button"
          @click="nextStep"
        >
          <span
            class="text"
            style="display: inline-block; transform: translateY(2px)"
          >
            Next Step
          </span>
          <span class="ml-2">
            <img :src="`/icons/east.svg?inline`" alt="" />
          </span>
        </b-button>
        <p class="text-center sub-description footer-des">
          All payments on Footy Amigo are being processed using Paddle.com
          payment gateway
        </p>
        <div class="img-container d-flex justify-content-center">
          <b-img src="/icons/form.svg" class="img-fluid"></b-img>
        </div>
      </b-form>
    </b-col>
    <b-col v-show="step == 2" md="6" sm="12">
      <div class="cards-2">
        <h3 class="main-heading">Subscription Summary</h3>
        <div class="summary-content">
          <div class="summary">
            <p class="sub-description">Billing Amounth</p>
            <p class="active sub-description">£24.99/month</p>
          </div>
          <div class="summary">
            <p class="sub-description">Plan name</p>
            <p class="bolded sub-description">Pro. Billed for month</p>
          </div>
          <div class="summary">
            <p class="sub-description">Purchase Item</p>
            <p class="bolded sub-description">651937</p>
          </div>
        </div>
        <div class="checkout-container"></div>

        <div class="form-texts">
          <b-button
            variant="secondary"
            class="footy-button back-btn"
            @click="backStep"
          >
            <span class="mr-2">
              <img :src="`/icons/back.svg?inline`" alt="" />
            </span>
            <span
              class="text"
              style="display: inline-block; transform: translateY(2px)"
            >
              Back
            </span>
          </b-button>
        </div>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import FootyVerticalRadio from "../common/FootyVerticalRadio.vue";

export default {
  components: { FootyVerticalRadio },
  name: "Card",
  head: {
    script: [
      {
        src: "https://cdn.paddle.com/paddle/paddle.js",
        defer: true
      }
    ]
  },

  data() {
    return {
      subscription_form: {
        name: this.$auth.user.firstname,
        email: this.$auth.user.email,

        address: "",
        zipCode: "",
        state: "",
        city: "",
        country: null,
        cardNumber: "",
        name: "",
        month: "",
        year: "",
        cvv: ""
      },
      step: 1,
      showForm: false,
      searchText: ""
    };
  },
  methods: {
    toggleCountry(val) {
      this.subscription_form.country = val;
    },
    nextStep() {
      this.step += 1;
      this.openCheckout();
    },
    backStep() {
      this.step -= 1;
    },
    toggleForm() {
      this.showForm = !this.showForm;
    },
    dropdownHidden() {
      this.searchText = "";
    },
    async createCharge() {
      try {
        const { payment_url, vendor } = await this.$axios.$get(
          "/user/paddle/buy-pro"
        );
        return { payment_url, vendor: Number(vendor) };
      } catch (error) {
        console.log(error);
      }
    },
    async openCheckout() {
      const { payment_url, vendor } = await this.createCharge();
      this.Paddle.Setup({ vendor });
      this.Paddle.Checkout.open({
        method: "inline",
        override: payment_url,
        disableLogout: true,
        frameTarget: "checkout-container", // The className of your checkout <div>
        frameInitialHeight: 416,
        frameStyle:
          "width:100%; min-width:286px; background-color: transparent; border: none;"
      });
    }
  },

  computed: {
    Paddle() {
      return Paddle;
    }
  }
};
</script>

<style lang="scss">
@import "~assets/scss/breakpoints";
.pro-forms {
  width: 100%;
  margin-top: 30px;
  .subscription_form-countries {
    button {
      background: #ffffff;
      border: 1px solid #d5ded5;
      box-sizing: border-box;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;

      height: 54px;
    }
    .dropdown-menu.show {
      position: absolute;
      will-change: transform;
      top: 54px !important;
      left: 0px;
      max-height: 400px;
      overflow-y: auto;
      transform: none !important;
      right: 0 !important;
      background: #f7f9f7 !important;
      box-shadow: none;
    }
    .form-group {
      margin-bottom: 0px !important;
    }
    .b-dropdown-form {
      margin: 10px;
    }
  }
}
.card-content {
  .main-heading {
    margin-bottom: 10px;
  }
  .sub-description {
    font-size: 14px;
    line-height: 21px;
    color: #60685f;
    span {
      color: #60b15a;
    }
  }
  .footer-des {
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    margin-top: 30px;
    margin-bottom: 20px;
  }
  .summary-content {
    display: grid;
    grid-template-columns: 1fr 1.5fr 1fr;
    column-gap: 30px;
    margin-bottom: 35px;
    .summary {
      p {
        &.bolded {
          color: #222622 !important;
        }
        &.active {
          color: #60b15a !important;
        }
      }
    }
  }
  .form-texts {
    margin-top: 35px;
    .link-text {
      // font-family: "Poppins", sans-serif;
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      line-height: 21px;
      text-decoration-line: underline;
      color: #60685f;
      a {
        color: #60685f;
      }
    }
    .vat-text {
      margin-bottom: 30px;
      color: #60b15a;
      display: inline-block;
    }
    .main-heading {
      font-size: 14px !important;
      line-height: 21px !important;
    }
    .sub-text {
      margin-bottom: 20px;
    }
  }
  .cards-2 {
    .back-btn,
    .btn-black {
      // font-family: "Poppins", sans-serif;
      font-style: normal;
      font-weight: bold;
      font-size: 14px;
      line-height: 20px;
      text-align: center;

      margin-top: 30px;
      display: block;
    }
  }
}
@media (max-width: $lg) {
  .card-content {
    .summary-content {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      column-gap: 30px;
      row-gap: 15px;
      .summary {
        p {
          &.bolded {
            color: #222622 !important;
          }
          &.active {
            color: #60b15a !important;
          }
        }
      }
    }
  }
}
</style>
