<template>
  <b-row no-gutters class="local-content crypto-content">
    <b-col md="6" sm="12">
      <h3 class="main-heading">Pay via Crypto</h3>
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
      <h3 class="main-heading local-text" style="font-weight:500">
        Paying with Crypto is easy and secure. We have teamed up with CoinBase
        to accept all Crypto payments securely.
        <br /><br />
        You will be able to pay with your Coinbase account directly or pay via
        your preferred cryptocurrency to pay with another wallet.
        <br />
        <br />
        Once payment is successful, your Pro account is issued instantly.
      </h3>
      <div class="pro-forms">
        <h3 class="main-heading local-text" style="font-weight:500"></h3>
        <b-button
          variant="primary"
          block
          class="footy-button"
          @click="createCharge"
        >
          Pay via CoinBase
        </b-button>
      </div>
    </b-col>
    <b-alert
      v-model="isAlert"
      class="
        position-fixed
        fixed-bottom
        m-0
        rounded-0
        d-flex
        align-items-center
        justify-content-center
      "
      style="z-index: 2000"
    >
      {{ alertText }}
    </b-alert>
  </b-row>
</template>

<script>
export default {
  name: "Crypto",
  data() {
    return {
      proUser: {
        country: ""
      },
      walletAddress: `0xb15328a7b1675100d8bc519d1ba594ec86243a33`,
      price: `0.0831 ETH // £24.99`,
      isAlert: false,
      alertText: "",
      charge: null
    };
  },
  methods: {
    async createCharge() {
      try {
        const payment_url = await this.$axios.$get("/user/coinbase/buy-pro");
        window.location.replace(payment_url);
      } catch (error) {
        console.log(error);
      }
    }
    /*async copyURL(text) {
      try {
        await navigator.clipboard.writeText(text);
        this.isAlert = true;
        this.alertText = "Copied";
        setTimeout(() => {
          this.isAlert = false;
        }, 1000);
      } catch ($e) {
        this.isAlert = true;
        this.alertText = "Error While Copying";
        setTimeout(() => {
          this.isAlert = false;
        }, 1000);
      }
    }*/
  }
};
</script>

<style lang="scss">
.crypto-content {
  .pro-forms {
    margin-top: 30px !important;
    .local-text {
      margin-bottom: 30px !important;
    }
  }
  .code {
    word-wrap: break-word;
  }
}
</style>
