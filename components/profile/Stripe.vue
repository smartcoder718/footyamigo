<template>
  <b-row no-gutters class="local-content crypto-content">
    <b-col md="6" sm="12">
      <h3 class="main-heading">Get 4 months Pro Free</h3>
      <div class="d-grid grid-col-2 mb-4">
        <div class="summary">
          <h6 class="text-grey">Billing Amount</h6>
          <h6 class="text-primary"><del>£299</del> £199/year</h6>
        </div>
        <div class="summary">
          <h6 class="text-grey">Plan name</h6>
          <h6 class="bolded">Pro. Billed for 1 year</h6>
        </div>
      </div>
      <h6 style="font-weight: 400" class="text-justify">
        If you are planning to upgrade to Pro, it means you see the value of
        Footy Amigo and are ready to sky rocket your winning potential.
        <br />
        <br />
        Due to numerous messages and requests from our amigos, we are now
        offering <b>a discounted 1 year subscription plan that helps you save big.</b>
        <br />
        <br />
        Instead of paying £24.99 per month (which becomes £300 in 12 months),
        you can now pay for the whole year for <b>only £199</b> which is
        <b>30% OFF</b> and equates to getting <b>4 months Pro plan for free.</b>
        <br />
        <br />
        A yearly Pro plan gives you peace of mind and helps you save on the long
        run.
      </h6>
      <h4 class="text-primary mt-2">
        Ready to subscribe for 1 year and get 4 months free?
      </h4>
      <div class="pro-forms">
        <h3 class="main-heading local-text" style="font-weight: 500"></h3>
        <b-button
          variant="primary"
          block
          class="footy-button"
          target="_blank"
          href="https://buy.stripe.com/7sI5mvaQwa3d8yQ144 "
        >
          Make Payment
        </b-button>
      </div>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "Stripe",
  data() {
    return {};
  },
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
