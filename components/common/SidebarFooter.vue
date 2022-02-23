<template>
  <nuxt-link to="/profile/account">
    <div
      class="sidebar-footer"
      v-if="$auth.user"
      :class="$store.getters.subscriptionType ? 'subscribed' : ''"
    >
      <div class="mx-1 mx-lg-2">
        <b-button
          variant="white"
          style="
              width: 40px;
              height: 40px;
              border-radius: 50%;
            
            "
          class="centered"
        >
          <PersonIcon />
        </b-button>
      </div>

      <div class="mx-1 mx-lg-2">
        <h6 class="">{{ $auth.user.firstname }}</h6>
        <h6 class="" v-if="!$auth.user.subscription">
          Free Account
        </h6>
        <h6 class="" v-else-if="$auth.user.subscription.trial">
          Trial Account
        </h6>
        <h6 class="" v-else>
          Pro Account
        </h6>
      </div>
      <div class="mx-1 mx-lg-2">
        <b-button
          variant="transparent "
          style="
              width: 20px;
              height: 20px;
              border-radius: 50%;
             
            "
          class="centered arrows"
        >
          <span class="material-icons-outlined d-lg-inline-block d-none">
            chevron_right
          </span>
          <span class="material-icons-outlined d-lg-none d-inline-block">
            expand_more
          </span>
        </b-button>
      </div>
     
    </div>
  </nuxt-link>
</template>

<script>
import PersonIcon from "~/static/icons/person.svg";
export default {
  components: {
    PersonIcon
  }
};
</script>

<style lang="scss">
@use "sass:map";

@import "~assets/scss/colors";
@import "~assets/scss/breakpoints";

.sidebar-footer {
  //position: absolute;
  //bottom: 0px;
  //left: 0px;
  padding: 20px 2px;

  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: $light;
  @media screen and (min-width: $lg) {
    &.subscribed {
      background: $primary;
      h6,
      .material-icons-outlined {
        color: white;
      }
    }
  }
}
</style>
