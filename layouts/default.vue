<template>
  <div id="nuxt">
    <b-navbar
      toggleable="lg"
      type="light"
      variant="light"
      class="p-0 d-lg-none"
      style="border-bottom: 1px solid #e6e6e6"
      sticky
    >
      <b-button
        @click="sidebarOpen = !sidebarOpen"
        variant="transparent"
        class="p-2 m-0"
      >
        <span class="material-icons">
          {{ sidebarOpen ? "close" : "menu" }}
        </span>
      </b-button>
      <b-navbar-brand href="#" class="mr-auto">
        <b-img-lazy
          src="/logo.png"
          class="footy-mobile-logo"
          style="width: 100%"
        ></b-img-lazy
      ></b-navbar-brand>

      <div class="d-flex align-items-center px-2">
        <SidebarFooter class=""></SidebarFooter>
        <b-button
          class="avatar d-lg-none"
          @click="showNotifications = !showNotifications"
          style="width: 40px; height: 40px"
        >
          <img
            src="/icons/smallbell.svg"
            alt=""
            class="avatar-active"
            style="height: 100%; width: 100%"
          />

          <!-- <div v-if="notifications.length > 0" class="notification"></div> -->
        </b-button>
      </div>
    </b-navbar>
    <Sidebar v-model="sidebarOpen"> </Sidebar>
    <section class="footy-page-content">
      <Nuxt />
    </section>
  </div>
</template>
<script>
import Sidebar from "~/components/Sidebar";
import SidebarFooter from "~/components/common/SidebarFooter.vue";
export default {
  data() {
    return {
      sidebarOpen: false,
      showNotifications: false,
    };
  },
  components: {
    Sidebar,
    SidebarFooter,
  },
  middleware: ["auth"],
  mounted() {},
  methods: {},
};
</script>
<style lang="scss">
@import "~assets/scss/colors";
@import "~assets/scss/breakpoints";
.mobile-top-bar {
  background: #f7f9f7;
  z-index: 200 !important;
  padding: 20px !important;
  border-bottom: 1px solid #e6e6e6;
  //position: fixed;
}

.footy-page-content {
  padding-top: 15px;
  padding-bottom: 15px;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  //padding-bottom:200px;
}

#nuxt {
  //height: 100vh;
}

@media only screen and (min-width: $lg) {
  .footy-page-content {
    padding: 40px 25px;
    padding-left: 265px;
    //overflow-y: scroll;
  }
}
</style>
