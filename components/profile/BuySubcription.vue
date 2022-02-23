<template>
  <section class="pro-tab">
    <div class="pro-container">
      <div class="pro-wrapper">
        <div class="pro-content">
          <div class="pro-img">
            <img src="/icons/pro-img.svg" class="img-fluid" />
          </div>
          <div class="pro-text">
            <h3 class="main-heading">Switch to Pro!</h3>
            <h6 class="text-grey">
              Upgrade to Pro today and join the thousands of smart and
              profitable football bettors who use Footy Amigo to beat the
              Bookies daily
            </h6>
          </div>
        </div>
        <div class="pro-selections">
          <footy-radio
            :options="types"
            v-model="type"
            id="pro-selection"
            containerClass="flex-col scroll-on-mobile "
            radioClass="w-100"
          >
          </footy-radio>
        </div>
      </div>
      <div class="pro-form">
        <component v-bind:is="type"></component>
      </div>
    </div>
  </section>
</template>

<script>
import Card from "~/components/profile/Card";
import Local from "~/components/profile/Local";
import Crypto from "~/components/profile/Crypto";
import Stripe from "~/components/profile/Stripe";
export default {
  data() {
    return {
      types: [
        {
          value: "Card",
          text: "Pay via Card or Paypal",
        },
        {
          value: "Local",
          text: "Pay via Local Means",
        },
        {
          value: "Crypto",
          text: "Pay via Crypto",
        },
        {
          value: "Stripe",
          text: "Get 4 Months Free",
        },
      ],
      type: "Card",
    };
  },
  components: {
    Card,
    Local,
    Crypto,
    Stripe,
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";
@import "~assets/scss/breakpoints";
.pro-tab {
  .pro-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .main-heading,
    .sub-description {
      font-style: normal;
      font-weight: 600;
      font-size: 24px;
      line-height: 36px;
    }
    .sub-description {
      font-size: 14px;
      line-height: 21px;
      color: #60685f;
    }
    .pro-wrapper {
      background: #f7f9f7;
      border-radius: 12px;
      width: 100%;
      flex: 0 0 309px;
      max-width: 309px;
      width: 100%;
      padding: 30px 20px;
      .pro-text {
        margin-top: 20px;
        h3 {
          margin-bottom: 15px;
        }
      }
      .pro-selections {
        margin-top: 27px;
      }
    }
    .pro-form {
      flex: 0 0 calc(100% - 339px);
      max-width: calc(100% - 339px);
      width: 100%;
      // min-height: 30vh;
    }
  }
}

@media (max-width: $lg) {
  .pro-tab {
    .pro-container {
      .pro-wrapper,
      .pro-form {
        flex: 0 0 100%;
        max-width: 100%;
      }
      .pro-wrapper {
        .pro-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          .pro-img {
            order: 2;
            flex: 0 0 56px;
          }
          .pro-text {
            margin-top: 0px;
            flex: 0 0 calc(100% - 64px);
          }
          .pro-img {
            width: 56px;
            height: 56px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
        margin-bottom: 40px;
      }
    }
  }
}
</style>
