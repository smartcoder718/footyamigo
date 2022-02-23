<template>
  <div
    class="subscription-status page-content-box dont__dontd dont__slideInUp"
    v-if="$auth.user"
  >
    <div class="mr-4">
      <b-img
        class="img"
        src="/vectors/pro.svg"
        fluid
        :class="subscription ? '' : 'black-and-white'"
      >
      </b-img>
    </div>
    <div>
      <h3 class="inner-heading">
        {{ subscription ? subscription.name : "Inactive" }}
      </h3>

      <template v-if="!subscription">
        <h5 class="text-danger">
          No subscriptions found
        </h5>
        <b-button
          to="/profile/subscription"
          class="footy-button"
          variant="primary"
        >
          Upgrade To Pro
        </b-button>
      </template>
      <template v-else-if="subscription.trial">
        <h5 class="text-primary">
          {{ $moment.utc(subscription.end_date).local().fromNow("LL") }} until Free
          Trial Expires
        </h5>
        <b-button
          to="/profile/subscription"
          class="footy-button"
          variant="primary"
        >
          Upgrade To Pro
        </b-button>
      </template>
      <template v-else>
        <h5 class="text-primary">
          Active until {{ $moment.utc(subscription.end_date).local().format("LL") }}
        </h5>
        <h6 class="text-primary">
          <span class="text-grey">You have no limits. Enjoy</span>

          <!-- <span class="text-grey">Automatic Renewal</span> is
          {{ subscription.cancel_url ? "On" : "Off" }} -->
        </h6>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    subscription() {
      return this.$auth.user.subscription;
    }
  }
};
</script>

<style lang="scss">
@import "~assets/scss/breakpoints";
.black-and-white {
  -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
  filter: grayscale(100%);
}
.subscription-status {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 40px 30px;
  border-radius: 12px;
  .inner-heading {
    margin-bottom: 4px !important;
  }
  h5 {
    margin-bottom: 8px;
  }
  h6 {
    font-size: 18px;
    line-height: 27px;
  }
  h5 {
    font-weight: 600 !important;
  }
  h6 {
    font-size: 14px;
    line-height: 21px;
    span {
      font-weight: 600 !important;
    }
  }
}
@media (max-width: $lg) {
  .subscription-status {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    .img {
      width: 96px;
      height: 96px;
      margin-bottom: 16px;
      margin-right: 0px;
    }
  }
}
</style>
