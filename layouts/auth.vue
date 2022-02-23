<template>
  <div>
    <b-row style="min-height: 100vh" class="auth-page">
      <b-col class="auth-col" lg="5" cols="12">
        <div class="">
          <div class="pb-3">
            <nuxt-link to="/">
              <b-img-lazy src="/logo.png" class="footy-logo"></b-img-lazy>
            </nuxt-link>
          </div>
          <Nuxt />
        </div>
      </b-col>
      <b-col
        class="bg-primary text-white auth-col d-none d-lg-block"
        md="7"
        cols="12"
      >
        <div class="centered flex-col row-gap-10">
          <div>
            <b-img src="/vectors/demo.png" class="demo-svg"> </b-img>
          </div>
          <h2 class="text-white">
            Bet With Confidence.
          </h2>
          <h6 class="text-white" style="opacity:0.9">
            Footy Amigo™ helps you bet smart and with confidence by providing
            you with the right information at the right time — before you place
            any bet. PreMatch Match Alerts, InPlay Match Alerts, 14+ Historical
            Years Stats and Many More!
          </h6>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import "~assets/scss/colors";
@import "~assets/scss/breakpoints";
.bg-primary {
  h1 {
    font-size: 48px;
    line-height: 72px;
    letter-spacing: -1px;
  }
  .auth-title {
    color: #ffffff !important;
  }
  .description-2 {
    font-size: 21px;
    line-height: 31px;
    color: white;
  }
}

.auth-page {
  .auth-col {
    transition: 1s;
    background: white;
    //padding: 60px 50px;
  }
  @media screen and (max-width: $sm) {
    .auth-col {
      padding: 20px;
    }
  }
  @media screen and (min-width: $lg) {
    .auth-col {
      padding: 40px;
    }
  }
  @media screen and (min-width: $lg) {
    .auth-col {
      padding: 60px 80px;
    }
  }
  .demo-svg {
    width: 90%;
  }
  .reset-remember {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .title {
    font-size: 48px;
    line-height: 72px;
    /* identical to box height */
    letter-spacing: -1px;
    /* text-1 */
    color: $dark-1;
  }
  .description-2 {
    font-size: 21px;
    line-height: 31px;
    opacity: 0.7;
  }
  .description {
    font-size: 16px;
    line-height: 24px;
    /* text-2 */
    color: #60685f;
  }
}
</style>
