<template>
  <div
    class="upgrade-to-pro centered"
    :class="[hoverMode ? 'hover-mode' : 'display-mode']"
    v-if="showUpgrade"
  >
    <div class="show-blur"><slot> </slot></div>
    <div class="show-upgrade ">
      <b-img
        class="img mb-4"
        src="/vectors/pro.svg"
        fluid
        height="85"
        width="85"
      >
      </b-img>
      <h1 class="header-size-1">
        Pro Subscription
      </h1>

      <h6 class="text-grey mb-1">
        {{ message }}
      </h6>
      <b-button
        class="footy-button footy-button-xs"
        variant="primary"
        to="/profile/subscription"
      >
        Upgrade to Pro
      </b-button>
    </div>
  </div>
  <div v-else>
    <slot> </slot>
  </div>
</template>

<script>
export default {
  props: {
    message: String,
    hoverMode: Boolean,
    showUpgrade: Boolean
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";
@import "~assets/scss/breakpoints";

.upgrade-to-pro {
  position: relative;
  height: 700px;
  overflow: hidden;
  // top: 0;
  // left: 0;
  // height: 100%;
  // width: 100%;
  // display: flex;
  // position: relative;
  // align-items: center;
  // justify-content: center;
  // &.hover-mode {
  //   .show-upgrade {
  //     display: none;
  //   }
  //   &:hover {
  //     background: $light;
  //   }
  //   &.is-trial:hover {
  //     .show-upgrade-content {
  //       filter: blur(18px);
  //     }
  //     .show-upgrade {
  //       display: flex;
  //       width: 100%;
  //       border-radius: 12px;
  //       height: 100%;
  //       flex-direction: column;
  //       position: absolute;
  //       top: 0px;
  //       row-gap: 4px;
  //       left: 0px;
  //       cursor: not-allowed;
  //       justify-content: center;
  //       padding: 20px;
  //       z-index: 2;
  //     }
  //   }
  // }
  &.display-mode {
    .show-upgrade {
      display: flex;
      flex-direction: column;
      row-gap: 12px;
      align-items: center;
      position: absolute;
      z-index: 2;
      // top: 0;
      // left: 0;
    }
    .show-blur {
      filter: blur(16px);
    }

    // background: $light;

    // .show-blur {
    //   display: flex;
    //   width: 100%;
    //   border-radius: 12px;
    //   height: 100%;
    //   flex-direction: column;
    //   position: absolute;
    //   top: 0px;
    //   row-gap: 4px;
    //   left: 0px;
    //   cursor: not-allowed;
    //   justify-content: center;
    //   padding: 20px;
    //   z-index: 2;
    // }
  }
}
@media screen and (max-width: $lg) {
  .upgrade-to-pro {
    height: 500px;
  }
}
</style>
