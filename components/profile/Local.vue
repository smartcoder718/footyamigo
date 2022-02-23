<template>
  <b-row no-gutters class="local-content">
    <b-col md="6" sm="12">
      <h3 class="main-heading">Pay via Local Means</h3>
      <div class="summary-content">
        <div class="summary">
          <p class="sub-description">Billing Amount</p>
          <p class="active sub-description">£24.99/month</p>
        </div>
        <div class="summary">
          <p class="sub-description">Plan name</p>
          <p class="bolded sub-description">Pro. Billed for month</p>
        </div>
      </div>
      <!--h3 class="main-heading local-text">
        Unlike paying with Card or Paypal, once your payment has been made
        below, you will need to reach out to our 24/7 live support to confirm
        your payment and we will manually activate your Pro account for 1month.
      </h3-->
      <div class="text">
        <h3 class="main-heading">Select Your Country</h3>
        <p class="sub-description">
          Local payment option is only available for select countries.
        </p>
      </div>
      <b-form class="pro-forms">
        <b-form-group class="prouser-countries">
          <footy-vertical-radio
            v-model="country_id"
            :options="countryList"
            name="countries"
            id="countries"
            size="sm"
            filtered
            v-if="countries.length"
          ></footy-vertical-radio>
          <div v-else>
            <loader-general />
          </div>
        </b-form-group>

        <b-button
          variant="primary"
          block
          class="footy-button"
          target="_blank"
          @click="createCharge"
          :disabled="!country_id"
        >
          Make Payment
        </b-button>
        <div class="img-container mt-4 d-flex justify-content-center">
          <b-img src="/icons/form2.svg" class="img-fluid"></b-img>
        </div>
      </b-form>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "Local",
  head: {
    script: [
      {
        src: "https://checkout.flutterwave.com/v3.js",
        //src: "https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/flwpbf-inline.js",
        defer: true
      }
    ]
  },
  data() {
    return {
      countries: [],
      country_id: null,
      showForm: false
    };
  },
  computed: {
    countryList() {
      return this.countries.map(country => {
        return {
          text: country.name,
          value: country.id
        };
      });
    },
    fullPaymentURL() {
      const { firstname, lastname, email } = this.$auth.user;
      return (
        this.country_id +
        "?email=" +
        email +
        "&firstname=" +
        firstname +
        "&lastname=" +
        lastname
      );
    }
  },
  mounted() {
    this.fetchCountries();
  },
  methods: {
    async fetchCountries() {
      try {
        const countries = await this.$axios.$get("/user/local-countries");

        this.countries = countries;
      } catch (error) {
        console.log(error);
      }
    },
    async createCharge() {
      try {
        const payment_url = await this.$axios.$get(
          "/user/flutterwave/buy-pro",
          {
            params: { country_id: this.country_id }
          }
        );
        window.location.replace(payment_url);
      } catch (error) {
        console.log(error);
      }
    },
    makePayment() {
      FlutterwaveCheckout({
        public_key: "FLWPUBK_TEST-5859daaa22ab6ae4030f725cda9f4114-X",
        tx_ref: this.$uuid.v4(),
        amount: 10,
        currency: "USD",
        country: "US",
        //payment_options: " ",
        // specified redirect URL
        //redirect_url:"https://callbacks.piedpiper.com/flutterwave.aspx?ismobile=34",
        meta: {
          user_id: this.$auth.user.id
        },
        customer: {
          email: this.$auth.user.email,
          //phone_number: "08102909304",
          name: this.$auth.user.firstname + " " + this.$auth.user.lastname
        },
        callback: function(data) {
          console.log(data);
        },
        onclose: function() {
          // close modal
        },
        customizations: {
          title: "FootyAmigo Pro Subscription",
          description:
            "Upgrade to Pro today and join the thousands of smart and profitable football bettors who use Footy Amigo to beat the Bookies daily",
          logo: "https://i.imgur.com/0Yxihqp.png"
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "~assets/scss/breakpoints";
.pro-forms {
  width: 100%;
  margin-top: 30px;
  .prouser-countries {
    .footy-vertical-checkbox .checkbox-container {
      border: 1px solid #d5ded5;
      max-height: 450px;
      .checkbox-invisible-label {
        margin-bottom: 0px !important;
        border-radius: 0px !important;
      }
    }
  }
}
.local-content {
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
  .local-text {
    font-size: 14px !important;
    line-height: 21px !important;
  }
  .text {
    margin-top: 30px;
    .main-heading {
      font-size: 16px !important;
      line-height: 24px !important;
      margin-bottom: 6px !important;
    }
    .sub-description {
      font-size: 14px !important;
      line-height: 21px !important;
    }
  }
  .pro-forms {
    margin-top: 20px !important;
  }
}

@media (max-width: $lg) {
  .local-content {
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
